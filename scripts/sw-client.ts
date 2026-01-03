/**
 * Client-side Service Worker registration.
 */
export async function initServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      console.log("[SW] Registered with scope:", registration.scope);
    } catch (error) {
      console.error("[SW] Registration failed:", error);
    }
  }
}
