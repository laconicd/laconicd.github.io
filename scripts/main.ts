import { NavigationHandler } from "./navigation.ts";
import { initSpeculationRules } from "./speculation.ts";
import { storage } from "./storage.ts";
import { initServiceWorker } from "./sw-client.ts";
import { initSearch } from "./fuse.ts";

async function bootstrap() {
  console.log("[Main] Bootstrapping modern web features...");

  // 1. Initialize Storage (IndexedDB)
  try {
    await storage.init();
  } catch (e) {
    console.warn("[Main] Storage initialization failed", e);
  }

  // 2. Initialize Navigation (Navigation API + View Transitions)
  const nav = new NavigationHandler();
  nav.init();

  // 3. Initialize Speculation Rules (Prerendering)
  initSpeculationRules();

  // 4. Initialize Service Worker (Persistent background logic)
  initServiceWorker();

  // 5. Initialize search and other components
  initSearch();
}

// Initial initialization
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}

// Handle re-initialization on page updates (MPA -> SPA behavior)
window.addEventListener("page:updated", () => {
  console.log("[Main] Page updated, re-initializing components...");
  initSpeculationRules();
  // We don't need to re-init search if it's outside #main-content, 
  // but if it is inside, we do.
  initSearch();
});
