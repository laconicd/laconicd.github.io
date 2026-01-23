import Fuse from "fuse.js";

export {};

// 1. 전역 타입 정의
interface SearchItem {
  title: string;
  path: string;
  url?: string;
  content?: string;
  body?: string;
}

declare global {
  interface Window {
    searchIndex?: SearchItem[] | { docs: SearchItem[] };
  }
}

class SearchManager {
  private fuse: Fuse<SearchItem> | null = null;
  private readonly searchModal: HTMLElement & { showPopover?: () => void; newState?: string };
  private readonly searchInput: HTMLInputElement;
  private readonly resultsContainer: HTMLElement;

  constructor() {
    this.searchModal = document.getElementById("search_modal") as any;
    this.searchInput = document.querySelector(".js-search-input") as HTMLInputElement;
    this.resultsContainer = document.querySelector(".js-search-results") as HTMLElement;

    if (this.isValid()) {
      this.initFuse();
      this.initEvents();
    }
  }

  private isValid(): boolean {
    return !!(this.searchModal && this.searchInput && this.resultsContainer);
  }

  private initFuse(): void {
    const rawData = window.searchIndex;
    let list: SearchItem[] = [];

    if (Array.isArray(rawData)) {
      list = rawData;
    } else if (rawData && typeof rawData === "object" && "docs" in rawData) {
      list = (rawData as any).docs;
    }

    if (!list || list.length === 0) return;

    this.fuse = new Fuse(list, {
      includeScore: true,
      includeMatches: true,
      threshold: 0.4,
      ignoreLocation: true,
      keys: ["title", "content", "body"],
    });
  }

  private initEvents(): void {
    // 입력 이벤트
    this.searchInput.addEventListener("input", (e) => this.handleInput(e));

    // 모달 토글 이벤트 (Popover API 대응)
    this.searchModal.addEventListener("toggle", (e: any) => {
      if (e.newState === "open") {
        setTimeout(() => this.searchInput.focus(), 100);
      } else {
        this.clearSearch();
      }
    });

    // 단축키 (Cmd/Ctrl + K)
    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        this.searchModal.showPopover?.();
      }
    });
  }

  private handleInput(e: Event): void {
    const target = e.target as HTMLInputElement;
    const query = target.value.trim();

    if (query.length === 0) {
      this.renderEmptyState("Start typing to find what you're looking for...");
      return;
    }

    if (!this.fuse) {
      this.initFuse();
      if (!this.fuse) return;
    }

    const rawResults = this.fuse.search(query);
    const uniqueResults = this.getUniqueResults(rawResults, 10);

    if (uniqueResults.length > 0) {
      this.renderResults(uniqueResults);
    } else {
      this.renderEmptyState("No results found for your query.");
    }
  }

  /**
   * 중복 경로 제거 및 개수 제한
   */
  private getUniqueResults(results: any[], limit: number): any[] {
    const unique: any[] = [];
    const seenPaths = new Set();

    for (const res of results) {
      const path = res.item.path || res.item.url;
      if (!seenPaths.has(path)) {
        seenPaths.add(path);
        unique.push(res);
      }
      if (unique.length >= limit) break;
    }
    return unique;
  }

  /**
   * 검색 결과 하이라이트 및 렌더링
   */
  private renderResults(results: any[]): void {
    this.resultsContainer.innerHTML = results
      .map((result) => {
        const titleHTML = this.highlightText(
          result.item.title,
          result.matches?.find((m: any) => m.key === "title"),
        );
        const path = result.item.path || result.item.url || "#";

        return `
          <a href="${path}" class="result-item">
            <span class="title">${titleHTML}</span>
            <span class="path">${path}</span>
          </a>
        `;
      })
      .join("");
  }

  private highlightText(text: string, match: any): string {
    if (!match) return text;

    let highlighted = "";
    let lastIndex = 0;
    const sortedIndices = [...match.indices].sort((a, b) => a[0] - b[0]);

    for (const [start, end] of sortedIndices) {
      highlighted += text.substring(lastIndex, start);
      highlighted += `<mark>${text.substring(start, end + 1)}</mark>`;
      lastIndex = end + 1;
    }
    highlighted += text.substring(lastIndex);
    return highlighted;
  }

  private renderEmptyState(message: string): void {
    this.resultsContainer.innerHTML = `<div class="empty-state">${message}</div>`;
  }

  private clearSearch(): void {
    this.searchInput.value = "";
    this.renderEmptyState("Start typing to find what you're looking for...");
  }
}

// 인스턴스 초기화
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new SearchManager());
} else {
  new SearchManager();
}
