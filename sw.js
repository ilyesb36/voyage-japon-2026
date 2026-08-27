// Service worker — Japon 2026.
//
// Deux caches, deux stratégies :
//   shell : les pages, le CSS, les modules, les polices. Servi réseau
//           d'abord, avec repli sur le cache.
//   media : les photos. Servi cache d'abord, elles ne changent jamais.
//
// Le hors-ligne est une ACTION, pas un effet de bord de l'installation : le
// bouton « Préparer le hors-ligne » de la page Pratique met tout en cache et
// montre où ça en est. Précacher en silence à l'installation échouait sans
// que personne ne le sache — et « prêt hors-ligne » devenait un mensonge.
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
  let failed = 0;
  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: 'reload' });
      if (res.ok) await cache.put(url, res);
      else failed++;
    } catch { failed++; }
    onProgress?.(++done, urls.length);
  }
  return failed;
}

self.addEventListener('install', (e) => {
  // Rien à précharger ici : on prend la main tout de suite, le reste se
  // remplit à la navigation ou sur demande explicite.
  e.waitUntil(self.skipWaiting());
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
  if (e.data?.type === 'cache-all') e.waitUntil(cacheAll());
  if (e.data?.type === 'cache-status') e.waitUntil(reportStatus());
});

async function post(msg) {
  const clients = await self.clients.matchAll({ includeUncontrolled: true });
  clients.forEach((c) => c.postMessage(msg));
}

/** Combien de fichiers sont déjà là, sur combien attendus. */
async function reportStatus() {
  const shell = (await (await caches.open(SHELL)).keys()).length;
  const media = (await (await caches.open(MEDIA)).keys()).length;
  await post({ type: 'status', shell, media, shellTotal: SHELL_FILES.length });
}

/** Tout : les pages puis les photos, en rendant compte au fur et à mesure. */
async function cacheAll() {
  const shellCache = await caches.open(SHELL);
  let done = 0;
  await cacheEach(shellCache, SHELL_FILES, (n) => {
    done = n;
    post({ type: 'progress', phase: 'pages', done: n, total: SHELL_FILES.length });
  });

  const list = await mediaList();
  const mediaCache = await caches.open(MEDIA);
  await cacheEach(mediaCache, list, (n) =>
    post({ type: 'progress', phase: 'photos', done: n, total: list.length }));

  const shell = (await shellCache.keys()).length;
  const media = (await mediaCache.keys()).length;
  await post({ type: 'done', shell, media, shellTotal: SHELL_FILES.length });
}

/** La liste des photos, déduite des données ET des pages. */
async function mediaList() {
  const urls = new Set();
  const sources = ['data/spots.js', 'data/trip.js', 'data/days.js',
                   'index.html', 'itineraire.html'];
  for (const file of sources) {
    try {
      const src = await (await fetch(file, { cache: 'reload' })).text();
      for (const m of src.matchAll(/"(img\/[^"]+\.(?:webp|jpg|png))"/g)) urls.add(m[1]);
    } catch { /* hors-ligne : on fera avec ce qu'on a */ }
  }
  return [...urls];
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
