class PostShareHandler {
  private shareBtn: HTMLElement | null;
  private shareModal: HTMLElement | null;
  private label: HTMLElement | null = null;
  private originalText: string = "";

  constructor() {
    this.shareBtn = document.querySelector(".js-share-btn");
    this.shareModal = document.getElementById("share_modal");

    if (this.shareBtn) {
      this.label = this.shareBtn.querySelector(".js-share-label");
      this.originalText = this.label?.innerText || "";
      this.initEvents();
    }
  }

  private initEvents(): void {
    if (!this.shareBtn) return;
    this.shareBtn.onclick = () => this.handleShare();
  }

  private async handleShare(): Promise<void> {
    const url = window.location.href;

    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url);
      this.onSuccess();
    } else {
      this.fallbackCopy(url);
    }
  }

  private fallbackCopy(text: string): void {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      this.onSuccess();
    } catch (err) {
      console.error("Copy failed", err);
    }
    document.body.removeChild(textArea);
  }

  private onSuccess(): void {
    if (!this.shareBtn || !this.label) return;

    this.shareBtn.classList.add("is-copied");
    this.label.innerText = "Copied!";

    // showPopover 타입 에러 방지를 위해 타입 가드 사용
    if (this.shareModal && "showPopover" in this.shareModal) {
      (this.shareModal as any).showPopover();
    }

    setTimeout(() => {
      this.shareBtn?.classList.remove("is-copied");
      if (this.label) this.label.innerText = this.originalText;
    }, 2000);
  }
}

// 인스턴스 생성
new PostShareHandler();
