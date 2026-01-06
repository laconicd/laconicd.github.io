import { NavigationHandler } from "./navigation.ts";
import { initSpeculationRules } from "./speculation.ts";
import { initSearch } from "./fuse.ts";

async function bootstrap() {
  console.log("[Main] Bootstrapping modern web features...");

  // 1. Initialize Navigation (Navigation API + View Transitions)
  const nav = new NavigationHandler();
  nav.init();

  // 2. Initialize Speculation Rules (Prerendering)
  initSpeculationRules();

  // 3. Initialize search and other components
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
