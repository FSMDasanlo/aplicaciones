const CACHE_NAME = "jesus-app-cache-v5"; // Incrementa la versión del caché
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
  "./img/mundo.png",
  "./img/trivial.png",
  "./img/miju.png",
  "./img/icon-maskable-512.png",
  "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
];

// Evento install: se dispara cuando el service worker se instala.
// Cachea los recursos estáticos principales de la aplicación.
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(urlsToCache);
    self.skipWaiting(); // Activa el nuevo service worker inmediatamente.
  })());
});

// Evento activate: se dispara cuando el service worker se activa.
// Limpia los cachés antiguos para liberar espacio.
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => {
        if (cacheName !== CACHE_NAME) {
          return caches.delete(cacheName);
        }
      })
    );
    await self.clients.claim(); // Toma el control de las páginas abiertas.
  })());
});

// Evento fetch: intercepta todas las peticiones de red.
// Implementa la estrategia "Stale-While-Revalidate".
self.addEventListener('fetch', event => {
  // Solo cacheamos peticiones GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          // Si la petición fue exitosa y válida (status 200), actualizamos el caché.
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
        // Devuelve la respuesta del caché si existe, si no, espera a la red.
        return cachedResponse || fetchPromise;
      });
    })
  );
});
