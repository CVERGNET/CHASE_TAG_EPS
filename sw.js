/* CHASE TAG — service worker : réseau d'abord (délai 2,5 s), copie locale en secours */
var CACHE = 'chase_tag-v1';
var FICHIERS = [
  './',
  './index.html',
  './app.js',
  './style.css',
  './manifest.webmanifest',
  './eps-core.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(FICHIERS); }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (cles) {
      // ne supprime que les anciens caches de CETTE appli (le domaine est partagé avec d'autres applis)
      return Promise.all(cles.filter(function (k) { return k.indexOf('chase_tag-') === 0 && k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

function secours(req) {
  return caches.open(CACHE).then(function (c) {
    return c.match(req, { ignoreSearch: true }).then(function (r) {
      return r || c.match(new URL('./index.html', self.registration.scope).href);
    });
  });
}

function reseauDabord(req) {
  return new Promise(function (resolve) {
    var fini = false;
    var minuteur = setTimeout(function () {
      secours(req).then(function (r) { if (r && !fini) { fini = true; resolve(r); } });
    }, 2500);
    fetch(req).then(function (rep) {
      clearTimeout(minuteur);
      if (rep && rep.ok) {
        var copie = rep.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copie); });
      }
      if (!fini) { fini = true; resolve(rep); }
    }).catch(function () {
      clearTimeout(minuteur);
      if (fini) return;
      secours(req).then(function (r) { fini = true; resolve(r || Response.error()); });
    });
  });
}

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(reseauDabord(e.request));
});
