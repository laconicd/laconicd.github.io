import { initSearch } from "./fuse.ts";
import { ThemeManager } from "./theme.ts";

/**
 * Handles fetching and parsing the page content.
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
 */
class PagePresenter {
  constructor(private readonly themeManager: ThemeManager) {}

  public render(
    newDoc: Document,
    transitionType: string,
  ): void {
    if (!document.startViewTransition) {
      this.updateDOM(newDoc);
      return;
    }

    document.documentElement.dataset.transition = transitionType;
    document.startViewTransition(() => this.updateDOM(newDoc));
  }

  private updateDOM(newDoc: Document): void {
    const currentTheme = this.themeManager.getCurrentTheme();

    // Find the main content area in both the current and new document
    const currentMain = document.getElementById("main-content");
    const newMain = newDoc.getElementById("main-content");

    if (currentMain && newMain) {
      currentMain.replaceWith(newMain);
    } else {
      // Fallback if main content area is missing
      console.warn("Could not find #main-content, replacing body");
      document.body.replaceWith(newDoc.body);
    }

    document.title = newDoc.title;
    this.themeManager.apply(currentTheme);

    // Close mobile drawer if open
    const drawerToggle = document.getElementById("mobile-drawer") as HTMLInputElement;
    if (drawerToggle && drawerToggle.checked) {
      drawerToggle.checked = false;
    }

    // Close any open dropdowns (like the hamburger menu)
    document.querySelectorAll("details[open]").forEach((el) => {
      if (el instanceof HTMLDetailsElement) {
        el.open = false;
      }
    });

    // Close any other focused elements by blurring the active element
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }
}

/**
 * Orchestrates client-side navigation.
 */
class SpaRouter {
  private readonly pageFetcher = new PageFetcher();
  private readonly pagePresenter: PagePresenter;
  private readonly themeManager = new ThemeManager();

  private readonly navigationRules: Array<
    (anchor: HTMLAnchorElement, event: MouseEvent) => boolean
  > = [
    (anchor) => {
      const href = anchor.getAttribute("href");
      return !href || href === "" || href === "#" ||
        href.startsWith("javascript:");
    },
    (anchor) => new URL(anchor.href).origin !== globalThis.location.origin,
    (anchor, event) =>
      anchor.target === "_blank" || event.ctrlKey || event.metaKey ||
      event.shiftKey || event.altKey,
    (anchor) => {
      const url = new URL(anchor.href);
      return url.pathname === globalThis.location.pathname &&
        url.search === globalThis.location.search && url.hash !== "";
    },
  ];

  constructor() {
    this.pagePresenter = new PagePresenter(this.themeManager);
  }

  public attach(): void {
    if ("navigation" in globalThis) {
      // deno-lint-ignore no-explicit-any
      const nav = (globalThis as any).navigation;
      nav.addEventListener("navigate", (event: any) => {
        const url = new URL(event.destination.url);

        if (
          url.origin !== location.origin ||
          event.hashChange ||
          !event.canIntercept ||
          event.downloadRequest ||
          event.formData
        ) {
          return;
        }

        const isBackForward = event.navigationType === "traverse";

        event.intercept({
          scroll: "manual",
          handler: async () => {
            await this.performNavigation(url.href, "slide");
            if (isBackForward) {
              event.scroll();
            } else {
              globalThis.scrollTo(0, 0);
            }
          },
        });
      });
    } else {
      document.addEventListener("click", this.onLinkClick.bind(this));
      globalThis.addEventListener("popstate", this.onPopState.bind(this));
    }

    document.addEventListener("change", this.onThemeChange.bind(this));

    // Initial sync
    this.themeManager.init();
    initSearch();
  }

  private onThemeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.classList.contains("theme-controller")) {
      this.themeManager.toggle(target.checked);
    }
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
    const parent = target.nodeType === Node.TEXT_NODE
      ? target.parentNode
      : target;
    return (parent as Element)?.closest("a");
  }

  private shouldIntercept(
    anchor: HTMLAnchorElement,
    event: MouseEvent,
  ): boolean {
    const isBlocked = this.navigationRules.some((rule) => rule(anchor, event));
    return !isBlocked;
  }

  private navigate(href: string, transitionType: string): void {
    history.pushState({}, "", href);
    this.performNavigation(href, transitionType);
  }

  private async performNavigation(
    href: string,
    transitionType: string,
  ): Promise<void> {
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
