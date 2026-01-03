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
    const currentMain = document.getElementById("main-content");
    const newMain = newDoc.getElementById("main-content");

    if (currentMain && newMain) {
      currentMain.replaceWith(newMain);
    } else {
      document.body.innerHTML = newDoc.body.innerHTML;
    }

    document.title = newDoc.title;
    this.themeManager.apply(currentTheme);

    if (shouldScroll) {
      window.scrollTo(0, 0);
    }

    window.dispatchEvent(new CustomEvent("page:updated"));
    this.cleanupUI();
  }

  private cleanupUI() {
    const drawerToggle = document.getElementById("mobile-drawer") as HTMLInputElement;
    if (drawerToggle && drawerToggle.checked) drawerToggle.checked = false;

    const searchModal = document.getElementById("search_modal") as HTMLDialogElement;
    if (searchModal && searchModal.open) searchModal.close();

    document.querySelectorAll("details[open]").forEach((el) => {
      if (el instanceof HTMLDetailsElement) el.open = false;
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

  constructor() {
    this.pagePresenter = new PagePresenter(this.themeManager);
  }

  public init(): void {
    if ("navigation" in globalThis) {
      // @ts-ignore: Navigation API
      const nav = (globalThis as any).navigation;
      nav.addEventListener("navigate", (event: any) => {
        const url = new URL(event.destination.url);
        if (url.origin !== location.origin || event.hashChange || !event.canIntercept || event.downloadRequest || event.formData) return;

        event.intercept({
          handler: async () => {
            await this.performNavigation(
              url.href, 
              "fade-rise",
              event.navigationType !== "traverse"
            );
          },
        });
      });
    } else {
      document.addEventListener("click", this.onLinkClick.bind(this));
      globalThis.addEventListener("popstate", this.onPopState.bind(this));
    }

    window.addEventListener("pageshow", (event) => {
      if (event.persisted) {
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
    history.pushState({}, "", href);
    this.performNavigation(href, "fade-rise", true);
  }

  private onPopState(): void {
    this.performNavigation(globalThis.location.href, "fade-rise", false);
  }

  private async performNavigation(
    href: string,
    transitionType: string,
    shouldScroll: boolean = true,
  ): Promise<void> {
    try {
      const newDoc = await this.pageFetcher.fetch(href);
      await this.pagePresenter.render(newDoc, transitionType, shouldScroll);
    } catch (error) {
      console.error("Navigation failed:", error);
      globalThis.location.assign(href);
    }
  }
}
