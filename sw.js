// Service worker — Japon 2026.
//
// Trois caches, deux stratégies :
//   shell : les pages, le CSS, les modules, les polices. Servi réseau
//           d'abord, avec repli sur le cache (au bout de 3 s, ou tout de suite
//           sans réseau). C'est le seul cache versionné : monter V le vide.
//   media : les photos. Servi cache d'abord, elles ne changent jamais.
//   tiles : les tuiles de carte déjà consultées. Cache d'abord, comme les photos.
//
// Les caches media et tiles n'ont pas de version : photos et tuiles se
// téléchargent en wifi à l'hôtel, et une mise à jour du site en plein voyage ne
// doit pas les effacer. À la première activation d'une nouvelle version, le
// contenu des anciens caches versionnés (jp-media-vNN, jp-tiles-vNN) est
// recopié dedans.
//
// Le hors-ligne est une ACTION, pas un effet de bord de l'installation : le
// bouton « Préparer le hors-ligne » de la page À faire met tout en cache et
// montre où ça en est. Précacher en silence à l'installation échouait sans
// que personne ne le sache — et « prêt hors-ligne » devenait un mensonge.
//
// Tout est local : aucune dépendance réseau au chargement, hors les tuiles de
// carte, qui se mettent en cache au fil de la consultation.

// Monter ce numéro à CHAQUE changement de CSS, de JS ou de données : l'ancienne
// coque est supprimée, et la page À faire propose alors de retélécharger les
// pages. Les photos et les tuiles ne dépendent pas de ce numéro : elles restent.
const V = 'v51';
const SHELL = `jp-shell-${V}`;
// Les photos et les tuiles ne dépendent pas de la version : une mise à jour du
// site pendant le voyage ne doit pas effacer ce qu'on a téléchargé à l'hôtel.
const MEDIA = 'jp-media';
const TILES = 'jp-tiles';

const PAGES = [
  './', 'index.html', 'aujourdhui.html', 'jour.html', 'itineraire.html', 'guide.html', 'budget.html', 'pratique.html',
  'villes.html', 'secours.html', 'valises.html', 'table.html', 'transports.html', 'passes.html',
  'hotels.html', 'jour-par-jour.html', 'journees.html',   // anciens favoris : leur redirection marche hors-ligne
  'manifest.webmanifest', 'app.css',
  'app/ui.js', 'app/map.js', 'app/momiji.js', 'app/meteo.js', 'app/resa.js', 'app/quartiers.js',
  'data/trip.js', 'data/days.js', 'data/spots.js', 'data/pratique.js', 'data/lieux.js',
  'data/selection.js', 'data/delices.js', 'data/quartiers.js', 'data/valises.js', 'data/passes.js',
  'vendor/leaflet.js', 'vendor/leaflet.css', 'vendor/fonts.css',
  'icon-192.png', 'icon-512.png',
];

const FONTS = [
  'inter-400-latin', 'inter-500-latin', 'inter-600-latin', 'inter-700-latin',
  'inter-400-latin-ext', 'inter-500-latin-ext', 'inter-600-latin-ext', 'inter-700-latin-ext',
  'zen-old-mincho-400-latin', 'zen-old-mincho-600-latin', 'zen-old-mincho-700-latin',
  'zen-old-mincho-400-latin-ext', 'zen-old-mincho-600-latin-ext', 'zen-old-mincho-700-latin-ext',
].map((f) => `vendor/fonts/${f}.woff2`);

const SHELL_FILES = [...PAGES, ...FONTS];

/**
 * addAll échoue en bloc sur une seule erreur : on met en cache un par un.
 * Avec `skipPresent`, ce qui est déjà dans le cache n'est pas retéléchargé
 * (le compte avance quand même) : c'est pour les photos, qui ne changent jamais.
 */
async function cacheEach(cache, urls, onProgress, skipPresent = false) {
  let done = 0;
  let failed = 0;
  for (const url of urls) {
    try {
      if (!(skipPresent && await cache.match(url))) {
        const res = await fetch(url, { cache: 'reload' });
        if (res.ok) await cache.put(url, res);
        else failed++;
      }
    } catch { failed++; }
    onProgress?.(++done, urls.length);
  }
  return failed;
}

/**
 * Combien de ces fichiers sont réellement dans le cache. On compte les fichiers
 * attendus un par un, pas les clés : une variante d'URL (jour.html?d=7) n'est pas
 * un fichier de la liste, et une photo retirée des données ne doit pas faire
 * croire que tout est là.
 */
async function countPresent(cache, urls) {
  let n = 0;
  for (const url of urls) if (await cache.match(url)) n++;
  return n;
}

self.addEventListener('install', (e) => {
  // Rien à précharger ici : on prend la main tout de suite, le reste se
  // remplit à la navigation ou sur demande explicite.
  e.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    // Les anciens caches versionnés de photos et de tuiles passent dans les caches stables.
    // Un try/catch par cache : une recopie qui échoue (disque plein) laisse l'ancien
    // cache en place, retenté à la prochaine activation, sans bloquer les autres ni
    // l'activation. Le delete est DANS le try : jamais de suppression d'un cache non migré.
    // Le try extérieur couvre la liste des caches elle-même.
    try {
      for (const k of await caches.keys()) {
        const cible = k.startsWith('jp-media-') ? MEDIA : k.startsWith('jp-tiles-') ? TILES : null;
        if (!cible) continue;
        try {
          const src = await caches.open(k);
          const dst = await caches.open(cible);
          for (const req of await src.keys()) {
            if (await dst.match(req)) continue;
            const res = await src.match(req);
            if (res) await dst.put(req, res);
          }
          await caches.delete(k);
        } catch { /* l'ancien cache reste : rien n'est perdu, la prochaine activation retentera */ }
      }
    } catch { /* le stockage ne répond pas : pas de migration cette fois, la prochaine retentera */ }
    // Seules les anciennes coques s'en vont : jamais un cache d'une autre application de la même origine.
    // Une coque qu'on n'arrive pas à supprimer partira à la prochaine activation.
    try {
      for (const k of await caches.keys()) if (k.startsWith('jp-shell-') && k !== SHELL) await caches.delete(k);
    } catch { /* sans gravité */ }
    // Dans tous les cas : un incident de stockage ne doit pas laisser les pages sans service worker.
    await self.clients.claim();
  })());
});

// --- téléchargement des photos, déclenché depuis la page À faire ---------------

self.addEventListener('message', (e) => {
  if (e.data?.type === 'cache-all') e.waitUntil(cacheAll());
  if (e.data?.type === 'cache-status') e.waitUntil(reportStatus());
});

async function post(msg) {
  const clients = await self.clients.matchAll({ includeUncontrolled: true });
  clients.forEach((c) => c.postMessage(msg));
}

/** Combien de fichiers attendus sont déjà là, sur combien. */
async function reportStatus() {
  // mediaTotal est compté, jamais écrit en dur : le nombre de photos bouge à
  // chaque ajout d'adresse.
  const list = await mediaList();
  const shell = await countPresent(await caches.open(SHELL), SHELL_FILES);
  const media = await countPresent(await caches.open(MEDIA), list);
  await post({ type: 'status', shell, media, shellTotal: SHELL_FILES.length, mediaTotal: list.length });
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
  // Les pages se rafraîchissent toujours ; les photos ne changent jamais, celles
  // qu'on a déjà ne se retéléchargent pas : relancer le bouton est bien plus rapide.
  await cacheEach(mediaCache, list, (n) =>
    post({ type: 'progress', phase: 'photos', done: n, total: list.length }), true);

  const shell = await countPresent(shellCache, SHELL_FILES);
  const media = await countPresent(mediaCache, list);
  await post({ type: 'done', shell, media, shellTotal: SHELL_FILES.length, mediaTotal: list.length });
}

/** La liste des photos, déduite des données ET des pages. */
async function mediaList() {
  const urls = new Set();
  // Toutes les pages, pas seulement celles qui « ont des images » : une photo
  // d'ouverture écrite en dur dans le HTML avait déjà échappé au cache une
  // fois, et ça ne se voit qu'une fois hors-ligne, trop tard.
  const sources = ['data/spots.js', 'data/trip.js', 'data/days.js',
                   'data/selection.js', 'data/delices.js', 'villes.html',
                   'index.html', 'itineraire.html', 'guide.html',
                   'pratique.html', 'aujourdhui.html', 'jour.html', 'budget.html',
                   'passes.html', 'valises.html', 'transports.html',
                   'table.html', 'secours.html'];
  for (const file of sources) {
    let src = '';
    try {
      const res = await fetch(file, { cache: 'reload' });
      // Une réponse en erreur (404, 5xx, page de connexion d'un wifi d'hôtel) ne contient
      // pas la source : on la traite comme un réseau coupé.
      if (!res.ok) throw new Error(`${file} : ${res.status}`);
      src = await res.text();
    } catch {
      // Hors-ligne, ou réponse inutilisable : on relit la copie enregistrée de la source.
      // Sans elle, la liste serait vide ou trouée, et la page À faire dirait « Pas encore
      // téléchargé » alors que tout est là. Sans copie non plus, on fera avec ce qu'on a.
      try { src = await (await caches.match(file)).text(); } catch { /* pas de copie */ }
    }
    // guillemets doubles (données générées) ou simples (data/delices.js, tenu à la main)
    for (const m of src.matchAll(/["'](img\/[^"']+\.(?:webp|jpg|png))["']/g)) urls.add(m[1]);
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
    e.respondWith(networkFirst(e, request, SHELL));
    return;
  }

  // Les tuiles de carte : cache d'abord, ce qui a été consulté reste consultable.
  if (/arcgisonline\.com/.test(url.host)) {
    e.respondWith(cacheFirst(request, TILES));
  }
});

async function cacheFirst(request, cacheName) {
  // Un cache illisible vaut « pas de copie » : le réseau passe.
  const cached = await caches.match(request, { ignoreSearch: true }).catch(() => undefined);
  if (cached) return cached;
  try {
    const res = await fetch(request);
    if (res.ok) {
      // Un incident de stockage ne doit pas coûter la photo ou la tuile : la réponse
      // du réseau passe quand même, sans copie. L'écriture est attendue (comme dans
      // networkFirst) : son échec est attrapé ici, et elle ne reste pas en plan si le
      // service worker s'endort juste après la réponse.
      try { await (await caches.open(cacheName)).put(request, res.clone()); } catch { /* tant pis pour la copie */ }
    }
    return res;
  } catch {
    return cached || Response.error();
  }
}

// Dans le métro, le réseau répond parfois au bout de trente secondes : au-delà
// de 3 s, on sert la copie enregistrée, et la mise à jour continue derrière.
const DELAI_RESEAU = 3000;

async function networkFirst(event, request, cacheName) {
  // Le réseau part tout de suite. waitUntil garde le service worker en vie
  // jusqu'au bout, même si la page a déjà sa copie : c'est ce qui met le cache
  // à jour derrière.
  const reseau = fetch(request).then(async (res) => {
    if (res.ok) {
      // Un incident de stockage (disque plein, cache illisible) ne doit pas coûter
      // la page : la réponse du réseau passe quand même, sans copie.
      try { await (await caches.open(cacheName)).put(request, res.clone()); } catch { /* tant pis pour la copie */ }
    }
    return res;
  });
  event.waitUntil(reseau.then(() => {}, () => {}));
  // Avec une copie enregistrée, le réseau a 3 s pour répondre ; sans copie, on l'attend.
  // Un cache illisible vaut « pas de copie » : le réseau passe.
  const cached = await caches.match(request, { ignoreSearch: true }).catch(() => undefined);
  if (cached) {
    const delai = new Promise((resolve) => setTimeout(() => resolve(cached), DELAI_RESEAU));
    return Promise.race([reseau.catch(() => cached), delai]);
  }
  try {
    return await reseau;
  } catch {
    // Une navigation hors-ligne vers une page jamais visitée retombe sur l'accueil.
    if (request.mode === 'navigate') {
      const home = await caches.match('index.html');
      if (home) return home;
    }
    return Response.error();
  }
}
