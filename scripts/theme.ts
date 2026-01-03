const STORAGE_KEY = "theme";
const DARK_THEME = "dim";
const LIGHT_THEME = "lofi";

/**
 * ThemeManager: Handles theme switching, persistence, and UI synchronization.
 */
export class ThemeManager {
  /**
   * Initializes the theme from localStorage or system preference.
   */
  public init(): void {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme) {
      this.apply(savedTheme);
    } else {
      const systemTheme = globalThis.matchMedia("(prefers-color-scheme: dark)").matches
        ? DARK_THEME
        : LIGHT_THEME;
      this.apply(systemTheme);
    }
    this.setupSystemListener();
  }

  /**
   * Listens for system theme changes and applies them if no manual preference is set.
   */
  private setupSystemListener(): void {
    const mediaQuery = globalThis.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", (e) => {
      // Only react if the user hasn't explicitly set a theme
      if (!localStorage.getItem(STORAGE_KEY)) {
        this.apply(e.matches ? DARK_THEME : LIGHT_THEME);
      }
    });
  }

  /**
   * Toggles the theme based on the checkbox state.
   */
  public toggle(isDark: boolean): void {
    const theme = isDark ? DARK_THEME : LIGHT_THEME;
    this.apply(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  /**
   * Applies the theme to the document and synchronizes all controllers.
   */
  public apply(theme: string): void {
    document.documentElement.setAttribute("data-theme", theme);
    this.updateSyntaxTheme(theme);
    this.syncControllers(theme);
  }

  /**
   * Updates the syntax highlighting CSS link based on the theme.
   */
  private updateSyntaxTheme(theme: string): void {
    let syntaxLink = document.getElementById("syntax-theme") as HTMLLinkElement | null;
    
    if (!syntaxLink) {
      syntaxLink = document.createElement("link");
      syntaxLink.id = "syntax-theme";
      syntaxLink.rel = "stylesheet";
      document.head.appendChild(syntaxLink);
    }
    
    const fileName = theme === DARK_THEME ? "ayu-dark.css" : "ayu-light.css";
    const newHref = `/${fileName}`;
    
    if (syntaxLink.href !== newHref) {
      syntaxLink.href = newHref;
    }
  }

  /**
   * Synchronizes all theme controller elements (e.g., checkboxes) with the current theme.
   */
  public syncControllers(theme: string): void {
    const controllers = document.querySelectorAll<HTMLInputElement>(".theme-controller");
    controllers.forEach((el) => {
      el.checked = theme === DARK_THEME;
    });
  }

  /**
   * Gets the current theme from the document.
   */
  public getCurrentTheme(): string {
    return document.documentElement.getAttribute("data-theme") || LIGHT_THEME;
  }

  /**
   * Static initialization to prevent FOUC (Flash of Unstyled Content).
   * This is intended to be called as early as possible.
   */
  public static initialize(): void {
    const theme = localStorage.getItem(STORAGE_KEY) ||
      (globalThis.matchMedia("(prefers-color-scheme: dark)").matches ? DARK_THEME : LIGHT_THEME);
    document.documentElement.setAttribute("data-theme", theme);

    // Initial syntax theme setup
    let syntaxLink = document.getElementById("syntax-theme") as HTMLLinkElement | null;
    if (!syntaxLink) {
      syntaxLink = document.createElement("link");
      syntaxLink.id = "syntax-theme";
      syntaxLink.rel = "stylesheet";
      document.head.appendChild(syntaxLink);
    }
    syntaxLink.href = `/${theme === DARK_THEME ? "ayu-dark.css" : "ayu-light.css"}`;
  }
}

// 즉시 실행하여 FOUC 방지
if (typeof document !== "undefined") {
  ThemeManager.initialize();
}
