/**
 * ThemeManager: Handles theme switching, persistence, and UI synchronization.
 */
export class ThemeManager {
  private readonly STORAGE_KEY = "theme";
  private readonly DARK_THEME = "dim";
  private readonly LIGHT_THEME = "lofi";

  /**
   * Initializes the theme from localStorage or system preference.
   */
  public init(): void {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY) ||
      (globalThis.matchMedia("(prefers-color-scheme: dark)").matches
        ? this.DARK_THEME
        : this.LIGHT_THEME);
    this.apply(savedTheme);
  }

  /**
   * Toggles the theme based on the checkbox state.
   */
  public toggle(isDark: boolean): void {
    const theme = isDark ? this.DARK_THEME : this.LIGHT_THEME;
    this.apply(theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
  }

  /**
   * Applies the theme to the document and synchronizes all controllers.
   */
  public apply(theme: string): void {
    document.documentElement.setAttribute("data-theme", theme);
    this.syncControllers(theme);
  }

  /**
   * Synchronizes all theme controller elements (e.g., checkboxes) with the current theme.
   */
  public syncControllers(theme: string): void {
    const controllers = document.querySelectorAll(".theme-controller");
    controllers.forEach((el) => {
      if (el instanceof HTMLInputElement) {
        el.checked = theme === this.DARK_THEME;
      }
    });
  }

  /**
   * Gets the current theme from the document.
   */
  public getCurrentTheme(): string {
    return document.documentElement.getAttribute("data-theme") ||
      this.LIGHT_THEME;
  }
}
