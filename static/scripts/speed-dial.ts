export {};

declare global {
  interface Window {
    __POST_LIST__?: string[];
  }
}

class SpeedDialManager {
  private readonly dial: HTMLElement | null;
  private readonly searchModal: (HTMLElement & { showPopover?: () => void }) | null;
  private readonly posts: string[];

  constructor() {
    this.dial = document.querySelector(".js-speed-dial");
    this.searchModal = document.querySelector(".js-search-modal") as any;
    this.posts = window.__POST_LIST__ || [];

    if (this.dial) {
      this.init();
    }
  }

  private init(): void {
    // 초기 테마 상태 동기화
    this.syncThemeState();

    // 이벤트 리스너 등록
    this.initClickEvents();

    // 외부 클릭 시 닫기
    document.addEventListener("click", (e) => this.handleOutsideClick(e));

    // 페이지 업데이트 이벤트 대응
    window.addEventListener("page:updated" as any, () => {
      this.syncThemeState();
      this.closeDial();
    });
  }

  private initClickEvents(): void {
    const trigger = document.querySelector(".js-speed-dial-trigger");
    const topBtn = document.querySelector(".js-speed-dial-top");
    const searchBtn = document.querySelector(".js-speed-dial-search");
    const randomBtn = document.querySelector(".js-speed-dial-random");

    // 메인 트리거 (토글)
    trigger?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.dial?.classList.toggle("is-open");
    });

    // 위로 가기
    topBtn?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.closeDial();
    });

    // 검색 모달 열기
    searchBtn?.addEventListener("click", () => {
      this.searchModal?.showPopover?.();
      this.closeDial();
    });

    // 랜덤 포스트 이동
    if (randomBtn && this.posts.length > 0) {
      randomBtn.addEventListener("click", () => this.handleRandomPost());
    }
  }

  private handleRandomPost(): void {
    const currentPath = window.location.pathname; // href보다 pathname이 비교에 안전합니다.
    const otherPosts = this.posts.filter((p) => !p.includes(currentPath));
    const targetPosts = otherPosts.length > 0 ? otherPosts : this.posts;

    const randomPost = targetPosts[Math.floor(Math.random() * targetPosts.length)];
    window.location.href = randomPost;
  }

  private syncThemeState(): void {
    if (!this.dial) return;
    const isDark = document.documentElement.getAttribute("data-theme") === "dim";

    const controllers = this.dial.querySelectorAll<HTMLInputElement>(".js-theme-input");
    controllers.forEach((el) => {
      el.checked = isDark;
    });
  }

  private handleOutsideClick(e: MouseEvent): void {
    if (this.dial && !this.dial.contains(e.target as Node)) {
      this.closeDial();
    }
  }

  private closeDial(): void {
    this.dial?.classList.remove("is-open");
  }
}

// 초기화
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new SpeedDialManager());
} else {
  new SpeedDialManager();
}
