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

  public async render(
    newDoc: Document,
    transitionType: string,
    shouldScroll: boolean = true,
  ): Promise<void> {
    if (!document.startViewTransition) {
      this.updateDOM(newDoc, shouldScroll);
      return;
    }

    document.documentElement.dataset.transition = transitionType;
    const transition = document.startViewTransition(() => this.updateDOM(newDoc, shouldScroll));
    
    try {
      await transition.finished;
    } finally {
      delete document.documentElement.dataset.transition;
    }
  }

  private updateDOM(newDoc: Document, shouldScroll: boolean): void {
    const currentTheme = this.themeManager.getCurrentTheme();

    // Find the main content area in both the current and new document
    const currentMain = document.getElementById("main-content");
    const newMain = newDoc.getElementById("main-content");

    if (currentMain && newMain) {
      currentMain.replaceWith(newMain);
    } else {
      console.warn("Could not find #main-content, replacing body content");
      document.body.innerHTML = newDoc.body.innerHTML;
    }

    document.title = newDoc.title;
    this.themeManager.apply(currentTheme);

    if (shouldScroll) {
      window.scrollTo(0, 0);
    }

    // Re-initialize specific components or trigger events
    window.dispatchEvent(new CustomEvent("page:updated"));

    // UI Cleanup
    this.cleanupUI();
  }

  private cleanupUI() {
    // Close mobile drawer
    const drawerToggle = document.getElementById("mobile-drawer") as HTMLInputElement;
    if (drawerToggle && drawerToggle.checked) {
      drawerToggle.checked = false;
    }

    // Close search modal
    const searchModal = document.getElementById("search_modal") as HTMLDialogElement;
    if (searchModal && searchModal.open) {
      searchModal.close();
    }

    // Close dropdowns
    document.querySelectorAll("details[open]").forEach((el) => {
      if (el instanceof HTMLDetailsElement) {
        el.open = false;
      }
    });

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }
}

/**
 * Orchestrates client-side navigation using Navigation API and fallbacks.
 */
export class NavigationHandler {
  private readonly pageFetcher = new PageFetcher();
  private readonly pagePresenter: PagePresenter;
  private readonly themeManager = new ThemeManager();
  private lastClickedAnchor: HTMLAnchorElement | null = null;

  constructor() {
    this.pagePresenter = new PagePresenter(this.themeManager);
  }

  public init(): void {
    if ("navigation" in globalThis) {
      // @ts-ignore: Navigation API
      const nav = (globalThis as any).navigation;
      nav.addEventListener("navigate", (event: any) => {
        const url = new URL(event.destination.url);
        
        // Always intercept same-origin navigations that are "interceptable"
        const isSameOrigin = url.origin === location.origin;
        
        if (
          !isSameOrigin ||
          event.hashChange ||
          !event.canIntercept ||
          event.downloadRequest ||
          event.formData
        ) {
          return;
        }

        event.intercept({
          handler: async () => {
            const isBack = event.navigationType === "traverse";
            
            // Try to determine transition type from the last clicked element if possible
            // or default to slide/back
            let transitionType = isBack ? "back" : "slide";
            
            // If we have a clicked element stored (see below)
            if (this.lastClickedAnchor && this.lastClickedAnchor.href === url.href) {
              transitionType = this.lastClickedAnchor.getAttribute("data-transition") || transitionType;
            }
            
            await this.performNavigation(
              url.href, 
              transitionType,
              !isBack
            );
          },
        });
      });
    }

    // Always listen for clicks to store the last clicked anchor for transition hints
    document.addEventListener("click", (event) => {
      const anchor = (event.target as Element).closest("a");
      if (anchor) {
        this.lastClickedAnchor = anchor;
      }
    }, { capture: true });
    
    if (!("navigation" in globalThis)) {
      document.addEventListener("click", this.onLinkClick.bind(this));
      globalThis.addEventListener("popstate", this.onPopState.bind(this));
    }

    // BFCache handling
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) {
        console.log("[Navigation] Page restored from BFCache");
        window.dispatchEvent(new CustomEvent("page:updated"));
      }
    });

    this.themeManager.init();
  }

  private onLinkClick(event: MouseEvent): void {
    const anchor = (event.target as Element).closest("a");
    if (!anchor) return;

    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("javascript:") || anchor.target === "_blank") return;
    
    const url = new URL(anchor.href);
    if (url.origin !== location.origin) return;
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    const transitionType = anchor.getAttribute("data-transition") || "slide";
    
    history.pushState({}, "", href);
    this.performNavigation(href, transitionType, true);
  }

  private onPopState(): void {
    this.performNavigation(globalThis.location.href, "back", false);
  }

  private async performNavigation(
    href: string,
    transitionType: string,
    shouldScroll: boolean = true,
  ): Promise<void> {
    try {
      console.log(`[Navigation] Navigating to: ${href} (type: ${transitionType})`);
      const newDoc = await this.pageFetcher.fetch(href);
      await this.pagePresenter.render(newDoc, transitionType, shouldScroll);
    } catch (error) {
      console.error("Navigation failed:", error);
      globalThis.location.assign(href);
    }
  }
}
