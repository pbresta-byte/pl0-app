const CACHE = "pl0-app-v7";
const ASSETS = [
  "./index.html",
  "./manifest.json",
  "./pl7-shadbala.js",
  "./pl7-yoga-engine.js",
  "./pl7-yoga-rules-core.js",
  "./pl7-yoga-rules-arishta.js",
  "./pl7-yoga-rules-misc.js",
  "./pl7-yoga-catalog.js",
  "./pl7-yoga-conditions-es.js",
  "./dashakoota-engine.js",
  "./icons/icon-72.png",
  "./icons/icon-96.png",
  "./icons/icon-128.png",
  "./icons/icon-144.png",
  "./icons/icon-152.png",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-384.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-192.png",
  "./icons/icon-maskable-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Navigations (the HTML shell) go network-first, so a new install/update is
// visible immediately instead of being pinned to whatever got cached the
// very first time the app ever launched. Falls back to the cached shell only
// when there's no network. Static assets (icons, manifest) stay cache-first
// since they change rarely and cache-first keeps the app usable offline.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // Scripts (the yoga rule engine files) are network-first like the shell, so a
  // rule update is never masked by a stale cached copy; offline falls back to cache.
  if (event.request.mode === "navigate" || event.request.destination === "script") {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          return res;
        })
        .catch(() => caches.match(event.request).then((c) => c || (event.request.mode === "navigate" ? caches.match("./index.html") : undefined)))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          return res;
        })
        .catch(() => undefined);
    })
  );
});
