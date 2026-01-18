/**
 * Search Modal Logic using Fuse.js
 */
import Fuse from "https://esm.sh/fuse.js@7.1.0";

interface SearchItem {
  title: string;
  path: string;
  content: string;
}

interface Window {
  searchIndex?: SearchItem[];
}

const setupSearch = () => {
  const searchModal = document.getElementById("search_modal") as any;
  const searchInput = document.getElementById(
    "modal-search-input",
  ) as HTMLInputElement;
  const resultsContainer = document.getElementById("modal-search-results");

  if (!searchModal || !searchInput || !resultsContainer) return;

  const list = (window as any).searchIndex || [];

  const fuse = new Fuse(list, {
    includeScore: true,
    includeMatches: true,
    threshold: 0.4, // 조정된 임계값
    ignoreLocation: true,
    keys: ["title", "content"],
  });

  searchInput.addEventListener("input", (e: any) => {
    const query = e.target.value.trim();

    if (query.length === 0) {
      resultsContainer.innerHTML =
        '<div class="empty-state">Start typing to find what you\'re looking for...</div>';
      return;
    }

    const rawResults = fuse.search(query);

    const uniqueResults: any[] = [];
    const seenPaths = new Set();

    for (const res of rawResults) {
      if (!seenPaths.has(res.item.path)) {
        seenPaths.add(res.item.path);
        uniqueResults.push(res);
      }
      if (uniqueResults.length >= 10) break;
    }

    if (uniqueResults.length > 0) {
      resultsContainer.innerHTML = uniqueResults
        .map((result) => {
          let titleHTML = result.item.title;
          const titleMatch = result.matches?.find((m) => m.key === "title");

          if (titleMatch) {
            let highlighted = "";
            let lastIndex = 0;
            const sortedIndices = [...titleMatch.indices].sort(
              (a, b) => a[0] - b[0],
            );

            for (const [start, end] of sortedIndices) {
              highlighted += result.item.title.substring(lastIndex, start);
              highlighted += `<mark>${result.item.title.substring(start, end + 1)}</mark>`;
              lastIndex = end + 1;
            }
            highlighted += result.item.title.substring(lastIndex);
            titleHTML = highlighted;
          }

          return `
        <a href="${result.item.path}" class="result-item">
          <span class="title">${titleHTML}</span>
          <span class="path">${result.item.path}</span>
        </a>
      `;
        })
        .join("");
    } else {
      resultsContainer.innerHTML =
        '<div class="empty-state">No results found for your query.</div>';
    }
  });

  searchModal.addEventListener("toggle", (e: any) => {
    if (e.newState === "open") {
      setTimeout(() => searchInput.focus(), 100);
    } else {
      searchInput.value = "";
      resultsContainer.innerHTML =
        '<div class="empty-state">Start typing to find what you\'re looking for...</div>';
    }
  });

  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      searchModal.showPopover();
    }
  });
};

// searchIndex가 로드된 후 실행되도록 약간의 지연 또는 체크 필요
if ((window as any).searchIndex) {
  setupSearch();
} else {
  // searchIndex 로드를 기다림 (간단하게 DOMContentLoaded 이후 체크)
  document.addEventListener("DOMContentLoaded", setupSearch);
}
