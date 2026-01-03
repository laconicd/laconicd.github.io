import Fuse from "fuse.js";

interface SearchItem {
  title: string;
  description: string;
  date: string;
  path: string;
  body: string;
}

/**
 * Handles the search index loading and searching logic.
 */
class SearchEngine {
  private fuse: Fuse<SearchItem> | null = null;
  private readonly INDEX_URL = "/search_index.ko.js";

  public async getFuse(): Promise<Fuse<SearchItem> | null> {
    if (this.fuse) return this.fuse;

    try {
      const response = await fetch(this.INDEX_URL);
      if (!response.ok) throw new Error("Search index not found");

      const rawText = await response.text();
      const jsonText = rawText
        .replace(/^window\.searchIndex\s*=\s*/, "")
        .replace(/;$/, "");
      const data = JSON.parse(jsonText);

      const list = Array.isArray(data) ? data : data.library;
      if (!list) return null;

      const processedList = this.processIndexItems(list);
      this.fuse = new Fuse(processedList, {
        keys: [
          { name: "title", weight: 2.0 },
          { name: "description", weight: 0.5 },
          { name: "body", weight: 0.1 },
        ],
        threshold: 0.2,
        minMatchCharLength: 2,
      });

      return this.fuse;
    } catch (error) {
      console.error("[SearchEngine] Load failed:", error);
      return null;
    }
  }

  private processIndexItems(items: any[]): SearchItem[] {
    const seenPaths = new Set<string>();
    return items.filter((item) => {
      const path = item.path || item.url;
      if (!path || seenPaths.has(path)) return false;
      seenPaths.add(path);

      // Filter out empty section pages
      if (path.endsWith("/") && !item.title && !item.body) return false;
      return true;
    });
  }
}

/**
 * Manages the Search UI interactions and rendering.
 */
class SearchUI {
  private readonly input: HTMLInputElement;
  private readonly results: HTMLElement;
  private readonly modal: HTMLDialogElement;
  private selectedIndex = -1;

  constructor(
    private readonly engine: SearchEngine,
    elements: {
      input: HTMLInputElement;
      results: HTMLElement;
      modal: HTMLDialogElement;
    },
  ) {
    this.input = elements.input;
    this.results = elements.results;
    this.modal = elements.modal;

    this.setupListeners();
  }

  private setupListeners(): void {
    this.input.addEventListener("input", () => this.handleInput());
    window.addEventListener("keydown", (e) => this.handleGlobalKeydown(e));
    this.setupModalObserver();
  }

  private setupModalObserver(): void {
    const observer = new MutationObserver(() => {
      if (this.modal.open) {
        this.engine.getFuse(); // Preload
        setTimeout(() => this.input.focus(), 50);
      }
    });
    observer.observe(this.modal, { attributes: true, attributeFilter: ["open"] });
  }

  private async handleInput(): Promise<void> {
    const query = this.input.value.trim();
    this.selectedIndex = -1;

    if (!query) {
      this.renderPlaceholder("Type to start searching...");
      return;
    }

    const fuse = await this.engine.getFuse();
    if (!fuse) return;

    const matches = fuse.search(query).slice(0, 8);
    this.renderResults(matches, query);
  }

  private handleGlobalKeydown(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      this.modal.showModal();
      return;
    }

    if (!this.modal.open) return;

    const items = this.results.querySelectorAll("a");
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        this.selectedIndex = (this.selectedIndex + 1) % items.length;
        this.updateSelection(items);
        break;
      case "ArrowUp":
        e.preventDefault();
        this.selectedIndex = (this.selectedIndex - 1 + items.length) % items.length;
        this.updateSelection(items);
        break;
      case "Enter":
        if (this.selectedIndex >= 0) {
          e.preventDefault();
          items[this.selectedIndex].click();
        }
        break;
      case "Escape":
        this.modal.close();
        break;
    }
  }

  private updateSelection(items: NodeListOf<HTMLAnchorElement>): void {
    items.forEach((item, i) => {
      const isSelected = i === this.selectedIndex;
      item.classList.toggle("bg-primary/10", isSelected);
      item.classList.toggle("border-primary/20", isSelected);
      if (isSelected) item.scrollIntoView({ block: "nearest" });
    });
  }

  private renderPlaceholder(text: string): void {
    this.results.innerHTML = `
      <div class="p-12 text-center opacity-30 text-sm font-medium">${text}</div>
    `;
  }

  private renderResults(matches: any[], query: string): void {
    if (matches.length === 0) {
      this.renderPlaceholder(`No matches found for "${query}".`);
      return;
    }

    this.results.innerHTML = matches
      .map((match) => this.createResultTemplate(match.item))
      .join("");
  }

  private createResultTemplate(item: SearchItem): string {
    const description = item.description || 
      item.body.substring(0, 100).replace(/[#*`]/g, "");

    return `
      <a href="${item.path}" class="group flex items-center gap-4 p-3 rounded-xl hover:bg-base-200 transition-colors border border-transparent hover:border-base-300 mb-1 last:mb-0">
        <div class="size-10 rounded-lg bg-base-200 flex items-center justify-center text-base-content/40 shrink-0 group-hover:bg-primary group-hover:text-primary-content transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-0.5">
            <h3 class="font-bold tracking-tight group-hover:text-primary transition-colors truncate text-sm">${item.title}</h3>
            <span class="text-[10px] font-black opacity-20 uppercase tracking-widest bg-base-300 px-1.5 py-0.5 rounded group-hover:opacity-100 transition-opacity ml-auto shrink-0">Post</span>
          </div>
          <p class="text-xs opacity-40 line-clamp-1 group-hover:opacity-70 transition-opacity font-medium">${description}</p>
        </div>
      </a>
    `;
  }
}

/**
 * Entry point for initializing search functionality.
 */
export function initSearch(): void {
  const elements = {
    input: document.getElementById("search-input") as HTMLInputElement,
    results: document.getElementById("search-results"),
    modal: document.getElementById("search_modal") as HTMLDialogElement,
  };

  if (elements.input && elements.results && elements.modal) {
    new SearchUI(new SearchEngine(), {
      input: elements.input,
      results: elements.results,
      modal: elements.modal,
    });
  }
}
