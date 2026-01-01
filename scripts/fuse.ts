import Fuse, { FuseResult } from "fuse.js";

// -- Interfaces --

interface Author {
  firstName: string;
  lastName: string;
}

interface SearchItem {
  title: string;
  author: Author;
  permalink?: string;
  path?: string;
  description?: string;
  content?: string;
}

declare global {
  var searchIndex: SearchItem[];

  interface Document {
    startViewTransition(
      updateCallback: () => Promise<void> | void,
    ): ViewTransition;
  }
}

/**
 * Service Layer: Handles the search logic and data indexing.
 */
class SearchService {
  private fuse: Fuse<SearchItem>;

  constructor(data: SearchItem[]) {
    this.fuse = new Fuse(data, {
      keys: ["title", "body", "description", "content"],
      includeMatches: true,
      threshold: 0.4,
    });
  }

  public search(query: string): FuseResult<SearchItem>[] {
    return this.fuse.search(query);
  }
}

/**
 * Presentation Layer: Handles HTML generation and UI updates.
 */
class SearchPresenter {
  constructor(private readonly container: HTMLElement) {}

  public render(results: FuseResult<SearchItem>[], query: string): void {
    if (results.length === 0) {
      this.container.innerHTML =
        `<li class="py-4 text-center text-base-content/50">No results found for "${query}"</li>`;
      return;
    }

    this.container.innerHTML = results
      .map((result) => this.createResultItemHTML(result))
      .join("");
  }

  public clear(): void {
    this.container.innerHTML = "";
  }

  private createResultItemHTML(result: FuseResult<SearchItem>): string {
    const item = result.item;
    const permalink = item.permalink || item.path || "#";

    let title = item.title;
    let description = item.description ? item.description : item.content ? item.content.substring(0, 150) + "..." : "";

    if (result.matches) {
      for (const match of result.matches) {
        if (match.key === "title") {
          title = this.highlight(
            item.title,
            match.indices as [number, number][],
          );
        } else if (match.key === "description" || match.key === "content") {
          const text = item.description || item.content || "";
          description = this.highlight(
            text.substring(0, 150) + (text.length > 150 ? "..." : ""),
            match.indices as [number, number][],
          );
        }
      }
    }

    return `
      <li class="py-2 border-b border-base-200">
        <a href="${permalink}" class="text-lg font-bold hover:text-primary transition-colors">${title}</a>
        ${description ? `<p class="text-sm text-base-content/70 mt-1">${description}</p>` : ""}
      </li>
    `;
  }

  private highlight(text: string, indices: [number, number][]): string {
    if (!indices || indices.length === 0) return text;

    const sortedMatches = [...indices].sort((a, b) => b[0] - a[0]);
    let highlightedText = text;

    for (const [start, end] of sortedMatches) {
      highlightedText = highlightedText.substring(0, start) +
        `<mark class="bg-primary/30 text-primary-content rounded-sm px-0.5">${
          highlightedText.substring(
            start,
            end + 1,
          )
        }</mark>` +
        highlightedText.substring(end + 1);
    }

    return highlightedText;
  }
}

/**
 * Application Layer: Orchestrates interactions between Service, Presenter, and DOM.
 */
export class SearchController {
  constructor(
    private readonly input: HTMLInputElement,
    private readonly service: SearchService,
    private readonly presenter: SearchPresenter,
  ) {}

  public attach(): void {
    this.input.addEventListener("input", () => this.handleInput());
  }

  private handleInput(): void {
    const query = this.input.value.trim();
    if (!query) {
      this.presenter.clear();
      return;
    }

    const results = this.service.search(query);
    this.presenter.render(results, query);
  }
}

/**
 * Main initialization entry point.
 */
export function initSearch(): void {
  const input = document.getElementById("search-input") as HTMLInputElement;
  const resultsContainer = document.getElementById(
    "search-results",
  ) as HTMLElement;

  if (!input || !resultsContainer) {
    return;
  }

  if (!globalThis.searchIndex) {
    console.error("Search index not found.");
    return;
  }

  const service = new SearchService(globalThis.searchIndex);
  const presenter = new SearchPresenter(resultsContainer);
  const controller = new SearchController(input, service, presenter);

  controller.attach();
}
