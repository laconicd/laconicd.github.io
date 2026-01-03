import Fuse from "fuse.js";

interface SearchItem {
  title: string;
  description: string;
  date: string;
  path: string;
  content: string;
}

export async function initSearch() {
  const searchInput = document.getElementById("search-input") as HTMLInputElement | null;
  const searchResults = document.getElementById("search-results");
  const modal = document.getElementById("search_modal") as any;

  if (!searchInput || !searchResults || !modal) return;

  let fuse: Fuse<SearchItem> | null = null;

  // Load search index lazily
  const loadIndex = async () => {
    if (fuse) return;
    try {
      // Zola produces search_index.[lang].js for fuse_javascript format
      const response = await fetch("/search_index.ko.js");
      if (!response.ok) throw new Error("Search index not found");
      
      const text = await response.text();
      // Extract JSON from "window.searchIndex = [...];"
      const jsonText = text.replace(/^window\.searchIndex\s*=\s*/, "").replace(/;$/, "");
      const data = JSON.parse(jsonText);
      
      if (data) {
        // Fuse index data can be the array itself or an object with a library property
        let list: any[] = Array.isArray(data) ? data : data.library;
        
        if (list) {
          // Remove duplicates based on path/url and filter out empty items
          const seen = new Set();
          list = list.filter(item => {
            const id = item.path || item.url;
            if (!id || seen.has(id)) return false;
            seen.add(id);
            // Filter out index pages like "/posts/", "/tags/", etc. if they have no content
            if (id.endsWith("/") && !item.title && !item.body) return false;
            return true;
          });

          fuse = new Fuse(list, {
            keys: [
              { name: "title", weight: 2.0 },
              { name: "description", weight: 0.5 },
              { name: "body", weight: 0.1 }
            ],
            threshold: 0.2,
            location: 0,
            distance: 100,
            minMatchCharLength: 2,
            ignoreLocation: false
          });
          console.log(`[Search] Index loaded with ${list.length} unique items.`);
        }
      }
    } catch (e) {
      console.error("[Search] Failed to load search index:", e);
    }
  };

  // Listen for modal opening to load index and focus
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "open" && modal.open) {
        loadIndex();
        setTimeout(() => searchInput.focus(), 50);
      }
    });
  });
  observer.observe(modal, { attributes: true });

  let selectedIndex = -1;

  // Shortcut key: Cmd+K or Ctrl+K
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      modal.showModal();
      return;
    }

    if (modal.open) {
      const results = searchResults.querySelectorAll("a");
      if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % results.length;
        updateSelection(results);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + results.length) % results.length;
        updateSelection(results);
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        results[selectedIndex].click();
      } else if (e.key === "Escape") {
        modal.close();
      }
    }
  };

  window.removeEventListener("keydown", handleKeyDown);
  window.addEventListener("keydown", handleKeyDown);

  function updateSelection(results: NodeListOf<HTMLAnchorElement>) {
    results.forEach((el, i) => {
      if (i === selectedIndex) {
        el.classList.add("bg-primary/10", "border-primary/20");
        el.scrollIntoView({ block: "nearest" });
      } else {
        el.classList.remove("bg-primary/10", "border-primary/20");
      }
    });
  }

  searchInput.addEventListener("input", async () => {
    await loadIndex();
    if (!fuse) return;

    const query = searchInput.value;
    selectedIndex = -1; 
    
    if (query.trim().length === 0) {
      if (searchResults) {
        searchResults.innerHTML = `
          <div class="p-12 text-center opacity-30 text-sm font-medium">
            Type to start searching...
          </div>
        `;
      }
      return;
    }

    const results = fuse.search(query).slice(0, 8);
    renderResults(results);
  });

  function renderResults(results: any[]) {
    if (!searchResults || !searchInput) return;
    
    if (results.length === 0) {
      searchResults.innerHTML = `
        <div class="p-12 text-center opacity-30 text-sm font-medium">
          No matches found for "${searchInput.value}".
        </div>
      `;
      return;
    }

    searchResults.innerHTML = results.map((result) => `
      <a href="${result.item.path}" class="group flex items-center gap-4 p-3 rounded-xl hover:bg-base-200 transition-colors border border-transparent hover:border-base-300 mb-1 last:mb-0">
        <div class="size-10 rounded-lg bg-base-200 flex items-center justify-center text-base-content/40 shrink-0 group-hover:bg-primary group-hover:text-primary-content transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-0.5">
            <h3 class="font-bold tracking-tight group-hover:text-primary transition-colors truncate text-sm">${result.item.title}</h3>
            <span class="text-[10px] font-black opacity-20 uppercase tracking-widest bg-base-300 px-1.5 py-0.5 rounded group-hover:opacity-100 transition-opacity ml-auto shrink-0">Post</span>
          </div>
          <p class="text-xs opacity-40 line-clamp-1 group-hover:opacity-70 transition-opacity font-medium">${result.item.description || result.item.body.substring(0, 100).replace(/[#*`]/g, "")}</p>
        </div>
      </a>
    `).join("");
  }
}
