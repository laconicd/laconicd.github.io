import { ThemeManager } from "./theme.ts";

/**
 * Handles fetching page content from a URL.
 */
class ContentLoader {
  public async fetchDocument(url: string): Promise<Document> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Content loading failed: ${response.status}`);
    }
    const htmlText = await response.text();
    return new DOMParser().parseFromString(htmlText, "text/html");
  }
}

/**
 * Handles UI updates and cleanup during navigation.
 */
class UIController {
  constructor(private readonly themeManager: ThemeManager) {}

  public updateDOM(newDoc: Document, shouldScroll: boolean): void {
    const currentTheme = this.themeManager.getCurrentTheme();
    const mainContent = document.getElementById("main-content");
    const newMainContent = newDoc.getElementById("main-content");

    if (mainContent && newMainContent) {
      mainContent.replaceWith(newMainContent);
    } else {
      document.body.innerHTML = newDoc.body.innerHTML;
    }
    
    this.hydrateDSD(document.body);

    document.title = newDoc.title;
    this.themeManager.apply(currentTheme);

    if (shouldScroll) {
      window.scrollTo(0, 0);
    }

    // [a11y] Focus management for SPA navigation
    const announcer = document.getElementById("route-announcer");
    if (announcer) {
      announcer.textContent = `${newDoc.title} 페이지가 로드되었습니다.`;
    }
    
    const mainElement = document.getElementById("main-content");
    if (mainElement) {
      mainElement.setAttribute("tabindex", "-1");
      mainElement.focus({ preventScroll: true });
    }

    this.notifyPageUpdate();
    this.cleanupUI();
  }

  public hydrateDSD(root: HTMLElement): void {
    root.querySelectorAll("template[shadowrootmode]").forEach((template) => {
      const mode = template.getAttribute("shadowrootmode") as "open" | "closed";
      const host = template.parentNode as HTMLElement;
      if (host && !host.shadowRoot) {
        try {
          const shadowRoot = host.attachShadow({ mode });
          shadowRoot.appendChild((template as HTMLTemplateElement).content);
        } catch (e) {
          console.warn("Shadow DOM hydration failed for", host, e);
        }
      }
      template.remove();
    });
  }

  private notifyPageUpdate(): void {
    window.dispatchEvent(new CustomEvent("page:updated"));
  }

  private cleanupUI(): void {
    this.closeElement("mobile-drawer", (el) => (el as HTMLInputElement).checked = false);
    this.closeElement("search_modal", (el) => (el as HTMLDialogElement).close());
    
    document.querySelectorAll<HTMLDetailsElement>("details[open]").forEach((el) => {
      el.open = false;
    });

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  private closeElement(id: string, closer: (el: HTMLElement) => void): void {
    const el = document.getElementById(id);
    if (el) closer(el);
  }
}

/**
 * Orchestrates navigation using the Navigation API or fallbacks.
 */
export class NavigationHandler {
  private readonly loader = new ContentLoader();
  private readonly ui: UIController;
  private readonly themeManager = new ThemeManager();

  constructor() {
    this.ui = new UIController(this.themeManager);
  }

  public init(): void {
    this.setupNavigationListeners();
    this.setupThemeListener();
    this.setupPageShowListener();
    this.themeManager.init();
    this.ui.hydrateDSD(document.body);
  }

  private setupNavigationListeners(): void {
    if ("navigation" in globalThis) {
      // @ts-ignore: Navigation API
      (globalThis as any).navigation.addEventListener("navigate", (event: any) => {
        if (!this.canIntercept(event)) return;

        event.intercept({
          handler: async () => {
            await this.performNavigation(
              event.destination.url,
              "fade-rise",
              event.navigationType !== "traverse"
            );
          },
        });
      });
    } else {
      document.addEventListener("click", this.handleLinkClick.bind(this));
      globalThis.addEventListener("popstate", this.handlePopState.bind(this));
    }
  }

  private canIntercept(event: any): boolean {
    const url = new URL(event.destination.url);
    return (
      url.origin === location.origin &&
      !event.hashChange &&
      event.canIntercept &&
      !event.downloadRequest &&
      !event.formData
    );
  }

  private setupThemeListener(): void {
    document.addEventListener("change", (event) => {
      const target = event.target as HTMLInputElement;
      if (target.classList.contains("theme-controller")) {
        this.themeManager.toggle(target.checked);
      }
    });
  }

  private setupPageShowListener(): void {
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) {
        window.dispatchEvent(new CustomEvent("page:updated"));
        this.ui.hydrateDSD(document.body);
      }
    });
  }

  private handleLinkClick(event: MouseEvent): void {
    const anchor = event.composedPath().find((el) => el instanceof HTMLAnchorElement) as HTMLAnchorElement | undefined;
    if (!anchor || !this.shouldInterceptLink(anchor, event)) return;

    event.preventDefault();
    history.pushState({}, "", anchor.href);
    this.performNavigation(anchor.href, "fade-rise", true);
  }

  private shouldInterceptLink(anchor: HTMLAnchorElement, event: MouseEvent): boolean {
    const url = new URL(anchor.href);
    return (
      url.origin === location.origin &&
      !anchor.getAttribute("href")?.startsWith("#") &&
      !anchor.getAttribute("href")?.startsWith("javascript:") &&
      anchor.target !== "_blank" &&
      !(event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
    );
  }

  private handlePopState(): void {
    this.performNavigation(globalThis.location.href, "fade-rise", false);
  }

  private async performNavigation(
    href: string,
    transitionType: string,
    shouldScroll: boolean = true,
  ): Promise<void> {
    try {
      const newDoc = await this.loader.fetchDocument(href);
      await this.renderWithTransition(newDoc, transitionType, shouldScroll);
    } catch (error) {
      console.error("Navigation failed:", error);
      globalThis.location.assign(href);
    }
  }

  private async renderWithTransition(
    newDoc: Document,
    transitionType: string,
    shouldScroll: boolean
  ): Promise<void> {
    if (!document.startViewTransition) {
      this.ui.updateDOM(newDoc, shouldScroll);
      return;
    }

    document.documentElement.dataset.transition = transitionType;
    const transition = document.startViewTransition(() => this.ui.updateDOM(newDoc, shouldScroll));
    
    try {
      await transition.finished;
    } finally {
      delete document.documentElement.dataset.transition;
    }
  }
}
