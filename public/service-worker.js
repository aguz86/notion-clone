const CACHE_NAME = 'pwa-cache-v5';
const urlsToCache = [
  '/'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Use put instead of addAll to avoid failing if one file is missing
        return fetch('/')
          .then(response => cache.put('/', response))
          .catch(() => {}); // ignore error
      })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // If network works, cache it and return
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // If offline, try to return from cache
        return caches.match(event.request).then(cacheResponse => {
          if (cacheResponse) {
            return cacheResponse;
          }
          // If request is navigation, return the root page
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
          return new Response('', { status: 404, statusText: 'Not Found' });
        });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});
