// Service worker mínimo: guarda la "cáscara" de la app (logo y página) para que abra rápido.
// Los pedidos siempre se cargan en vivo desde Google, nunca de la memoria.
var CACHE = "pedidos-lolita-v1";
var ARCHIVOS = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png"];

self.addEventListener("install", function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(ARCHIVOS); }));
  self.skipWaiting();
});

self.addEventListener("activate", function(e) {
  e.waitUntil(caches.keys().then(function(claves) {
    return Promise.all(claves.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});

self.addEventListener("fetch", function(e) {
  var url = new URL(e.request.url);
  if (url.origin !== location.origin) return;   // lo de Google pasa directo
  e.respondWith(
    fetch(e.request).catch(function() { return caches.match(e.request); })
  );
});
