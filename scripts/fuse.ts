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

interface SearchElements {
  input: HTMLInputElement;
  resultsContainer: HTMLElement;
}

declare global {
  var searchIndex: SearchItem[];

  interface Document {
    startViewTransition(updateCallback: () => Promise<void> | void): ViewTransition;
  }
}

// -- Logic --

function getSearchElements(): SearchElements | null {
  const input = document.getElementById('search-input') as HTMLInputElement;
  const resultsContainer = document.getElementById('search-results') as HTMLElement;

  if (!input || !resultsContainer) {
    console.warn("Search elements not found in the DOM.");
    return null;
  }
  return { input, resultsContainer };
}

function initializeFuse(data: SearchItem[]): Fuse<SearchItem> {
  return new Fuse(data, {
    keys: ["title", "body", "description"],
    // threshold: 0.6,
  });
}

// -- Rendering --

function createResultItemHTML(item: SearchItem): string {
  const permalink = item.permalink || item.path || '#';
  const title = item.title;
  const description = item.description
    ? item.description
    : (item.content ? item.content.substring(0, 150) + "..." : "");

  return `
    <li class="py-2 border-b border-base-200">
      <a href="${permalink}" class="text-lg font-serif hover:text-primary">${title}</a>
      ${description ? `<p class="text-sm text-base-content/70">${description}</p>` : ''}
    </li>
  `;
}

function renderResults(container: HTMLElement, results: FuseResult<SearchItem>[], query: string): void {
  if (results.length === 0) {
    container.innerHTML = `<li>No results found for "${query}"</li>`;
    return;
  }

  const html = results
    .map(result => createResultItemHTML(result.item))
    .join('');

  container.innerHTML = html;
}

// -- Main Initialization --

// Start the search functionality
// Export initSearch to be used by main.ts
export function initSearch(): void {
  const elements = getSearchElements();
  if (!elements) return;

  if (!globalThis.searchIndex) {
    console.error("Fusion search index not found. Ensure search_index.js is loaded before fuse.js");
    return;
  }

  const { input, resultsContainer } = elements;
  // const fuse = initializeFuse(MOCK_DATA);
  const fuse = initializeFuse(globalThis.searchIndex);

  const handleInput = () => {
    const query = input.value;
    if (!query) {
      resultsContainer.innerHTML = '';
      return;
    }
    const results = fuse.search(query);
    // console.log("Results:", results);
    renderResults(resultsContainer, results, query);
  };

  input.addEventListener('input', handleInput);
}