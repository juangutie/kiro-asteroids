const CACHE = 'kiro-asteroids_v1';
const ASSETS = ['/kiro-asteroids/', '/kiro-asteroids/index.html', '/kiro-asteroids/favicon.ico'];

self.addEventListener('install', e =>
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)))
);

self.addEventListener('fetch', e =>
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)))
);
