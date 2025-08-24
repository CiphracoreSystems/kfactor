// Service Worker for K-Factor Calculator
const CACHE_NAME = 'kfactor-v4';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.webmanifest'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    const req = event.request;

    // Ensure SPA works offline: serve index.html for navigations
    if (req.mode === 'navigate') {
      const cache = await caches.open(CACHE_NAME);
      const cachedShell = await cache.match('/index.html');
      if (cachedShell) return cachedShell;
      // Fallback to network if not cached yet
      try { return await fetch(req); } catch (e) { return new Response('Offline', { status: 503 }); }
    }

    // Cache-first for other requests
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const res = await fetch(req);
      // Only cache successful, same-origin, basic responses
      if (res && res.status === 200 && res.type === 'basic') {
        const cache = await caches.open(CACHE_NAME);
        try {
          await cache.put(req, res.clone());
        } catch (e) {
          // Ignore cache put errors (e.g., opaque requests)
        }
      }
      return res;
    } catch (e) {
      // Network failed and no cache
      return new Response('Offline', { status: 503 });
    }
  })());
});
