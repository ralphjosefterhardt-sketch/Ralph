// Service Worker für ServicePortal
const CACHE_NAME = 'serviceportal-v2';
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
self.addEventListener('install', function(event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function(cache) { return cache.addAll(ASSETS); }));
  self.skipWaiting();
});
self.addEventListener('activate', function(event) {
  event.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(key) { return key !== CACHE_NAME; }).map(function(key) { return caches.delete(key); }));
  }));
  self.clients.claim();
});
self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(cached) { return cached || fetch(event.request); }));
});
