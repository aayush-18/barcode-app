var cacheName = 'barcode-reader-1';
var filesToCache = [
  'examples/pwa/',
  'examples/pwa/index.html',
  'examples/pwa/app.js',
  'examples/pwa/style.css',
  'examples/pwa/favicon.ico',
  'examples/pwa/icons/icon-32.png',
  'examples/pwa/icons/icon-128.png',
  'examples/pwa/icons/icon-144.png',
  'examples/pwa/icons/icon-152.png',
  'examples/pwa/icons/icon-192.png',
  'examples/pwa/icons/icon-256.png',
  'examples/pwa/dbr-6.5.0.2.min.js',
  'examples/pwa/dbr-6.5.0.2.wasm',
];
 
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});
 
self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});
 
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(r) {
      console.log('[Service Worker] Fetching resource: '+e.request.url);
      return r || fetch(e.request).then(function(response) {
        return caches.open(cacheName).then(function(cache) {
          console.log('[Service Worker] Caching new resource: '+e.request.url);
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});