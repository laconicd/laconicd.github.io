export {};

declare global {
  interface Window {
    __SYNTAX_THEME_URLS__?: Record<string, string>;
  }
}

class ThemeManager {
  private readonly themeAttr = "data-theme";
  private readonly darkTheme = "dim";
  private readonly lightTheme = "lofi";
  private readonly storageKey = "theme";

  constructor() {
    this.init();
  }

  private init(): void {
    // 초기 로드 시 실행
    document.addEventListener("DOMContentLoaded", () => this.syncControllers());
    window.addEventListener("page:updated" as any, () => this.syncControllers());

    // 전역 이벤트 위임 (Change)
    document.addEventListener("change", (e) => this.handleChange(e));
  }

  /**
   * 모든 테마 컨트롤러(Checkbox)의 상태를 현재 테마에 맞게 동기화
   */
  private syncControllers(): void {
    const currentTheme = document.documentElement.getAttribute(this.themeAttr);
    const isDark = currentTheme === this.darkTheme;

    this.getControllers().forEach((el) => {
      el.checked = isDark;
    });
  }

  /**
   * 테마 변경 이벤트 핸들러
   */
  private handleChange(e: Event): void {
    const target = e.target as HTMLInputElement;

    if (target && target.classList.contains("theme-controller")) {
      const isDark = target.checked;
      const newTheme = isDark ? this.darkTheme : this.lightTheme;

      this.applyTheme(newTheme);
      this.syncControllers(); // 다른 컨트롤러들도 함께 업데이트
    }
  }

  /**
   * 테마를 실제로 적용하고 저장하는 로직
   */
  private applyTheme(theme: string): void {
    document.documentElement.setAttribute(this.themeAttr, theme);
    localStorage.setItem(this.storageKey, theme);

    // 구문 강조(Syntax) 테마 업데이트
    const link = document.getElementById("syntax-theme") as HTMLLinkElement | null;
    if (link && window.__SYNTAX_THEME_URLS__) {
      link.href = window.__SYNTAX_THEME_URLS__[theme];
    }
  }

  private getControllers(): NodeListOf<HTMLInputElement> {
    return document.querySelectorAll<HTMLInputElement>(".theme-controller");
  }
}

// 매니저 실행
new ThemeManager();
