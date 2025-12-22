import { initSearch } from "./fuse.ts";

/**
 * Handles fetching and parsing the page content.
 * (Data Layer / Gateway)
 */
class PageFetcher {
    public async fetch(url: string): Promise<Document> {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch page: ${response.status}`);
        }
        const text = await response.text();
        const parser = new DOMParser();
        return parser.parseFromString(text, "text/html");
    }
}

/**
 * Handles rendering the new page content and managing view transitions.
 * (Presentation Layer)
 */
class PagePresenter {
    public render(newDoc: Document, transitionType: string): void {
        const performDOMUpdate = () => this.updateDOM(newDoc);

        if (!document.startViewTransition) {
            performDOMUpdate();
            return;
        }

        document.documentElement.dataset.transition = transitionType;
        const transition = document.startViewTransition(performDOMUpdate);
        transition.finished.finally(() => {
            // The 'data-transition' attribute can be removed here if desired
        });
    }

    private updateDOM(newDoc: Document): void {
        document.body.replaceWith(newDoc.body);
        document.title = newDoc.title;
        globalThis.scrollTo(0, 0);

        // This is a cross-cutting concern. A more advanced implementation
        // might use a custom event bus (e.g., on 'page:load').
        initSearch();
    }
}

/**
 * Orchestrates client-side navigation.
 * (Application/Use Case Layer)
 */
class SpaRouter {
    private readonly pageFetcher = new PageFetcher();
    private readonly pagePresenter = new PagePresenter();

    /** A declarative set of rules to determine if navigation should be intercepted.
     * Each rule is a function that returns `true` if interception should be **blocked**.
    */
    private readonly navigationRules: Array<(anchor: HTMLAnchorElement, event: MouseEvent) => boolean> = [
        // Block if the anchor has no valid href
        anchor => {
            const href = anchor.getAttribute("href");
            return !href || href === "" || href === "#" || href.startsWith("javascript:");
        },
        // Block if the link is external
        anchor => new URL(anchor.href).origin !== globalThis.location.origin,
        // Block for new tabs or modified clicks
        (anchor, event) => anchor.target === "_blank" || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey,
        // Block for same-page links with only a hash change
        anchor => {
            const url = new URL(anchor.href);
            return url.pathname === globalThis.location.pathname && url.search === globalThis.location.search && url.hash !== "";
        },
    ];

    /**
     * Attaches global event listeners to handle navigation.
     */
    public attach(): void {
        document.addEventListener("click", this.onLinkClick.bind(this));
        globalThis.addEventListener("popstate", this.onPopState.bind(this));
        initSearch(); // For the initial page load
    }

    private onLinkClick(event: MouseEvent): void {
        const anchor = this.findAnchor(event);
        if (!anchor || !this.shouldIntercept(anchor, event)) {
            return;
        }
        
        event.preventDefault();
        const href = anchor.getAttribute("href")!;
        const transitionType = anchor.getAttribute("data-transition") || "slide";
        this.navigate(href, transitionType);
    }
    
    private onPopState(): void {
        this.performNavigation(globalThis.location.href, "slide");
    }

    private findAnchor(event: MouseEvent): HTMLAnchorElement | null {
        const target = event.target as Node;
        const parent = target.nodeType === Node.TEXT_NODE ? target.parentNode : target;
        return (parent as Element)?.closest("a");
    }
    
    private shouldIntercept(anchor: HTMLAnchorElement, event: MouseEvent): boolean {
        const isBlocked = this.navigationRules.some(rule => rule(anchor, event));
        return !isBlocked;
    }

    private navigate(href: string, transitionType: string): void {
        history.pushState({}, "", href);
        this.performNavigation(href, transitionType);
    }

    private async performNavigation(href: string, transitionType: string): Promise<void> {
        try {
            console.log(`[Router] Navigating to: ${href}`);
            const newDoc = await this.pageFetcher.fetch(href);
            this.pagePresenter.render(newDoc, transitionType);
        } catch (error) {
            console.error("Navigation failed:", error);
            globalThis.location.assign(href); // Fallback to full page load
        }
    }
}

// Initialize and attach the router once the DOM is ready.
document.addEventListener("DOMContentLoaded", () => {
    new SpaRouter().attach();
});
