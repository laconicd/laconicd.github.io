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
    keys: ["title", "body", "description", "content"],
    includeMatches: true,
    threshold: 0.4,
  });
}

// -- Rendering --

function highlight(text: string, matches: any[]): string {
  if (!matches || matches.length === 0) return text;
  
  // Sort matches by start index descending to avoid offset issues when replacing
  const sortedMatches = [...matches].sort((a, b) => b[0] - a[0]);
  let highlightedText = text;

  for (const [start, end] of sortedMatches) {
    highlightedText = 
      highlightedText.substring(0, start) + 
      `<mark class="bg-primary/30 text-primary-content rounded-sm px-0.5">${highlightedText.substring(start, end + 1)}</mark>` + 
      highlightedText.substring(end + 1);
  }

  return highlightedText;
}

function createResultItemHTML(result: FuseResult<SearchItem>): string {
  const item = result.item;
  const permalink = item.permalink || item.path || '#';
  
  let title = item.title;
  let description = item.description
    ? item.description
    : (item.content ? item.content.substring(0, 150) + "..." : "");

  // Apply highlighting if matches exist
  if (result.matches) {
    for (const match of result.matches) {
      if (match.key === 'title') {
        title = highlight(item.title, match.indices as any);
      } else if (match.key === 'description' || match.key === 'content') {
        const text = item.description || item.content || "";
        description = highlight(text.substring(0, 150) + (text.length > 150 ? "..." : ""), match.indices as any);
      }
    }
  }

  return `
    <li class="py-2 border-b border-base-200">
      <a href="${permalink}" class="text-lg font-bold hover:text-primary transition-colors">${title}</a>
      ${description ? `<p class="text-sm text-base-content/70 mt-1">${description}</p>` : ''}
    </li>
  `;
}

function renderResults(container: HTMLElement, results: FuseResult<SearchItem>[], query: string): void {
  if (results.length === 0) {
    container.innerHTML = `<li class="py-4 text-center text-base-content/50">No results found for "${query}"</li>`;
    return;
  }

  const html = results
    .map(result => createResultItemHTML(result))
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