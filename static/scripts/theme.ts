export {};

declare global {
  interface Window {
    __SYNTAX_THEME_URLS__?: Record<string, string>;
  }
}

class ThemeInitializer {
  private readonly themeAttr = "data-theme";
  private readonly storageKey = "theme";
  private readonly darkTheme = "dim";
  private readonly lightTheme = "lofi";

  constructor() {
    this.init();
  }

  private init(): void {
    const theme = this.getSavedTheme();

    // 1. HTML 태그에 테마 속성 즉시 적용 (FOUC 방지)
    document.documentElement.setAttribute(this.themeAttr, theme);

    // 2. Syntax 하이라이트 스타일시트 적용
    this.injectSyntaxTheme(theme);
  }

  private getSavedTheme(): string {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) return saved;

    // 저장된 테마가 없으면 시스템 설정 확인
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? this.darkTheme : this.lightTheme;
  }

  private injectSyntaxTheme(theme: string): void {
    const urls = window.__SYNTAX_THEME_URLS__ || {};
    const href = theme === this.darkTheme ? urls.dim : urls.lofi;

    if (!href || href === window.location.href) return;

    const link = document.createElement("link");
    link.id = "syntax-theme";
    link.classList.add("js-syntax-theme");
    link.rel = "stylesheet";
    link.href = href;

    document.head.appendChild(link);
  }
}

// ⚠️ 주의: DOMContentLoaded를 기다리지 않고 즉시 실행합니다.
new ThemeInitializer();
