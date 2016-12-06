var cacheName = 'easy-ABC-v0.9.0';

var filesToCache = [
  'index.html',
  'app.js',
  'img/icon16x16.png',
  'img/icon180x180.png',
  'img/icon196x196.png',
  'img/icon256x256.png',
 ];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Installed');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  var request = event.request;
  if (request.method == 'GET') {
    console.log('[ServiceWorker] Fetch', request.url);
    event.respondWith(
      caches.match(request).then(function(response) {
        return response || fetch(request);
      })
    );
  } else {
    event.respondWith(fetch(request));
  }
});


// this snippets removes old caches if we ever change cacheName to a higher version
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
