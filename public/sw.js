const CACHE_NAME = 'kk-tourism-v2';
const IMAGE_CACHE_NAME = 'kk-images-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html'
];

// Domains for fast image caching
const IMAGE_HOSTS = ['images.pexels.com', 'images.unsplash.com', 'source.unsplash.com'];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old caches immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME && cache !== IMAGE_CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Ignore non-http(s) schemes (e.g. chrome-extension://, moz-extension://)
  if (!url.protocol.startsWith('http')) return;

  // Cache photos from image hosts (Pexels, Unsplash)
  if (IMAGE_HOSTS.includes(url.hostname) || event.request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then(async (cache) => {
        const cachedImage = await cache.match(event.request);
        if (cachedImage) return cachedImage;

        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse.status === 200 || networkResponse.type === 'opaque') {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch {
          return cachedImage || Response.error();
        }
      })
    );
    return;
  }

  // Exclude non-same-origin API calls
  if (url.origin !== self.location.origin) {
    return;
  }

  // For HTML navigation & index.html, use Network-First so users always get current chunk hashes
  if (event.request.mode === 'navigate' || url.pathname === '/' || url.pathname === '/index.html') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request).then((res) => res || Response.error()))
    );
    return;
  }

  // Let Vite hashed immutable assets load directly through browser HTTP cache
  if (url.pathname.startsWith('/assets/')) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// Message listener for immediate activation
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
