// Service Worker für ServicePortal
// Cached alle App-Dateien für Offline-Betrieb

const CACHE_NAME = 'serviceportal-v3';

const ASSETS = [
  './index.html',
  './css/app.css',
  './js/app.js',
  './js/auth.js',
  './js/data.js',
  './js/machines.js',
  './js/service-report.js',
  './js/archive.js',
];

// Beim ersten Laden: alle Dateien cachen
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Alte Cache-Versionen beim Update löschen
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys
          .filter(function(key) { return key !== CACHE_NAME; })
          .map(function(key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

// Anfragen: zuerst aus Cache, sonst Netzwerk
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      return cached || fetch(event.request);
    })
  );
});
