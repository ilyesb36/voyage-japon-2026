// Service worker — Japon 2026.
//
// Deux caches, deux stratégies :
//   shell : les pages, le CSS, les modules, les polices. Pré-caché à
//           l'installation, servi réseau d'abord pour récupérer les mises à
//           jour, avec repli sur le cache.
//   media : les ~280 photos. Environ 16 Mo — trop lourd pour l'installation,
//           donc téléchargé à la demande depuis la page Pratique, qui affiche
//           la progression. Servi cache d'abord.
//
// Tout est local : aucune dépendance réseau au chargement, hors les tuiles de
// carte, qui se mettent en cache au fil de la consultation.

// Monter ce numéro à CHAQUE changement de CSS, de JS ou de données : sinon
// le cache sert l'ancienne version et personne ne voit la mise à jour.
const V = 'v12';
const SHELL = `jp-shell-${V}`;
const MEDIA = `jp-media-${V}`;
const TILES = `jp-tiles-${V}`;

const PAGES = [
  './', 'index.html', 'aujourdhui.html', 'itineraire.html', 'guide.html', 'pratique.html',
  'manifest.webmanifest', 'app.css',
  'app/ui.js', 'app/map.js', 'app/momiji.js', 'app/meteo.js',
  'data/trip.js', 'data/days.js', 'data/spots.js', 'data/pratique.js',
  'vendor/leaflet.js', 'vendor/leaflet.css', 'vendor/alpine.min.js',
  'vendor/open-props.min.css', 'vendor/fonts.css',
  'icon-192.png', 'icon-512.png',
];

const FONTS = [
  'inter-400-latin', 'inter-500-latin', 'inter-600-latin', 'inter-700-latin',
  'inter-400-latin-ext', 'inter-500-latin-ext', 'inter-600-latin-ext', 'inter-700-latin-ext',
  'zen-old-mincho-400-latin', 'zen-old-mincho-600-latin', 'zen-old-mincho-700-latin',
  'zen-old-mincho-400-latin-ext', 'zen-old-mincho-600-latin-ext', 'zen-old-mincho-700-latin-ext',
].map((f) => `vendor/fonts/${f}.woff2`);

const SHELL_FILES = [...PAGES, ...FONTS];

/** addAll échoue en bloc sur une seule erreur : on met en cache un par un. */
async function cacheEach(cache, urls, onProgress) {
  let done = 0;
  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: 'reload' });
      if (res.ok) await cache.put(url, res);
    } catch { /* une ressource manquante ne doit pas faire échouer l'install */ }
    onProgress?.(++done, urls.length);
  }
}

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    await cacheEach(cache, SHELL_FILES);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keep = new Set([SHELL, MEDIA, TILES]);
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => !keep.has(k)).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

// --- téléchargement des photos, déclenché depuis la page Pratique --------------

self.addEventListener('message', (e) => {
  if (e.data?.type !== 'cache-media') return;
  e.waitUntil(cacheMedia());
});

async function cacheMedia() {
  const post = async (msg) => {
    const clients = await self.clients.matchAll({ includeUncontrolled: true });
    clients.forEach((c) => c.postMessage(msg));
  };

  // La liste des photos se déduit des modules de données : pas de liste à tenir
  // à jour en double.
  const urls = new Set();
  for (const file of ['data/spots.js', 'data/trip.js', 'data/days.js']) {
    try {
      const src = await (await fetch(file)).text();
      for (const m of src.matchAll(/"(img\/[^"]+)"/g)) urls.add(m[1]);
    } catch { /* hors-ligne : on fera avec ce qu'on a */ }
  }

  const list = [...urls];
  const cache = await caches.open(MEDIA);
  await cacheEach(cache, list, (done, total) => post({ type: 'cache-progress', done, total }));
  await post({ type: 'cache-done', total: list.length });
}

// --- interception --------------------------------------------------------------

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Les photos : cache d'abord, elles ne changent jamais.
  if (url.origin === location.origin && url.pathname.includes('/img/')) {
    e.respondWith(cacheFirst(request, MEDIA));
    return;
  }

  // Le reste du site : réseau d'abord, pour ne pas servir une vieille page.
  if (url.origin === location.origin) {
    e.respondWith(networkFirst(request, SHELL));
    return;
  }

  // Les tuiles de carte : cache d'abord, ce qui a été consulté reste consultable.
  if (/arcgisonline\.com/.test(url.host)) {
    e.respondWith(cacheFirst(request, TILES));
  }
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request, { ignoreSearch: true });
  if (cached) return cached;
  try {
    const res = await fetch(request);
    if (res.ok) (await caches.open(cacheName)).put(request, res.clone());
    return res;
  } catch {
    return cached || Response.error();
  }
}

async function networkFirst(request, cacheName) {
  try {
    const res = await fetch(request);
    if (res.ok) (await caches.open(cacheName)).put(request, res.clone());
    return res;
  } catch {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;
    // Une navigation hors-ligne vers une page jamais visitée retombe sur l'accueil.
    if (request.mode === 'navigate') {
      const home = await caches.match('index.html');
      if (home) return home;
    }
    return Response.error();
  }
}
