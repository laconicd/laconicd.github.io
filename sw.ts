/// <reference lib="webworker" />

const CACHE_NAME = "laconicd-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/styles.css",
  "/main.js",
];

self.addEventListener("install", (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  (self as any).skipWaiting();
});

self.addEventListener("activate", (event: any) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    })
  );
  (self as any).clients.claim();
});

self.addEventListener("fetch", (event: any) => {
  // Navigation requests: Try network first, then cache
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/"))
    );
    return;
  }

  // Other requests: Stale-while-revalidate strategy
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchedResponse = fetch(event.request).then((networkResponse) => {
        // Only cache valid GET responses
        if (!networkResponse || networkResponse.status !== 200 || event.request.method !== "GET") {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone(); // Clone immediately and synchronously
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchedResponse;
    })
  );
});

// Example of background sync or persistent logic
self.addEventListener("sync", (event: any) => {
  if (event.tag === "sync-posts") {
    console.log("[SW] Background sync triggered");
  }
});
