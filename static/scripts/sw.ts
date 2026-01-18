/// <reference lib="webworker" />

export {};

declare const self: ServiceWorkerGlobalScope;

class BlogServiceWorker {
  private readonly CACHE_NAME = "the-blog-cache-v1";
  private readonly ASSETS = ["/", "/styles/main.css", "/js/main.js", "/manifest.json"];

  constructor() {
    this.init();
  }

  private init(): void {
    // 서비스 워커 이벤트 리스너 등록
    // .bind(this)를 통해 클래스 내부 메서드에서도 this가 클래스 인스턴스를 가리키도록 함
    self.addEventListener("install", (e) => this.handleInstall(e));
    self.addEventListener("activate", (e) => this.handleActivate(e));
    self.addEventListener("fetch", (e) => this.handleFetch(e));
  }

  /**
   * 설치 단계: 정적 자산 캐싱
   */
  private handleInstall(event: ExtendableEvent): void {
    event.waitUntil(
      caches.open(this.CACHE_NAME).then((cache) => {
        console.log("[SW] Caching static assets");
        return cache.addAll(this.ASSETS);
      }),
    );
  }

  /**
   * 활성화 단계: 오래된 캐시 정리 (추가됨)
   */
  private handleActivate(event: ExtendableEvent): void {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== this.CACHE_NAME) {
              console.log("[SW] Deleting old cache:", name);
              return caches.delete(name);
            }
          }),
        );
      }),
    );
  }

  /**
   * 요청 가로채기: 캐시 우선 전략 (Cache First)
   */
  private handleFetch(event: FetchEvent): void {
    event.respondWith(
      caches.match(event.request).then((response) => {
        // 캐시에 있으면 반환, 없으면 네트워크 요청
        return response || fetch(event.request);
      }),
    );
  }
}

// 서비스 워커 인스턴스 생성
new BlogServiceWorker();
