import { initSearch } from "./fuse.ts";

function updateDOM(newDoc: Document) {
  // Replace the body content
  // Note: This replaces the entire body, so any event listeners directly on body elements (unlike our delegated one on document) will be lost.
  // The delegated listener on 'document.body' might be lost if we replace document.body itself with newDoc.body?
  // Yes, document.body.replaceWith(...) replaces the node.
  // The listener in DOMContentLoaded was attached to `document.body`.
  // If we replace `document.body`, that listener is gone.
  // Better to attach listener to `document` or re-attach.
  
  document.body.replaceWith(newDoc.body);
  document.title = newDoc.title;
  
  // Re-initialize search
  initSearch();
  
  // Scroll to top (native navigation behavior)
  globalThis.scrollTo(0, 0);
}

async function handleNavigation(url: string, transitionType: string = 'slide') {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Response status: ${response.status}`);
    
    const text = await response.text();
    const parser = new DOMParser();
    const newDoc = parser.parseFromString(text, 'text/html');

    if (document.startViewTransition) {
        // Set transition type on the root element
        document.documentElement.dataset.transition = transitionType;
        
        const transition = document.startViewTransition(() => updateDOM(newDoc));
        
        // Clean up after transition
        try {
            await transition.finished;
        } finally {
            // Optional: remove attribute if you want to reset, or leave it
            // document.documentElement.removeAttribute('data-transition');
        }
    } else {
      updateDOM(newDoc);
    }
  } catch (err) {
    console.error("Navigation failed:", err);
    globalThis.location.href = url; // Fallback
  }
}

document.addEventListener("DOMContentLoaded", () => {
    // Initial init
    initSearch();

    // Use 'document' instead of 'document.body' for delegation so it persists across body swaps
    document.addEventListener("click", (e) => {
        let target = e.target as Node;
        
        // Handle text nodes
        if (target.nodeType === Node.TEXT_NODE) {
            target = target.parentNode as Node;
        }

        const anchor = (target as Element).closest("a");
        if (!anchor) return;
        
        const href = anchor.getAttribute("href");
        if (!href) return;
        
        console.log(`[Link Click] href: ${href}`);
        
        // Ignore empty links or just hashes if logic requires
        if (href === "" || href === "#") return;

        // Resolve absolute URL
        const url = new URL(href, globalThis.location.origin);
        
        // Check for external links
        if (url.origin !== globalThis.location.origin) return;
        
        // Check for new tab or modifiers
        if (anchor.target === "_blank") return;
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
        
        // Check if it's just a hash change on same page
        if (url.pathname === globalThis.location.pathname && url.search === globalThis.location.search && url.hash) {
             // Let default behavior handle hash scroll
             return;
        }

        e.preventDefault();
        
        // Get transition type from attribute, default to 'slide'
        const transitionType = anchor.getAttribute('data-transition') || 'slide';

        history.pushState({}, "", href);
        handleNavigation(href, transitionType);
    });

    globalThis.addEventListener("popstate", () => {
        handleNavigation(globalThis.location.href, 'slide'); // Default transition for back/forward
    });
});
