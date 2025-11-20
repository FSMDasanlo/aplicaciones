const CACHE_NAME = "jesus-app-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./img/yo.png",
  "./img/icon-192B.png",
  "./img/icon-192.png",
  "./img/icon-512.png",
  "./img/portada.jpg",
  "./img/pensando.jpg",
  "./img/torneo.png",
  "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});
