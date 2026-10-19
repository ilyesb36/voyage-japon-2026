# Une place par besoin — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :** réorganiser le site pour qu'à chaque besoin corresponde une seule
page, à deux touches au plus, avec des pages courtes et une seule version de
chaque information.

**Architecture :** le même site statique, sans build. Les menus changent avec
le moment du voyage (`app/ui.js`). Deux pages naissent : `table.html` et
`transports.html`. Les autres pages sont réordonnées et allégées. Les données
gagnent un état de réservation, et le service worker garde les photos d'une
version à l'autre.

**Tech Stack :** HTML, modules ES natifs, une seule feuille `app.css`
(`@layer`), Leaflet en local, un service worker, des contrôles Node
(`tools/verify.mjs`, `tools/coherence.mjs`).

**Spec :** `docs/superpowers/specs/2026-10-15-une-place-par-besoin-design.md`

## Global Constraints

- **Pas de build :** pages HTML et modules ES chargés tels quels ; une seule
  feuille `app.css` ; le service worker `sw.js`.
- **Données tenues à la main :** `data/*.js`. Ne JAMAIS lancer
  `tools/extract.mjs` ni `tools/fetch-images.mjs`.
- **Site public :** jamais de numéro de réservation, de code de porte ou de
  boîte à clés, de lien de pré-enregistrement ni d'e-mail.
- **Téléphone d'abord :** 375 px de large, sans défilement horizontal. Le thème
  sombre passe par `:root[data-theme="dark"]` ; les couleurs ne viennent que
  des variables d'`app.css`.
- **Écriture :**
  - français simple, phrases courtes, vouvoiement ;
  - les mots japonais utiles en japonais ;
  - commentaires en français, aussi nombreux que dans le code voisin.
- **Fin de chaque tâche :** `node tools/verify.mjs` se termine par « ✓ … vérifications
  passées, 1 en attente », et `node tools/coherence.mjs` par « ✓ aucun point
  bloquant ».
- **CSS :** chaque tâche ajoute son propre bloc `/* --- <nom> --- */` juste
  avant la ligne `/* --- doigts, pas souris`, ne modifie que ses propres
  sélecteurs, et relit `app.css` juste avant chaque modification : d'autres
  tâches l'écrivent en même temps.
- **Photos :** uniquement celles déjà dans `img/`.
- **Hauteurs cibles** à 375 px, tout replié :
  - Passes : 5 000 px au plus ;
  - Valises : 6 000 px au plus ;
  - Transports : 3 500 px au plus ;
  - Secours : 4 000 px au plus ;
  - À table et Autour de moi (Tokyo) : 6 000 px au plus.
- **Dates de test :** `?date=2026-10-15`, `2026-11-08`, `2026-11-09`,
  `2026-11-14`, `2026-11-25` et `2026-12-02`.
- **Ni commit ni push dans les tâches.** L'orchestrateur commite à la fin,
  après l'ok d'Ilyès, au nom d'Ilyès seul, sans ligne d'attribution Claude.
- **Tester dans le navigateur :**
  - le serveur local tourne sur http://localhost:4173 ;
  - chaque agent ouvre son propre onglet (`tabs_create`) et passe son
    `tabId` à chaque appel ;
  - avant chaque test, désinscrire le service worker, vider `caches`, puis
    recharger avec `&nc=<n>` ;
  - l'avertissement CSP « reflected-xss » est connu.

## Review Focus

1. **Géolocalisation refusée ou indisponible :** « Où suis-je ? » doit dire
   quoi faire (le réglage iPhone, ou choisir dans la liste), jamais rester muet.
   Testé en tâche 4.
2. **Première ouverture hors-ligne après une mise à jour :** la page vient du
   cache, ou l'accueil en repli, jamais une page blanche. Les photos déjà
   téléchargées sont toujours là. Testé en tâche 2.
3. **Jour sans hôtel ou hôtel sans téléphone :**
   - le 8 novembre (vol) : pas de barre ;
   - le 2 décembre : « Départ » ;
   - Kanazawa et La Vita : « messagerie Booking » au lieu d'un bouton mort.
   - Testé en tâche 3.
4. **Recherche avec ou sans accents, tirets ou macrons :** « todaiji »,
   « tōdai-ji », « kiyomizu dera » trouvent leur adresse, quelle que soit la
   ville en cours. Testé en tâche 7.
5. **Anciens liens et favoris :**
   - `pratique.html` mène à Secours (tâche 8) ;
   - `villes.html?e=3#table` mène à À table (tâche 4) ;
   - `guide.html?ville=kyoto` filtre toujours sur Kyoto (tâche 7).

## Phases et propriété des fichiers

**Phase 1, en séquence :** tâche 1, puis tâche 2.

**Phase 2, en parallèle :** tâches 3 à 9. Chaque fichier n'a qu'un seul
propriétaire. Pour lire un fichier qu'on ne possède pas, on ne fait que le
lire.

| Fichier | Propriétaire |
|---|---|
| `app/ui.js`, `app/resa.js`, `index.html`, `tools/coherence.mjs`, `data/pratique.js` | 1 |
| `data/trip.js` | 1 (`TRIP.japon`), puis 9 (`SEGMENTS`, `HOTELS[].route`) |
| `tools/verify.mjs` | 1, puis 9 |
| `sw.js` | 1 (liste `PAGES` seulement), puis 2 |
| `README.md` | 2 |
| `jour.html` | 3 |
| `villes.html`, `app/quartiers.js` | 4 |
| `table.html`, `itineraire.html` | 5 (`table.html` naît en ébauche à la tâche 1) |
| `transports.html`, `passes.html` | 6 (`transports.html` naît en ébauche à la tâche 1) |
| `guide.html` | 7 |
| `secours.html`, `aujourdhui.html`, `pratique.html` | 8 |
| `data/days.js`, `data/spots.js`, `data/quartiers.js`, `data/selection.js`, `data/delices.js`, `data/lieux.js`, `data/valises.js`, `budget.html` | 9 |
| `budget.html`, `data/trip.js` (`qui` de `BUDGET`) et `tools/verify.mjs` (totaux), après la tâche 9 | 12 |
| `app.css` | chacun son bloc |

**Phase 3 :** tâche 10 (intégration, vérifications et personas), puis tâche 11
(livraison).

**Les noms partagés entre tâches (à respecter exactement) :**
- **`table.html`** :
  - le paramètre `?ville=<cityId>` ;
  - les sections `#resas`, `#specialites`, `#tables` ;
  - chaque plat porte l'ancre `id="d-<id du plat dans DELICES>"`.
- **`secours.html`** :
  - les sections `#urgences`, `#logements`, `#vols`, `#phrases` ;
  - chaque logement porte l'ancre `id="h-<id de l'hôtel>"`.
- **`villes.html`** :
  - les cartes de quartier `id="q-<id du quartier>"`, en `<details>` ;
  - l'arrivée par `#table` redirige vers `table.html?ville=<cityId>`.
- **`aujourdhui.html`** : les sections `#hors-ligne` et `#a-lire`.
- **`transports.html`** : les sections `#trajets`, `#passes`, `#valises`,
  `#quotidien`.
- **`passes.html`** : les ancres `#hakone` et `#nikko`.
- **`valises.html`** : les ancres `#t1` à `#t6`.
- **`guide.html`** : `?chercher` place le curseur dans la recherche, et
  `?q=<texte>` la pré-remplit.

---

### Tâche 1 : fondations — moments, menus, loupe, réservations, ébauches, contrôles

**Fichiers :**
- Modifier :
  - `data/trip.js` (ligne `TRIP`), `data/pratique.js` (`RESERVER`, `SURPLACE`) ;
  - `app/ui.js` (lignes 1-56 et 120-178), `app/resa.js` ;
  - `index.html` (redirection l. 92-107, `montePerdu` l. 89 et 129, « À goûter »
    l. 180-184, « L'argent » masqué l. 71-75 et 294-316) ;
  - `sw.js` (la seule liste `PAGES`, et `V`) ;
  - `app.css` (bloc `/* --- barre et couvertures --- */`) ;
  - `tools/coherence.mjs` (le bloc qui commence l. 195), `tools/verify.mjs`
    (après le contrôle « chaque réservation dit par quel canal… » et dans la
    liste `pages` l. 469).
- Créer : `table.html` et `transports.html` (des ébauches).

**Interfaces :**
- **Produit :**
  - `TRIP.japon = { du: '2026-11-09', au: '2026-12-02' }` ;
  - `moment()` vaut `'avant' | 'pendant' | 'apres'` ;
  - `PAGES_PAR_MOMENT` et `PARENT` (internes à ui.js) ;
  - la loupe `.nav__search`, qui mène à `guide.html?chercher` ;
  - dans `app/resa.js` : `etatDe(r)`, `reservationsDuJour(date)`,
    `echeancesAVenir(depuis, n)` ;
  - `RESERVER[].type: 'table' | 'billet'`, `RESERVER[].etat?: 'a-reserver' |
    'reserve'` et `RESERVER[].heure?: 'HH:MM'` ;
  - `SURPLACE[].id` et `SURPLACE[].place: 'secours' | 'transports' | 'avant'`.
- **Consomme :** rien.

- [ ] **Étape 1 : écrire les contrôles qui échouent.**

Dans `tools/verify.mjs`, juste après le contrôle « chaque réservation dit par
quel canal on la fait » :

```js
// L'état d'une réservation vit dans les données, pareil sur les deux téléphones :
// « à réserver » par défaut, « réservé » avec son heure. Une table ou un billet.
const etatsInvalides = RESERVER.filter((r) => r.etat !== undefined && !['a-reserver', 'reserve'].includes(r.etat)).map((r) => r.id);
assert('chaque état de réservation vaut a-reserver ou reserve', etatsInvalides.length === 0, etatsInvalides.join(', '));
const reservesSansHeure = RESERVER.filter((r) => r.etat === 'reserve' && !/^\d{2}:\d{2}$/.test(r.heure || '')).map((r) => r.id);
assert('une réservation faite a son heure (HH:MM)', reservesSansHeure.length === 0, reservesSansHeure.join(', '));
const sansType = RESERVER.filter((r) => !['table', 'billet'].includes(r.type)).map((r) => r.id);
assert("chaque réservation dit si c'est une table ou un billet", sansType.length === 0, sansType.join(', '));
// Chaque conseil « sur place » a une seule page : Secours, Transports, ou À faire (« avant »).
const sansPlace = SURPLACE.filter((s) => !s.id || !['secours', 'transports', 'avant'].includes(s.place)).map((s) => s.title);
assert('chaque conseil sur place a un identifiant et sa page', sansPlace.length === 0, sansPlace.join(', '));
assert('les bornes du séjour au Japon', TRIP.japon && TRIP.japon.du === '2026-11-09' && TRIP.japon.au === '2026-12-02');
```

Dans `tools/coherence.mjs`, juste avant la ligne `const liensMorts = [];` :

```js
  // Chaque page des menus existe et part dans la coque : sinon un menu mène hors-ligne à une erreur.
  const ui = fs.readFileSync(path.join(ROOT, 'app/ui.js'), 'utf8');
  const duMenu = [...new Set([...ui.matchAll(/href: '([a-z-]+\.html)'/g)].map((m) => m[1]))];
  const menuHors = duMenu.filter((f) => !fs.existsSync(path.join(ROOT, f)) || !coque.includes(f));
  check(!menuHors.length, 'chaque page des menus existe et est dans la coque', menuHors);
  // Une ancre écrite en clair (page.html#ancre) doit exister dans la page visée : villes.html#gouter visait une section disparue.
  const ancresMortes = [];
  for (const p of pages) {
    const src = fs.readFileSync(path.join(ROOT, p), 'utf8');
    for (const m of src.matchAll(/([a-z-]+\.html)(?:\?[^"'#`\s]*)?#([a-z][a-z0-9-]*)(?=["'`])/g)) {
      const cible = path.join(ROOT, m[1]);
      if (!fs.existsSync(cible)) continue;   // déjà compté dans les liens morts
      if (!fs.readFileSync(cible, 'utf8').includes(`id="${m[2]}"`)) ancresMortes.push(`${p} → ${m[1]}#${m[2]}`);
    }
  }
  check(!ancresMortes.length, 'aucune ancre interne absente', ancresMortes);
```

- [ ] **Étape 2 : vérifier que les deux contrôles échouent.**

Lancer `node tools/verify.mjs | grep -E "✗"`. On attend des échecs sur le
type des réservations, sur la page de chaque conseil et sur les bornes du
séjour.

Lancer `node tools/coherence.mjs | tail -4`. On attend « aucune ancre interne
absente » en échec, avec `index.html → villes.html#gouter`. On attend aussi
`data/passes.js` hors coque.

- [ ] **Étape 3 : les données.**

Dans `data/trip.js`, ajouter `"japon":{"du":"2026-11-09","au":"2026-12-02"}` à
l'objet de la ligne `export const TRIP` (le JSON tient sur une seule ligne).

Dans `data/pratique.js` :
- ajouter `type: 'table'` aux entrées `RESERVER` suivantes : `the-sky`,
  `tokyo-ten`, `takano`, `tomohiro`, `junsei`, `mitsukawa`, `yoshikawa`,
  `tategami`, `sublime` et `saiko-shinkan` ;
- ajouter `type: 'billet'` à `shibuya-sky`, `teamlab` et `rikugien` ;
- donner un `id` et une `place` à chaque entrée `SURPLACE`, d'après son
  `title` :

| title | id | place |
|---|---|---|
| Urgences | `urgences` | `secours` |
| Tremblement de terre | `seisme` | `secours` |
| Faire suivre les valises | `valises` | `transports` |
| L'escalator change de côté | `escalator` | `transports` |
| Détaxe : tout change le 1er novembre | `detaxe` | `avant` |
| Pas de poubelles | `poubelles` | `avant` |
| Pas de pourboire | `pourboire` | `avant` |
| Espèces | `especes` | `avant` |
| Taxe de séjour | `taxe-sejour` | `avant` |
| Onsen et tatouages | `onsen-tatouages` | `avant` |
| S'habiller par couches | `couches` | `avant` |
| La nuit tombe tôt | `nuit` | `avant` |

- [ ] **Étape 4 : les moments et les menus.**

Dans `app/ui.js` :
- retirer `import { montePerdu } from './quartiers.js';` ;
- retirer les imports devenus inutiles (`DAYS as JOURS_VOYAGE`, et `STEPS`,
  `HOTELS` s'ils ne servent plus qu'au bouton « Perdu ? ») ;
- remplacer `moment()` et `PAGES_PAR_MOMENT` :

```js
export function moment() {
  const t = today();
  // Le jour du vol (8 nov.) est encore « avant » : on part le soir de Paris, on veut la liste.
  if (t < TRIP.japon.du) return 'avant';
  if (t <= TRIP.japon.au) return 'pendant';
  return 'apres';
}

const PAGES_PAR_MOMENT = {
  // Avant : préparer. Une entrée par besoin, cinq en tout.
  avant: [
    { href: 'aujourdhui.html', label: 'À faire' },
    { href: 'itineraire.html', label: 'Le programme' },
    { href: 'villes.html',     label: 'Les villes' },
    { href: 'transports.html', label: 'Transports' },
    { href: 'budget.html',     label: 'Le budget' },
  ],
  // Pendant : téléphone en main. La journée, ce qu'il y a autour, où manger,
  // comment bouger, les urgences, l'argent.
  pendant: [
    { href: 'jour.html',       label: "Aujourd'hui" },
    { href: 'villes.html',     label: 'Autour de moi' },
    { href: 'table.html',      label: 'À table' },
    { href: 'transports.html', label: 'Transports' },
    { href: 'secours.html',    label: 'Secours' },
    { href: 'budget.html',     label: 'Le budget' },
  ],
  apres: [
    { href: 'index.html',      label: 'Le voyage' },
    { href: 'itineraire.html', label: 'Le programme' },
    { href: 'budget.html',     label: 'Le budget' },
  ],
};
const PAGES = PAGES_PAR_MOMENT[moment()];
// Une page hors menu allume son parent.
const PARENT = {
  'passes.html': 'transports.html', 'valises.html': 'transports.html',
  'jour.html': 'itineraire.html', 'aujourdhui.html': 'jour.html',
  'pratique.html': 'secours.html', 'secours.html': 'aujourdhui.html',
};
// Toujours joignables, par le pied de page.
const PIED_EXTRA = [
  { href: 'index.html',      label: 'Le voyage' },
  { href: 'aujourdhui.html', label: 'À faire' },
  { href: 'secours.html',    label: 'Secours' },
];
```

Mettre à jour le commentaire au-dessus de `moment()` : avant le départ, le
jour du vol compris ; pendant, du 9 nov. au 2 déc. ; après, à partir du 3 déc.

- [ ] **Étape 5 : la barre et le pied de page.**

Dans `mountChrome(current)` :
- retirer `perduActif`, `perduBtn` et le bloc `if (perduActif) { … }` ;
- calculer la page à allumer :

```js
  const actif = PAGES.some((x) => x.href === current) ? current : PARENT[current];
  const loupe = `<a class="nav__search" href="guide.html?chercher" aria-label="Chercher dans tout le site"${current === 'guide.html' ? ' aria-current="page"' : ''}>
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 20l-4.2-4.2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></a>`;
  const pied = [...PAGES, ...PIED_EXTRA.filter((x) => !PAGES.some((p) => p.href === x.href))];
```

- dans le gabarit de la barre, les liens deviennent
  `${PAGES.map((p) => `<a href="${p.href}"${p.href === actif ? ' aria-current="page"' : ''}>${p.label}</a>`).join('')}`,
  et `${loupe}` se place juste avant `<span class="nav__count">` ;
- dans le pied de page :
  `${pied.filter((p) => p.href !== current).map((p) => `<a href="${p.href}">${p.label}</a>`).join('')}`.

- [ ] **Étape 6 : les réservations du jour et les échéances.**

Dans `app/resa.js`, ajouter `import { AVANT, RESERVER } from '../data/pratique.js';`,
puis :

```js
/** L'état d'une entrée à réserver : « à réserver » tant que les données ne disent pas « réservé ». */
export const etatDe = (r) => r.etat || 'a-reserver';

/**
 * Tout ce qui a une heure un jour donné : les billets payés (RESERVATIONS) et
 * les tables ou billets de RESERVER, avec leur état. Trié par heure, puis sans heure.
 */
export function reservationsDuJour(date) {
  const payes = RESERVATIONS.filter((r) => r.date === date).map((r) => ({
    id: r.id, titre: r.title, heure: (r.slot || '').split('–')[0].trim(), etat: 'paye', type: 'billet', url: null,
  }));
  const autres = RESERVER.filter((r) => r.forDate === date).map((r) => ({
    id: r.id, titre: r.title, heure: r.heure || '', etat: etatDe(r), type: r.type, url: r.url || null,
  }));
  return [...payes, ...autres].sort((a, b) => (a.heure || '99:99').localeCompare(b.heure || '99:99'));
}

/**
 * Les échéances pas encore passées ni faites (case cochée sur ce téléphone, ou
 * réservation marquée « reserve » dans les données), de la plus proche à la plus lointaine.
 */
export function echeancesAVenir(depuis = today(), n = Infinity) {
  let faits = {};
  try { faits = JSON.parse(localStorage.getItem('jp2026_faits') || '{}'); } catch { /* navigation privée */ }
  return [...AVANT, ...RESERVER]
    .filter((x) => x.deadline && x.deadline >= depuis && !faits[x.id] && etatDe(x) !== 'reserve')
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, n)
    .map((x) => ({ id: x.id, titre: x.title, deadline: x.deadline }));
}
```

Vérifier dans `aujourdhui.html` (lignes 130-135) que `jp2026_faits` est bien un
objet indexé par `id`. Sinon, adapter le filtre au format réel.

- [ ] **Étape 7 : l'accueil.**

Dans `index.html` :
- **la redirection** (bloc l. 92-107). Pendant le voyage, l'accueil ouvre
  toujours Aujourd'hui :

```js
{
  const params = new URLSearchParams(location.search);
  if (!params.has('accueil') && moment() === 'pendant') {
    const date = params.get('date');
    location.replace('jour.html' + (date ? `?date=${encodeURIComponent(date)}` : ''));
  }
}
```

- **avant le départ**, tout en haut de la page, sous la couverture, un bloc
  « Prochaines échéances » : les 3 premières de `echeancesAVenir(today(), 3)`,
  chacune avec sa date (`formatDate`) et un lien vers `aujourdhui.html`. Si la
  liste est vide, on n'affiche rien ;
- **« À goûter »** (l. 180-184, l'ancre cassée `#gouter`) devient un lien
  `table.html?ville=${step.cityId}` libellé « Les spécialités à goûter » ;
- **`.ojd__pres` et `montePerdu`** (l. 89 et 129) : on retire `montePerdu` ; le
  bouton devient un lien `villes.html`, libellé « Autour de moi » ;
- **la section « L'argent »**, masquée, disparaît avec son code (l. 71-75 et
  294-316).

- [ ] **Étape 8 : les ébauches, le service worker et le CSS.**

Créer `table.html` et `transports.html` sur le modèle de l'en-tête de
`secours.html` : doctype, metas, manifest, theme-color, `app.css`, le petit
script de thème du `<head>`. Le corps :

```html
<main class="wrap">
  <header class="section"><h1>À table</h1><p class="mut">Page en cours de construction.</p></header>
</main>
<script type="module">
import { mountChrome } from './app/ui.js';
mountChrome('table.html');
</script>
```

Dans `transports.html`, le titre est « Transports » et l'appel
`mountChrome('transports.html')`.

Dans `sw.js` :
- ajouter `'table.html', 'transports.html', 'passes.html'` à la ligne des pages
  de `PAGES` ;
- ajouter `'data/passes.js'` à la ligne des données ;
- passer `V` à la version suivante.

Dans `tools/verify.mjs`, ajouter à la liste `pages` : `'table.html'`,
`'transports.html'`, `'passes.html'`, `'secours.html'` et `'villes.html'`.

Dans `app.css`, un bloc `/* --- barre et couvertures --- */` :
- `.nav__search` reprend la taille et les couleurs du bouton `.nav__theme`
  (zone de touche d'au moins 44 × 44 px), et `aria-current` lui donne le même
  soulignement que les liens actifs ;
- `.cover--short` : la hauteur ne dépasse plus 30 % de l'écran sur téléphone
  (`height: min(30svh, 260px)`), et le texte reste lisible sur la photo.

- [ ] **Étape 9 : vérifier.**

Lancer `node tools/verify.mjs | grep -E "✗|passées"` : on attend « ✓ … passées,
1 en attente ».

Lancer `node tools/coherence.mjs | tail -2` : on attend « ✓ aucun point
bloquant ».

Puis, dans le navigateur, à 375 px :

```js
// avant le départ (?date=2026-10-15) : 5 entrées, la loupe, pas de « Perdu ? »
[[...document.querySelectorAll('.nav__links a')].map((a) => a.textContent), !!document.querySelector('.nav__search'), !document.querySelector('.nav__perdu')]
// → [["À faire","Le programme","Les villes","Transports","Le budget"], true, true]
// pendant (index.html?date=2026-11-12) : on arrive sur jour.html?date=2026-11-12, avec 6 entrées
[location.pathname.endsWith('jour.html'), document.querySelectorAll('.nav__links a').length]   // → [true, 6]
// le jour du vol (index.html?date=2026-11-08) : on reste sur l'accueil, avec le menu « avant »
[location.pathname.endsWith('index.html'), document.querySelector('.nav__links a').textContent]   // → [true, "À faire"]
// passes.html?date=2026-11-12 : Transports est allumé
document.querySelector('.nav__links a[aria-current="page"]').textContent   // → "Transports"
// une couverture courte (valises.html) ne dépasse pas 30 % de l'écran
document.querySelector('.cover').getBoundingClientRect().height <= 0.3 * innerHeight   // → true
```

---

### Tâche 2 : le hors-ligne qui survit aux mises à jour

**Fichiers :** modifier `sw.js` (tout sauf la liste `PAGES`) et `README.md`
(la section sur le hors-ligne).

**Interfaces :**
- **Consomme :** la liste `PAGES` de la tâche 1.
- **Produit :** des caches stables `jp-media` et `jp-tiles` ; une coque
  versionnée `jp-shell-${V}`.

- [ ] **Étape 1 : un test qui échoue, dans le navigateur.**

```js
// Une photo « téléchargée » dans l'ancien cache versionné…
const c = await caches.open('jp-media-v41'); await c.put('img/bateau-pirate-5f189e24.webp', await fetch('img/bateau-pirate-5f189e24.webp'));
// … puis on monte V dans sw.js, on recharge deux fois, et l'on regarde :
(await caches.keys())   // attendu : 'jp-media' présent ; 'jp-media-v41' absent
await (await caches.open('jp-media')).match('img/bateau-pirate-5f189e24.webp') !== undefined   // attendu : true
```

Avec le `sw.js` actuel, la photo disparaît : l'activation efface `jp-media-v41`.

- [ ] **Étape 2 : les caches stables et la migration.**

```js
const SHELL = `jp-shell-${V}`;
// Les photos et les tuiles ne dépendent pas de la version : une mise à jour du
// site pendant le voyage ne doit pas effacer ce qu'on a téléchargé à l'hôtel.
const MEDIA = 'jp-media';
const TILES = 'jp-tiles';
```

```js
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    // Les anciens caches versionnés de photos et de tuiles passent dans les caches stables.
    for (const k of await caches.keys()) {
      const cible = k.startsWith('jp-media-') ? MEDIA : k.startsWith('jp-tiles-') ? TILES : null;
      if (!cible) continue;
      const src = await caches.open(k);
      const dst = await caches.open(cible);
      for (const req of await src.keys()) {
        if (await dst.match(req)) continue;
        const res = await src.match(req);
        if (res) await dst.put(req, res);
      }
      await caches.delete(k);
    }
    // Seules les anciennes coques s'en vont.
    const keep = new Set([SHELL, MEDIA, TILES]);
    for (const k of await caches.keys()) if (!keep.has(k)) await caches.delete(k);
    await self.clients.claim();
  })());
});
```

- [ ] **Étape 3 : passer au cache au bout de 3 secondes.**

```js
// Dans le métro, le réseau répond parfois au bout de trente secondes : au-delà
// de 3 s, on sert la copie enregistrée, et la mise à jour continue derrière.
const DELAI_RESEAU = 3000;

async function networkFirst(event, request, cacheName) {
  const reseau = fetch(request).then(async (res) => {
    if (res.ok) await (await caches.open(cacheName)).put(request, res.clone());
    return res;
  });
  event.waitUntil(reseau.then(() => {}, () => {}));
  const cached = await caches.match(request, { ignoreSearch: true });
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
```

Dans l'écouteur `fetch` : `e.respondWith(networkFirst(e, request, SHELL));`.

- [ ] **Étape 4 : les photos des nouvelles pages.**

Dans `mediaList()`, ajouter à `sources` : `'passes.html'`, `'valises.html'`,
`'transports.html'`, `'table.html'` et `'secours.html'`.

Mettre à jour les commentaires de tête de `sw.js` (« Deux caches… ») : la coque
est versionnée, les photos et les tuiles ne le sont pas.

Dans `README.md`, la section sur le hors-ligne dit :
- monter `V` ne vide plus que la coque ;
- le bouton « Préparer le hors-ligne » est maintenant sur la page À faire.

- [ ] **Étape 5 : vérifier.**

Rejouer le test de l'étape 1 : on attend `true`, et `jp-media-vNN` a disparu.

Puis tester hors-ligne :
1. ouvrir `jour.html` et `secours.html` ;
2. arrêter le serveur (`preview_stop`) ;
3. naviguer vers `jour.html?nc=2` : la page s'affiche ;
4. naviguer vers `budget.html`, jamais visitée : l'accueil s'affiche ;
5. relancer le serveur (`preview_start` « japon »).

Enfin, `node tools/coherence.mjs | tail -2` affiche « ✓ aucun point
bloquant ».

---

### Tâche 3 : Aujourd'hui (`jour.html`)

**Fichiers :** modifier `jour.html` (le gabarit, l. 20-48, et le script) et
`app.css` (bloc `/* --- aujourd'hui --- */`).

**Interfaces :**
- **Consomme :**
  - `reservationsDuJour(date)` et `echeancesAVenir(depuis)` (tâche 1) ;
  - `montreChauffeur(hotel)` et `lienRentrer(hotel)` (`app/quartiers.js`,
    inchangées) ;
  - `TRAJETS[].decision` et `TRAJETS[].n` (`data/valises.js`) ;
  - `FLIGHTS` (`id: 'retour'`, `legs[0].depart`, `flight`, `from`).
- **Produit :** rien pour les autres tâches.

- [ ] **Étape 1 : les tests qui échouent** (navigateur, 375 × 812, chacun sur
  sa date).

```js
// 25 nov (jour.html?date=2026-11-25) : la barre est visible sans défiler, avec ses 3 actions
const s = document.querySelector('.soir'); const r = s.getBoundingClientRect();
[r.top >= 0 && r.bottom <= innerHeight, s.querySelectorAll('.soir__actions .btn').length]   // → [true, 3]
// 2 déc : la barre « Départ », et plus de « Ce soir »
[!!document.querySelector('.soir--depart'), !document.querySelector('.soir:not(.soir--depart)')]   // → [true, true]
// 15 nov (Kanazawa, pas de téléphone) : la mention « messagerie Booking »
document.querySelector('.soir__sanstel')?.textContent.includes('messagerie Booking')   // → true
// 14 nov : l'échéance du jour (Saikō Shinkan)
!!document.querySelector('.amanquer__item--echeance')   // → true
// 18 nov : le billet Nintendo dans « À ne pas manquer »
document.querySelector('#resa').textContent.includes('Nintendo')   // → true
// la carte vient après le parcours ; « Près de moi » et « Dans le coin » ont disparu
[!!(document.querySelector('#parcours').compareDocumentPosition(document.querySelector('#map')) & Node.DOCUMENT_POSITION_FOLLOWING), !document.querySelector('#pres'), !document.querySelector('#coin')]   // → [true, true, true]
// 8 nov (le vol) : pas de barre
!document.querySelector('.soir')   // → true
```

- [ ] **Étape 2 : le gabarit.**

L'ordre dans le document devient :
- `#cal` ;
- `#tete` ;
- `<div id="soir">` : la barre ;
- `<div id="resa">` : « À ne pas manquer » ;
- `<div id="trajet">` : le trajet et les valises ;
- `.jour__grille`, qui contient `.jour__corps` (`#parcours`), PUIS
  `.jour__aside` (la carte, `#carte-meta`, `#go`, `#meteo`).

Sur grand écran, la grille garde la carte dans la colonne de côté : ajuster
`grid-template-areas` dans le bloc CSS de la tâche.

- [ ] **Étape 3 : la barre « Ce soir » ou « Départ ».**

```js
// --- la barre « Ce soir » ------------------------------------------------------
// Ce qu'on cherche fatigué ou perdu : rentrer, montrer l'adresse, appeler.
// Le jour du départ, c'est le vol qui compte.
const retour = FLIGHTS.find((f) => f.id === 'retour');
const estDepart = retour && jour.date === retour.date;
const arriveeDuJour = hotel && step && step.from === jour.date;
if (estDepart) {
  const leg = retour.legs[0];
  q('soir').innerHTML = `<section class="soir soir--depart" aria-label="Départ">
    <p class="soir__titre"><span class="label">Départ</span> ${esc(leg.flight)} à <span class="data">${esc(leg.depart)}</span>, Haneda terminal 3</p>
    <p class="soir__actions">
      <a class="btn" href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('Haneda Airport Terminal 3')}&travelmode=transit" target="_blank" rel="noopener">Y aller</a>
      <a class="btn btn--ghost" href="valises.html#t6">Les valises du départ</a>
    </p></section>`;
} else if (hotel) {
  q('soir').innerHTML = `<section class="soir" aria-label="Ce soir">
    <p class="soir__titre"><span class="label">Ce soir</span> ${esc(hotel.name)}</p>
    <p class="soir__actions">
      <a class="btn" href="${esc(lienRentrer(hotel))}" target="_blank" rel="noopener">Y aller</a>
      <button class="btn btn--ghost" type="button" id="chauffeur-btn">Montrer au chauffeur</button>
      ${hotel.tel
        ? `<a class="btn btn--ghost" href="tel:${esc(hotel.tel.replace(/[^+\d]/g, ''))}">Appeler</a>`
        : '<span class="mut soir__sanstel">Pas de téléphone : messagerie Booking</span>'}
    </p>
    ${arriveeDuJour && hotel.arrivee ? `<details class="soir__arrivee" open><summary>Arrivée à partir de ${esc(hotel.checkIn)}</summary><p>${esc(hotel.arrivee)}</p>${hotel.meals ? `<p class="mut">Repas : ${esc(hotel.meals)}</p>` : ''}</details>` : ''}
  </section>`;
  q('chauffeur-btn').addEventListener('click', () => montreChauffeur(hotel));
}
```

Le dernier test de l'étape 1 n'est vert que si `hotel` est vide le 8 nov. :
vérifier comment `hotel` est calculé (l'étape qui couvre `jour.date`).

- [ ] **Étape 4 : « À ne pas manquer ».**

```js
// --- à ne pas manquer -----------------------------------------------------------
// Les rendez-vous à heure fixe du jour, avec leur état, et les échéances qui tombent aujourd'hui.
const ETAT = { paye: 'payé', reserve: 'réservé', 'a-reserver': 'à réserver' };
const resas = reservationsDuJour(jour.date);
const duJourMeme = echeancesAVenir(jour.date).filter((x) => x.deadline === jour.date);
q('resa').innerHTML = (resas.length || duJourMeme.length) ? `
  <div class="shead"><h2>À ne pas manquer</h2></div>
  ${resaStrip(jour.date)}
  <ul class="amanquer">
    ${resas.filter((r) => r.etat !== 'paye').map((r) => `<li class="amanquer__item amanquer__item--${r.etat}">
      <span class="data">${esc(r.heure || '—')}</span> ${esc(r.titre)} <span class="label">${ETAT[r.etat]}</span>
      ${r.etat === 'a-reserver' && r.url ? `<a href="${esc(r.url)}" target="_blank" rel="noopener">réserver</a>` : ''}</li>`).join('')}
    ${duJourMeme.map((x) => `<li class="amanquer__item amanquer__item--echeance">
      <span class="label">Échéance aujourd'hui</span> ${esc(x.titre)} — <a href="aujourdhui.html">À faire</a></li>`).join('')}
  </ul>` : '';
```

La carte riche des billets payés (`resaStrip`, Nintendo) reste en tête ; la
liste reprend le reste.

- [ ] **Étape 5 : le trajet et les valises ; on retire « Près de moi » et
  « Dans le coin ».**

- **Le trajet :** déplacer le bloc « Le trajet du jour » (`legDuJour`, l.
  ~390-403) et `departBlock` dans `q('trajet')`. Y ajouter la décision pour les
  valises :

```js
const valisesLigne = trajetValises
  ? `<p class="jour__valises"><span class="label">Les valises</span> ${esc(trajetValises.decision)} — <a href="valises.html#t${trajetValises.n}">le détail</a></p>`
  : '';
```

- **« Près de moi » et « Dans le coin » :**
  - supprimer le rendu de `#coin` et de `#pres` (l. ~429-437), leurs `<div>`,
    et les imports `dansLeCoinHTML`, `montePresDeMoi` et `positionConnue` s'ils
    ne servent plus ;
  - supprimer l'ancienne carte « Ce soir » (`.card.tonight`), que la barre
    remplace ;
  - dans `.jour__ailleurs`, remplacer « Les adresses de … » par
    `<a class="btn btn--ghost" href="villes.html${step ? `?e=${step.n}` : ''}">Autour de moi</a>`.

- [ ] **Étape 6 : le CSS, puis la vérification.**

Le bloc `/* --- aujourd'hui --- */` :
- `.soir` est une bande compacte, en carte, avec une bordure à la couleur de
  la ville (`--c`) ;
- `.soir__actions` passe à la ligne sur 375 px, chaque bouton offrant une zone
  de touche de 44 px au moins ;
- `.amanquer` est une liste sans puces : l'heure en `data`, l'état en
  `label`, avec une couleur d'accent pour « à réserver » et pour « échéance ».

Rejouer les tests de l'étape 1, aux dates 2026-11-08, 14, 15, 18 et 25 nov. et
2026-12-02, en clair puis en sombre. Vérifier aussi qu'il n'y a pas de
défilement horizontal : `document.documentElement.scrollWidth === innerWidth`.

Enfin, lancer `node tools/verify.mjs` et `node tools/coherence.mjs`.

---

### Tâche 4 : Autour de moi / Les villes (`villes.html`, `app/quartiers.js`)

**Fichiers :** modifier `villes.html` (sections l. 34-69, et le script),
`app/quartiers.js` (`carteQuartierHTML`, l. 430-456) et `app.css` (bloc
`/* --- autour de moi --- */`).

**Interfaces :**
- **Consomme :**
  - `moment()` (tâche 1) ;
  - `maPosition()`, qui rend une Promise de `[lat, lng]` ;
  - `ouSuisJe(pos, cityId?)`, qui rend `{type:'dans', quartier}`,
    `{type:'pres', spot, quartier, d}` ou `{type:'loin', near}` ;
  - `quartiersOrdonnes(step)`.
- **Produit :**
  - les cartes `<details class="qcard" id="q-<id>">` ;
  - `carteQuartierHTML(entry, { etoiles })`, où `etoiles` est un `Set`
    d'identifiants d'adresses ;
  - la redirection de `#table` vers `table.html?ville=`.
- **Ne supprime aucune fonction exportée de `app/quartiers.js` :** le ménage
  des exports morts est fait à la tâche 10.

- [ ] **Étape 1 : les tests qui échouent** (navigateur, 375 px).

```js
// villes.html?e=1 : les sections, dans l'ordre
[...document.querySelectorAll('main section.section')].map((s) => s.id)   // → ['ou', 'quartiers', 'evenements', 'hotel', 'types'] (une section sans contenu peut être masquée)
// celles qui partent
['pres', 'incontournables', 'table', 'jours'].every((id) => !document.getElementById(id))   // → true
// des cartes de quartier repliées, avec des étoiles
[[...document.querySelectorAll('details.qcard')].every((d) => !d.open), document.querySelectorAll('.qcard .etoile').length > 0]   // → [true, true]
// une ancre ouvre sa carte (villes.html?e=1#q-tokyo-asakusa)
document.getElementById('q-tokyo-asakusa').open   // → true
// un ancien lien vers « À table » (villes.html?e=3#table)
location.pathname.endsWith('table.html') && location.search.includes('ville=kyoto')   // → true
// géolocalisation refusée : le message dit quoi faire
navigator.geolocation.getCurrentPosition = (ok, ko) => ko({ code: 1 }); document.getElementById('ou-btn').click();
await new Promise((r) => setTimeout(r, 300)); document.getElementById('ou-msg').textContent.includes('Réglages')   // → true
// une position à Gion, sur la page Kyoto (e=3) : la carte de son quartier s'ouvre
navigator.geolocation.getCurrentPosition = (ok) => ok({ coords: { latitude: 35.0037, longitude: 135.7788 } }); document.getElementById('ou-btn').click();
await new Promise((r) => setTimeout(r, 300)); [...document.querySelectorAll('details.qcard[open]')].map((d) => d.id)   // → [l'id du quartier de Gion]
// une position à Osaka, sur la page Kyoto : on bascule sur l'étape d'Osaka, carte ouverte
// → location.search contient « e=4 », et le hash commence par « #q-osaka- »
// le libellé suit le moment : « Autour de moi » le 12 nov., « Les villes » le 15 oct.
document.title   // → contient « Autour de moi » avec ?date=2026-11-12
// la hauteur, pour Tokyo (e=1)
document.documentElement.scrollHeight <= 6000   // → true
```

- [ ] **Étape 2 : les cartes de quartier repliables, avec les étoiles.**

Dans `carteQuartierHTML(entry, { etoiles = new Set() } = {})` :
- l'`<article class="qcard" id="q-…">` devient un `<details class="qcard" id="q-…">` ;
- `.qcard__tete` devient le `<summary>`, qui garde le nom, le nom japonais et
  le badge « excursion » ;
- `ligneEssentiel` reçoit `etoiles` et préfixe le nom de chaque adresse
  d'`etoiles` par `<span class="etoile" aria-label="incontournable">★</span>`.

Dans `guide.html`, si `carteQuartierHTML` y est appelée, l'appel reste valide
(le second argument est facultatif).

- [ ] **Étape 3 : les sections de `villes.html`.**

La page devient, dans l'ordre :
1. `#etapes` (inchangé) ;
2. `<section class="section" id="ou">`, qui contient un bouton
   `<button class="btn" id="ou-btn">Où suis-je ?</button>` et un message
   `<p class="mut" id="ou-msg" aria-live="polite"></p>` ;
3. `#quartiers`, toujours visible (retirer `hidden`) ;
4. `#evenements` ;
5. `<section class="section" id="hotel">` : une seule ligne, le nom de l'hôtel
   et un lien `secours.html#h-${hotel.id}` libellé « adresse, téléphone,
   arrivée » ;
6. `#types` : les plans B, dans un `<details>` replié.

On supprime :
- `#pres` et l'appel à `montePresDeMoi` ;
- `#incontournables` et le rendu de `SELECTION`, sauf pour en tirer les
  étoiles ;
- `#table` et le rendu des plats et des tables ;
- `#jours` ;
- le bloc `#hotel` riche (l. 118-138) : la ligne simple le remplace.

Les étoiles d'une étape : `new Set(sel.picks.map((p) => p.id))`. On les passe à
`carteQuartierHTML(entry, { etoiles })`.

- [ ] **Étape 4 : « Où suis-je ? », les ancres et le libellé.**

```js
// --- arriver par une ancre --------------------------------------------------------
// #table visait l'ancienne section « À table » : elle vit maintenant sur sa page.
if (location.hash === '#table') location.replace(`table.html?ville=${city.id}`);
const ouvrirQuartier = (id) => {
  const d = document.getElementById('q-' + id);
  if (!d) return false;
  d.open = true;
  d.scrollIntoView({ behavior: 'auto', block: 'start' });
  return true;
};
if (location.hash.startsWith('#q-')) ouvrirQuartier(location.hash.slice(3));

// --- « Où suis-je ? » ---------------------------------------------------------------
// Tout est calculé sur le téléphone, la position ne quitte jamais l'appareil.
q('ou-btn').addEventListener('click', async () => {
  const msg = q('ou-msg');
  msg.textContent = 'Je cherche votre position…';
  try {
    const pos = await maPosition();
    const r = ouSuisJe(pos);           // toutes villes : on peut être ailleurs que la page affichée
    const qd = r.quartier;
    if (!qd) { msg.textContent = `Aucun quartier repéré autour de vous. Choisissez l'étape où vous êtes, ou cherchez avec la loupe.`; return; }
    if (qd.cityId !== city.id) {
      const now = today();
      const cible = STEPS.find((s) => s.cityId === qd.cityId && now >= s.from && now < s.to) || STEPS.find((s) => s.cityId === qd.cityId);
      location.href = `villes.html?e=${cible.n}#q-${qd.id}`;
      return;
    }
    ouvrirQuartier(qd.id);
    msg.textContent = r.type === 'dans' ? `Vous êtes dans le quartier ${qd.nom}.` : `Vous êtes près de ${r.spot.name}, quartier ${qd.nom}.`;
  } catch {
    msg.textContent = 'Position indisponible. Sur iPhone : Réglages › Confidentialité › Service de localisation › Sites Safari. Sinon, ouvrez le quartier dans la liste ci-dessous.';
  }
});

// Le libellé suit le moment : on découvre « Les villes » avant le départ, on cherche « Autour de moi » sur place.
document.title = `${titre} — ${moment() === 'pendant' ? 'Autour de moi' : 'Les villes'} · Japon 2026`;
```

Importer `maPosition`, `ouSuisJe`, `moment` et `STEPS`, s'ils ne le sont pas
déjà.

- [ ] **Étape 5 : le CSS, puis la vérification.**

Le bloc `/* --- autour de moi --- */` :
- `details.qcard > summary` garde l'allure de l'ancienne tête, avec un chevron
  qui tourne à l'ouverture ;
- `.etoile` prend l'accent de la ville ;
- `#ou` est compact : le bouton, puis le message en dessous.

Rejouer les tests de l'étape 1 pour `e=1`, `e=3` et `e=6`, en clair puis en
sombre, sans défilement horizontal.

Lister les liens vers des sections disparues :
`grep -rn "villes.html[^\"']*#" *.html app/*.js`. Les noter dans le compte
rendu : ceux des fichiers qu'on ne possède pas seront corrigés à la tâche 10.

Enfin, lancer `node tools/verify.mjs` et `node tools/coherence.mjs`.

---

### Tâche 5 : À table (`table.html`, `itineraire.html`)

**Fichiers :** remplacer l'ébauche `table.html` ; modifier `itineraire.html`
(l'onglet « À manger », l. 316-341, et le code mort l. 83, 90-91, 145-158 et
215-235, à confirmer avant de supprimer) et `app.css` (bloc
`/* --- à table --- */`).

**Interfaces :**
- **Consomme :**
  - `etatDe` (tâche 1) ;
  - `RESERVER[].type === 'table'`, `forDate`, `heure`, `url` et
    `commentReserver` ;
  - `DELICES[{ cityId, items: [{ id, img, e, n, jp, d }] }]` ;
  - `SPOTS[]` où `table` est vrai, avec `tabelog`, `resa`, `fermeture`, `jp`,
    `budget`, `blurb` ou `pourquoi` ;
  - `quartierNomDeSpot(spot)`, `fermeBadgeHTML(spot)` et `lienMaps(spot)`
    (`app/quartiers.js`).
- **Produit :** `table.html?ville=<cityId>`, les sections `#resas`,
  `#specialites` et `#tables`, et l'ancre `#d-<id>` sur chaque plat.

- [ ] **Étape 1 : les tests qui échouent** (navigateur, 375 px).

```js
// table.html?ville=kanazawa : trois sections, et autant de plats que dans DELICES
const { DELICES } = await import('./data/delices.js');
[[...document.querySelectorAll('main section.section')].map((s) => s.id), document.querySelectorAll('#specialites [id^="d-"]').length === DELICES.find((c) => c.cityId === 'kanazawa').items.length]
// → [['resas', 'specialites', 'tables'], true]
// table.html?ville=kyoto : Junsei « à réserver », avec un lien pour réserver
[document.querySelector('#resas').textContent.includes('Junsei'), document.querySelector('#resas').textContent.includes('à réserver')]   // → [true, true]
// pendant le voyage (table.html?date=2026-11-23), sans ?ville= : l'onglet d'Osaka est ouvert
document.querySelector('#villes [aria-pressed="true"]').textContent.includes('Osaka')   // → true
// la hauteur, pour Tokyo (table.html?ville=tokyo)
document.documentElement.scrollHeight <= 6000   // → true
// itineraire.html : plus de spécialités ni d'onglet « À manger »
!document.body.textContent.includes('À manger')   // → true (vérifier qu'aucun autre libellé légitime ne le contient)
```

- [ ] **Étape 2 : la page.**

Le gabarit :
- l'en-tête de `valises.html`, couverture `img/sushi-platter-a2e4caf6.webp`,
  titre « À table » ;
- `<nav class="chipbar ptabs" id="villes">`, comme les étapes de
  `villes.html` ;
- dans `<main class="wrap">`, trois sections :
  - `<section class="section" id="resas">`, titre « Vos réservations » ;
  - `<section class="section" id="specialites">`, titre « Les spécialités à
    goûter » ;
  - `<section class="section" id="tables">`, titre « Les bonnes tables ».

Le script :

```js
import { CITIES, STEPS } from './data/trip.js';
import { DELICES } from './data/delices.js';
import { SPOTS } from './data/spots.js';
import { RESERVER } from './data/pratique.js';
import { mountChrome, esc, formatDate, today, moment } from './app/ui.js';
import { etatDe } from './app/resa.js';
import { quartierNomDeSpot, fermeBadgeHTML, lienMaps } from './app/quartiers.js';

// Une seule place pour manger : les réservations, les plats à goûter, les bonnes tables, ville par ville.
mountChrome('table.html');
const q = (id) => document.getElementById(id);
const villes = [...new Set(STEPS.map((s) => s.cityId))];           // l'ordre du voyage, Tokyo une fois
const param = new URLSearchParams(location.search).get('ville');
const enCours = STEPS.find((s) => today() >= s.from && today() < s.to);
const ville = villes.includes(param) ? param : (moment() === 'pendant' && enCours ? enCours.cityId : villes[0]);
const spotsParId = new Map(SPOTS.map((s) => [s.id, s]));
document.documentElement.style.setProperty('--c', `var(--c-${ville})`);

q('villes').innerHTML = villes.map((id) => `<a class="chip" href="table.html?ville=${id}" aria-pressed="${id === ville}">
  <span class="chip__dot" style="background:var(--c-${id})"></span>${esc(CITIES[id].name)}</a>`).join('');

// 1. Les réservations de la ville : les tables, rangées par date.
const resas = RESERVER.filter((r) => r.type === 'table' && spotsParId.get(r.spotId)?.cityId === ville)
  .sort((a, b) => a.forDate.localeCompare(b.forDate));
const ETAT = { reserve: 'réservé', 'a-reserver': 'à réserver' };
q('resas').insertAdjacentHTML('beforeend', resas.length ? `<ul class="tresas">${resas.map((r) => `
  <li class="tresas__item tresas__item--${etatDe(r)}">
    <span class="data">${esc(formatDate(r.forDate, { weekday: true }))}${r.heure ? ` · ${esc(r.heure)}` : ''}</span>
    <b>${esc(r.title)}</b> <span class="label">${ETAT[etatDe(r)]}</span>
    ${etatDe(r) === 'a-reserver' ? `<details><summary>Comment réserver</summary><p>${esc(r.commentReserver || '')}</p>${r.url ? `<p><a class="btn" href="${esc(r.url)}" target="_blank" rel="noopener">Réserver</a></p>` : ''}</details>` : ''}
  </li>`).join('')}</ul>` : '<p class="mut">Aucune table réservée dans cette ville : les bonnes adresses sont plus bas.</p>');
```

La suite du script :
- **les spécialités :** une grille de cartes, chacune avec `id="d-${it.id}"`, la
  photo `it.img` (`loading="lazy"`, `alt` = nom), sinon l'emoji `it.e` en
  grand, puis le nom `it.n`, le nom japonais `it.jp` (`lang="ja"`) et la
  description `it.d`. Sur 375 px, deux colonnes.
- **les bonnes tables :** `SPOTS.filter((s) => s.table && s.cityId === ville)`,
  regroupées par `quartierNomDeSpot(s)`. Pour chacune :
  - le nom, le nom japonais, `fermeBadgeHTML(s)` et `s.budget` ;
  - une ligne `s.pourquoi || s.blurb` ;
  - des liens Tabelog (`s.tabelog`), Maps (`lienMaps(s)`) et réservation
    (`s.resa`, quand c'est une URL) ;
  - le reste replié dans un `<details>`.
- **les compteurs `shead__meta`**, comme ailleurs.
- **au chargement**, si `location.hash` commence par `#d-`, faire défiler
  jusqu'au plat (`scrollIntoView`).

- [ ] **Étape 3 : retirer le doublon du programme.**

Dans `itineraire.html` :
- l'onglet « À manger » et son rendu disparaissent ;
- à la place, un lien en fin de page :
  `<p class="more"><a href="table.html">Les spécialités et les bonnes tables, ville par ville</a></p>` ;
- supprimer ensuite le code mort signalé (l. 83, 90-91, 145-158, 215-235), en
  vérifiant d'abord, pour chaque bloc, qu'aucune fonction ni variable n'est
  utilisée ailleurs (`grep`).

- [ ] **Étape 4 : le CSS, puis la vérification.**

Le bloc `/* --- à table --- */` : `.tresas`, la grille `.tspe`, les cartes de
plat et les tables par quartier.

Rejouer les tests de l'étape 1 pour les 5 villes, en clair puis en sombre,
sans défilement horizontal. Vérifier aussi `table.html?ville=kanazawa#d-nodoguro`
: la page défile jusqu'au plat. Enfin, lancer `node tools/verify.mjs` et
`node tools/coherence.mjs`.

---

### Tâche 6 : Transports (`transports.html`, `passes.html`)

**Fichiers :** remplacer l'ébauche `transports.html` ; modifier `passes.html`
(replier le détail) et `app.css` (bloc `/* --- transports --- */`, plus le
bloc `passes__` si nécessaire).

**Interfaces :**
- **Consomme :**
  - `SEGMENTS[{ fromStepId, toStepId, label, duration, pricePerPerson }]` (5
    segments) ;
  - `STEPS` (`from`, `cityId`) et `CITIES` ;
  - `FLIGHTS` (`id: 'retour'`) ;
  - `TRAJETS[{ n, date, decision, cout2 }]` (`data/valises.js`, 6 trajets) ;
  - `PASSES[{ id, nom, jp, duree, prix, quand, resume }]` (`data/passes.js`) ;
  - `SURPLACE[].place === 'transports'` (tâche 1) ;
  - l'entrée `AVANT` du Suica (son `id` est à trouver dans `data/pratique.js`).
- **Produit :** les sections `#trajets`, `#passes`, `#valises` et `#quotidien`.

- [ ] **Étape 1 : les tests qui échouent** (navigateur, 375 px).

```js
// transports.html : les quatre sections dans l'ordre, et six trajets
[[...document.querySelectorAll('main section.section')].map((s) => s.id), document.querySelectorAll('#trajets li').length]
// → [['trajets', 'passes', 'valises', 'quotidien'], 6]
// chaque trajet renvoie à sa fiche Valises, t1 à t6
[...document.querySelectorAll('#trajets a[href^="valises.html#t"]')].map((a) => a.getAttribute('href'))   // → ['valises.html#t1', …, 'valises.html#t6']
// les deux passes mènent au détail
[...document.querySelectorAll('#passes a')].map((a) => a.getAttribute('href'))   // → ['passes.html#hakone', 'passes.html#nikko']
// les hauteurs
document.documentElement.scrollHeight <= 3500   // transports.html → true
// passes.html : 5 000 px au plus, « En bref » et « Dans votre programme » restent hors des <details>
document.documentElement.scrollHeight <= 5000   // → true
```

- [ ] **Étape 2 : la page.**

Le gabarit : la couverture `img/gare-de-tokyo-marunouchi-9a26e211.webp`, le
titre « Transports », puis les sections `#trajets` (« Vos trajets entre
villes »), `#passes` (« Vos passes »), `#valises` (« Les valises ») et
`#quotidien` (« Au quotidien »).

Le script, pour les trajets :

```js
// Les trajets entre villes : la seule source, SEGMENTS, plus le départ pour Haneda.
const villeDe = (stepId) => CITIES[STEPS.find((s) => s.id === stepId).cityId];
const retour = FLIGHTS.find((f) => f.id === 'retour');
const lignes = [
  ...SEGMENTS.map((g) => ({
    date: STEPS.find((s) => s.id === g.toStepId).from,
    de: villeDe(g.fromStepId), vers: villeDe(g.toStepId),
    comment: g.label, duree: g.duration, prix: g.pricePerPerson,
  })),
  { date: retour.date, de: CITIES.tokyo, vers: { id: 'tokyo', name: 'Haneda' },
    comment: `Keikyū vers le terminal 3, vol ${retour.legs[0].flight} à ${retour.legs[0].depart}`, duree: '~1 h', prix: '' },
];
q('trajets').insertAdjacentHTML('beforeend', `<ol class="ttrajets">${lignes.map((l) => {
  const v = TRAJETS.find((t) => t.date === l.date);
  return `<li class="ttrajets__item" style="--c:var(--c-${l.vers.id})">
    <p><span class="data">${esc(formatDate(l.date, { weekday: true }))}</span> · <b>${esc(l.de.name)} → ${esc(l.vers.name)}</b></p>
    <p class="mut">${esc(l.comment)} · <span class="data">${esc(l.duree)}</span>${l.prix ? ` · <span class="data">${esc(l.prix)}</span>` : ''}</p>
    ${v ? `<p><span class="label">Valises</span> ${esc(v.decision)} — <a href="valises.html#t${v.n}">le détail</a></p>` : ''}
  </li>`; }).join('')}</ol>`);
```

- **Vos passes :** une carte par `PASSES` (`nom`, `quand`, `duree`, `prix`,
  `resume`), chacune liée à `passes.html#${p.id}`. Vérifier que `passes.html`
  porte bien les ancres `id="hakone"` et `id="nikko"` ; sinon, les ajouter.
- **Les valises :** les trois étapes du système, en trois lignes, tirées de ce
  que `valises.html` affiche (lire `data/valises.js` : `systemeLead` et la
  partie système de `ENVOYER`), puis le lien « La page Valises ».
- **Au quotidien :**
  - les entrées `SURPLACE` dont `place === 'transports'` ;
  - le texte de l'entrée Suica d'`AVANT` ;
  - une ligne « Taxi : montrez l'adresse en japonais », avec un lien vers
    `secours.html#logements`.

- [ ] **Étape 3 : replier le détail des passes.**

Dans `passes.html`, chaque section de pass garde visibles son titre et son
résumé. Ces blocs passent chacun dans un `<details>` replié :
- « Compris / Pas compris » ;
- « Lequel acheter » ;
- « Le supplément express » ;
- « Où et comment l'acheter » ;
- « Comment s'en servir » ;
- « Reconnaître le bon bus ».

« En bref » et « Dans votre programme » restent ouverts.

- [ ] **Étape 4 : le CSS, puis la vérification.**

Le bloc `/* --- transports --- */`. Rejouer les tests de l'étape 1 en clair
puis en sombre, à 375 px, sans défilement horizontal. Enfin, lancer
`node tools/verify.mjs` et `node tools/coherence.mjs`.

---

### Tâche 7 : Chercher (`guide.html`)

**Fichiers :** modifier `guide.html` (la recherche, l. 133-260 ; la
« Sélection » masquée, l. 571-615) et `app.css` (bloc `/* --- chercher --- */`).

**Interfaces :**
- **Consomme :**
  - `SPOTS`, `DELICES`, `DAYS`, `HOTELS`, `QUARTIERS` et `SURPLACE` (avec `id`
    et `place`, tâche 1) ;
  - les ancres `table.html?ville=<c>#d-<id>`, `secours.html#h-<id>`,
    `villes.html?e=<n>#q-<id>` et `aujourdhui.html#a-lire`.
- **Produit :** `guide.html?chercher` (le curseur dans la recherche) et
  `guide.html?q=<texte>`.

- [ ] **Étape 1 : les tests qui échouent** (navigateur).

```js
// guide.html?chercher : le curseur est dans la recherche
document.activeElement && document.activeElement.id === 'search'   // → true
// pendant le voyage, à Kyoto (?date=2026-11-17&q=todaiji) : Tōdai-ji (Nara, rangé sous Osaka) est trouvé
document.querySelector('.resultats').textContent.includes('Tōdai-ji')   // → true
// guide.html?q=kiyomizu%20dera, puis ?q=tōdai-ji : chacune trouve son adresse
// guide.html?q=nodoguro : le plat, avec un lien vers la page À table
!!document.querySelector('.resultats a[href^="table.html?ville=kanazawa#d-nodoguro"]')   // → true
// guide.html?q=valise : la page Valises vient en premier
document.querySelector('.resultats a').getAttribute('href').startsWith('valises.html')   // → true
// guide.html?q=fukuya : le logement, avec un lien vers Secours
!!document.querySelector('.resultats a[href="secours.html#h-hotel-hananoyado-fukuya"]')   // → true
// guide.html?q=gion : le quartier
!!document.querySelector('.resultats a[href*="#q-kyoto-"]')   // → true
// un ancien lien (guide.html?ville=kyoto) filtre toujours sur Kyoto
document.querySelector('[data-city="kyoto"][aria-pressed="true"], .chip[aria-pressed="true"]')   // → non nul ; adapter le sélecteur au code existant
```

- [ ] **Étape 2 : un index de tout le site.**

```js
// Une seule recherche pour tout le site : on tape, on trouve, où que ce soit rangé.
const PAGES_MOTS = [
  { titre: 'Valises', href: 'valises.html', mots: 'valise valises bagage bagages takkyubin yamato consigne casier' },
  { titre: 'Transports', href: 'transports.html', mots: 'transport train shinkansen bus metro métro suica trajet' },
  { titre: 'Les passes', href: 'passes.html', mots: 'pass freepass hakone nikko tobu romancecar' },
  { titre: 'Secours', href: 'secours.html', mots: 'urgence urgences ambassade police hopital hôpital medecin médecin seisme séisme secours' },
  { titre: 'Le budget', href: 'budget.html', mots: 'budget argent yen euro depense dépense' },
  { titre: 'À faire', href: 'aujourdhui.html', mots: 'faire reserver réserver echeance échéance preparatifs préparatifs hors-ligne' },
];
const stepDe = (cityId) => {
  const now = today();
  return STEPS.find((s) => s.cityId === cityId && now >= s.from && now < s.to) || STEPS.find((s) => s.cityId === cityId);
};
const INDEX = [
  ...PAGES_MOTS.map((p) => ({ type: 'Pages', titre: p.titre, texte: p.mots, href: p.href, cityId: null })),
  ...SPOTS.map((s) => ({ type: 'Adresses', titre: s.name, texte: [s.blurb, s.area, s.jp, s.kind].join(' '), href: null, spot: s, cityId: s.cityId })),
  ...DELICES.flatMap((c) => c.items.map((it) => ({ type: 'Plats', titre: it.n, texte: [it.jp, it.d].join(' '), href: `table.html?ville=${c.cityId}#d-${it.id}`, cityId: c.cityId }))),
  ...DAYS.map((d) => ({ type: 'Journées', titre: `${d.label} — ${d.title}`, texte: d.items.map((i) => i.text).join(' '), href: `jour.html?d=${d.n}`, cityId: d.cityId || null })),
  ...QUARTIERS.map((qq) => ({ type: 'Quartiers', titre: qq.nom, texte: [qq.jp, qq.resume].join(' '), href: `villes.html?e=${stepDe(qq.cityId).n}#q-${qq.id}`, cityId: qq.cityId })),
  ...HOTELS.map((h) => ({ type: 'Logements', titre: h.name, texte: [h.bookingName, h.address, h.dates].join(' '), href: `secours.html#h-${h.id}`, cityId: h.cityId })),
  ...SURPLACE.map((s) => ({ type: 'Conseils', titre: s.title, texte: s.what || s.text || '', href: s.place === 'secours' ? 'secours.html#urgences' : s.place === 'transports' ? 'transports.html#quotidien' : 'aujourdhui.html#a-lire', cityId: null })),
];
const ORDRE_TYPES = ['Pages', 'Adresses', 'Plats', 'Quartiers', 'Journées', 'Logements', 'Conseils'];
```

La correspondance réutilise `norm`, qui retire les accents et les macrons, et
la comparaison sans tirets déjà en place : vérifier que « kiyomizu dera »
trouve « Kiyomizu-dera », et que « todaiji » trouve « Tōdai-ji ». On compare
donc aussi avec les espaces et les tirets retirés. La recherche ignore les
synonymes pour les types autres qu'« Adresses ».

**L'affichage :**
- quand le champ n'est pas vide, une liste `.resultats`, groupée par type dans
  l'ordre `ORDRE_TYPES` ;
- dans chaque groupe, la ville en cours d'abord, si `moment() === 'pendant'` ;
- 8 résultats par groupe au plus, avec un bouton « Voir les N » ;
- une adresse ouvre sa fiche comme aujourd'hui (le comportement actuel des
  cartes) ;
- la recherche n'est plus limitée à la ville de l'étape : supprimer l'effet de
  `villeEtape` dès que le champ n'est pas vide ;
- quand le champ est vide, le catalogue actuel s'affiche, et ses filtres
  secondaires (matrice villes × envies, quartiers, priorité, provenance)
  passent dans un `<details class="filtres">` replié.

- [ ] **Étape 3 : `?chercher`, `?q=`, et la « Sélection ».**

```js
if (entree.has('q')) { q('search').value = entree.get('q'); q('search').dispatchEvent(new Event('input')); }
if (entree.has('chercher') || entree.has('q')) q('search').focus();
```

Supprimer le code de la « Sélection » masquée (l. 571-615), en vérifiant
d'abord avec `grep` qu'aucun appel n'y renvoie. Le titre de la page devient
« Chercher — Japon 2026 ».

- [ ] **Étape 4 : le CSS, puis la vérification.**

Le bloc `/* --- chercher --- */` : `.resultats`, les titres de groupe, une
ligne par résultat (titre, type et ville en `label`).

Rejouer les tests de l'étape 1 à 375 px, en clair puis en sombre. Enfin,
lancer `node tools/verify.mjs` et `node tools/coherence.mjs`.

---

### Tâche 8 : Secours, À faire, Pratique

**Fichiers :** modifier `secours.html`, `aujourdhui.html` (la redirection l.
52, le code mort l. 320-457 et 511-545) et `pratique.html`, qui devient une
redirection ; le bloc `app.css` `/* --- secours et à faire --- */`.

**Interfaces :**
- **Consomme :**
  - `HOTELS` (`id`, `name`, `address`, `tel`, `checkIn`, `arrivee`, `maps`) ;
  - `FLIGHTS` ;
  - `SURPLACE` (avec `id` et `place`, tâche 1) ;
  - les messages du service worker `cache-all` et `cache-status` (inchangés).
- **Produit :**
  - `secours.html` : `#urgences`, `#logements`, `#h-<id>`, `#vols` et
    `#phrases` ;
  - `aujourdhui.html` : `#hors-ligne` et `#a-lire`.

- [ ] **Étape 1 : les tests qui échouent** (navigateur, 375 px).

```js
// secours.html : le menu, l'ordre des sections, sans défilement horizontal
[!!document.querySelector('.nav'), [...document.querySelectorAll('section[id]')].map((s) => s.id).filter((id) => ['urgences', 'logements', 'vols', 'phrases'].includes(id)), document.documentElement.scrollWidth === innerWidth]
// → [true, ['urgences', 'logements', 'vols', 'phrases'], true]
// chaque logement a son ancre, et un tel: ou la mention « messagerie Booking »
const { HOTELS } = await import('./data/trip.js');
HOTELS.every((h) => { const el = document.getElementById('h-' + h.id); return el && (el.querySelector('a[href^="tel:"]') || el.textContent.includes('messagerie Booking')); })   // → true
// le CSS d'impression cache le menu et le pied de page
[...document.styleSheets].some((ss) => { try { return [...ss.cssRules].some((r) => r.media && r.media.mediaText.includes('print') && r.cssText.includes('.nav')); } catch { return false; } })   // → true
// la hauteur de Secours
document.documentElement.scrollHeight <= 4000   // → true
// aujourdhui.html?date=2026-11-12 : plus de redirection ; l'échéance de Rikugi-en (15 nov.) est listée
[location.pathname.endsWith('aujourdhui.html'), document.body.textContent.includes('Rikugi-en')]   // → [true, true]
// aujourdhui.html : le hors-ligne et « À lire avant de partir », avec ses 8 conseils
[!!document.getElementById('hors-ligne'), document.querySelectorAll('#a-lire details').length]   // → [true, 8]
// pratique.html : on arrive sur secours.html
location.pathname.endsWith('secours.html')   // → true
```

- [ ] **Étape 2 : Secours.**

`secours.html` reste une fiche imprimable en A4. À l'écran, elle reçoit le
menu : appeler `mountChrome('secours.html')` si la page ne le fait pas déjà.

Les sections, dans l'ordre :
1. `#urgences` : les numéros de l'entrée `SURPLACE` `urgences` (ses `tels`
   deviennent des liens `tel:`), l'ambassade, la ligne d'assistance, puis la
   conduite à tenir en cas de séisme (entrée `seisme`) ;
2. `#logements` : une fiche `id="h-${h.id}"` par hôtel, avec :
   - le nom ;
   - l'adresse en japonais, en grand (`lang="ja"`) ;
   - un lien `tel:` ou la mention « Pas de téléphone : messagerie Booking » ;
   - l'arrivée (`checkIn`) ;
   - un lien Maps ;
   - le bouton « Montrer au chauffeur » (`boutonChauffeur(h)`, importé de
     `app/quartiers.js`) ;
3. `#vols` ;
4. `#phrases`.

Si le contenu est écrit en dur dans le HTML, le générer depuis `HOTELS`,
`FLIGHTS` et `SURPLACE`, pour qu'il ne puisse plus diverger des données.

`@media print` : cacher `.nav`, `.foot` et les boutons ; garder la mise en page
A4 actuelle.

- [ ] **Étape 3 : À faire.**

Dans `aujourdhui.html` :
- **la redirection** (l. 52) disparaît : la page rend `before()` tant que
  `moment() !== 'apres'`. Pendant le voyage, elle montre ce qu'il reste à faire
  ;
- **le code mort** (l. 320-457 et 511-545) est supprimé, après vérification
  avec `grep` que rien n'y renvoie. La ligne 528 lisait une variable `jour`
  qui n'existait pas ;
- **le hors-ligne :** déplacer depuis `pratique.html` la section « Hors-ligne »
  (gabarit l. ~195-210 et son script) dans une
  `<section class="section" id="hors-ligne">`, placée après les démarches ;
- **« À lire avant de partir » :** une
  `<section class="section" id="a-lire">`, avec un `<details>` replié par
  entrée `SURPLACE` dont `place === 'avant'` (8 entrées) ;
- **le titre de la page :** « À faire — Japon 2026 », et le grand titre « À
  faire ».

- [ ] **Étape 4 : Pratique devient une redirection.**

Remplacer `pratique.html` par la même redirection que `hotels.html`
(`<meta http-equiv="refresh" content="0; url=secours.html">`, plus un lien
visible). Garder `'pratique.html'` dans `PAGES` du service worker, pour que la
redirection marche hors-ligne.

Le lien de l'entrée `SURPLACE` « valises » (`page: 'valises.html'`) ne change
pas.

- [ ] **Étape 5 : le CSS, puis la vérification.**

Rejouer les tests de l'étape 1 en clair puis en sombre. Imprimer
`secours.html` vers un PDF depuis le navigateur, si l'outil le permet ; sinon,
relire les règles `@media print`. Enfin, lancer `node tools/verify.mjs` et
`node tools/coherence.mjs`.

---

### Tâche 9 : les données (une seule version de chaque info)

**Fichiers :**
- `data/days.js`, `data/spots.js`, `data/quartiers.js`, `data/selection.js`,
  `data/delices.js`, `data/lieux.js` (si besoin) et `data/valises.js` (le
  trajet 5) ;
- `data/trip.js` (`SEGMENTS` step-5→step-6, `HOTELS` La Vita `route`, les
  `sub` du `BUDGET`) ;
- `budget.html` (l'état des tables et des billets) ;
- `tools/verify.mjs`.

**Interfaces :**
- **Consomme :** les champs de la tâche 1.
- **Produit :** des données sans contradiction. Les tâches 5 et 7 lisent
  `DELICES` : les plats ajoutés y apparaissent tout seuls.

- [ ] **Étape 1 : les contrôles qui échouent** (`tools/verify.mjs`, nouvelle
  section `console.log('\nUne seule version')`).

```js
// Le texte d'une journée n'affirme jamais l'état d'une réservation : il vit dans RESERVER.
const affirme = DAYS.flatMap((d) => d.items.filter((i) => /\bréservée?s?\b/i.test(i.text)).map((i) => `${d.date} : ${i.text.slice(0, 50)}`));
assert("aucune journée n'affirme un état de réservation", affirme.length === 0, affirme.join(' | '));
// Le 27 novembre, un seul trajet : le shinkansen, partout.
const seg56 = SEGMENTS.find((g) => g.fromStepId === 'step-5' && g.toStepId === 'step-6');
const laVita = HOTELS.find((h) => h.id === 'hotel-la-vita-ikebukuro-residence');
const { TRAJETS } = await import('../data/valises.js');
const t5 = TRAJETS.find((t) => t.n === 5);
assert('Hakone → Tokyo : le shinkansen dans SEGMENTS, la fiche de La Vita et la page Valises',
  /shinkansen/i.test(seg56.label) && !/odakyu/i.test(seg56.label)
  && !/odakyu/i.test(laVita.route.text) && !/odakyu/i.test(t5.train));
// Les valises envoyées au centre Yamato le 27 arrivent le 28 : les deux jours le disent.
const j27 = DAYS.find((d) => d.date === '2026-11-27'); const j28 = DAYS.find((d) => d.date === '2026-11-28');
assert('le 27 prévient (petit sac), le 28 prévoit le retrait au centre Yamato',
  j27.items.some((i) => /petit sac/i.test(i.text)) && j28.items.some((i) => /centre Yamato/i.test(i.text)));
// Les fausses adresses (un plat, un lien de simple recherche) ont quitté SPOTS, et leur plat vit dans DELICES.
const FAUSSES = {
  'spot-faire-suivre-les-valises': null, 'spot-sushi-a-tsukiji': 'sushi-tsukiji', 'spot-monjayaki': 'monja',
  'spot-taiyaki': 'taiyaki', 'spot-melonpan': 'melonpan', 'spot-ichigo-daifuku': 'ichigo-daifuku',
  'spot-crabe-des-neiges': 'kobako', 'spot-nodoguro': 'nodoguro', 'spot-jibuni': 'jibuni',
  'spot-oden-de-kanazawa': 'oden-kanazawa', 'spot-glace-feuille-d-or': 'kinpaku', 'spot-kaiseki': 'kaiseki-midi',
  'spot-obanzai': 'obanzai', 'spot-yudofu': 'yudofu', 'spot-nishin-soba': 'nishin-soba', 'spot-yatsuhashi': 'yatsuhashi',
  'spot-tsukemono': 'tsukemono-kyoto', 'spot-kushikatsu': 'kushikatsu', 'spot-horumon': 'horumon',
  'spot-yuba-de-nikko': 'yuba', 'spot-kamaboko-d-odawara': 'kamaboko', 'spot-soba-de-montagne': 'soba-hakone',
  'spot-kakinoha-zushi': 'kakinoha', 'spot-kaisendon-d-omicho': 'kaisendon',
};
const { DELICES } = await import('../data/delices.js');
const plats = new Set(DELICES.flatMap((c) => c.items.map((i) => i.id)));
const restees = Object.keys(FAUSSES).filter((id) => SPOTS.some((s) => s.id === id));
const platsManquants = Object.values(FAUSSES).filter((p) => p && !plats.has(p));
assert('les fausses adresses ont quitté SPOTS', restees.length === 0, restees.join(', '));
assert('chaque plat retiré des adresses vit dans DELICES', platsManquants.length === 0, platsManquants.join(', '));
```

- [ ] **Étape 2 : vérifier l'échec.**

Lancer `node tools/verify.mjs | grep -E "✗"`. Les cinq contrôles de l'étape 1
doivent échouer.

- [ ] **Étape 3 : les journées.**

Dans `data/days.js` :
- **retirer « réservé »** des lignes qui l'affirment. Exemple, le 27 nov. :
  « Soir : omakase réservé chez Sushi Tomohiro, à deux pas de La Vita
  (4 400 ¥) » devient « Soir : omakase chez Sushi Tomohiro, à deux pas de La
  Vita (4 400 ¥) ». L'état s'affiche sur la journée, par la tâche 3 ;
- **le 27**, ajouter `{"text":"Si les valises partent au centre Yamato d'Ikebukuro : gardez un petit sac pour la nuit, elles n'arrivent que demain","h":"09:00","evening":false}`
  à la bonne place horaire ;
- **le 28**, ajouter `{"text":"Si les valises ont été envoyées : les retirer au centre Yamato d'Ikebukuro-Ekimae (passeport et double du bordereau)","h":"10:00","evening":false}`,
  en l'insérant dans l'ordre des heures de la journée.

- [ ] **Étape 4 : le trajet du 27.**

**`data/trip.js`, segment step-5 → step-6 :**
- `label` : « Bus → Odawara, shinkansen → Tokyo, métro → Kanamecho » ;
- `duration` : « ~2h » ;
- `pricePerPerson` : « ~20 €/pers. » ;
- `via` : `[[35.2565,139.1554],[35.6812,139.7671],[35.7289,139.7106]]`
  (Odawara, gare de Tokyo, Ikebukuro).

**`data/trip.js`, La Vita :**
- `route.text` : « Bus → Odawara (Freepass), shinkansen → Tokyo (35 min),
  métro → Ikebukuro puis Kanamecho (Yūrakuchō / Fukutoshin, 1 arrêt) » ;
- `route.summary` : « · depuis Fukuya · ~2h · ~20 €/pers. ».

**`data/valises.js`, trajet 5 :** `train` devient « Bus → Odawara, shinkansen
→ Tokyo (35 min), métro → Kanamecho (~2 h) ». L'option « Les garder avec soi »
ne doit plus citer Shinjuku : elle dit « plusieurs changements (Odawara, gare
de Tokyo, Ikebukuro) ».

- [ ] **Étape 5 : les fausses adresses.**

Pour chaque identifiant de `FAUSSES` :
1. **chercher toutes ses références** :
   `grep -rn "<id>" data/ *.html app/ tools/lib/` ;
2. **retirer l'entrée de `data/spots.js`** ;
3. **retirer ses références** : l'entrée `OU` de `data/quartiers.js`, sa place
   dans les listes `essentiel` des `QUARTIERS`, les `picks` de
   `data/selection.js`, et `LIEUX` si un lieu pointe dessus ;
4. **vérifier son plat dans `DELICES`.** S'il manque (`taiyaki`,
   `ichigo-daifuku`, `horumon`, `soba-hakone`), l'ajouter dans la bonne ville,
   au format `{ id, img, e, n, jp, d }`, en reprenant la photo (`img`) et le
   texte (`blurb`, `pourquoi`) de l'adresse retirée.

Passer ensuite toutes les adresses `SPOTS` à la règle de la spec : un nom de
plat ou de produit générique, et un lien Maps qui n'est qu'une recherche.
- Lister dans le compte rendu les autres candidates trouvées, par exemple
  `spot-wagashi`, un atelier.
- Ne retirer que celles qui remplissent clairement les deux critères.
- Garder les vrais commerces, les marchés, et ce qui se passe au ryokan.

Mettre à jour les totaux fixes de `tools/verify.mjs` (le nombre d'adresses
d'origine et d'idées), avec un commentaire qui dit pourquoi, au même format que
les commentaires voisins.

- [ ] **Étape 6 : le budget lit l'état des réservations.**

Dans `BUDGET` (`data/trip.js`), les éléments des catégories `tables` et
`billets` ont des clés `table-<id>` ou `billet-<id>`, où `<id>` est un `id` de
`RESERVER` (sauf `resa-nintendo`, déjà payé). Leur `sub` se termine en dur par
« · à réserver ».

Ajouter d'abord ce contrôle à `tools/verify.mjs`, et le voir échouer :

```js
// L'état d'une table ou d'un billet ne s'écrit qu'une fois, dans RESERVER : le budget le lit.
const ventilees = BUDGET.categories.filter((c) => ['tables', 'billets'].includes(c.id)).flatMap((c) => c.items);
const sousEnDur = ventilees.filter((i) => /réserv/i.test(i.sub || '')).map((i) => i.key);
const sansResa = ventilees.filter((i) => /^(table|billet)-/.test(i.key) && !RESERVER.some((r) => r.id === i.key.replace(/^(table|billet)-/, ''))).map((i) => i.key);
assert("le budget n'écrit aucun état de réservation en dur", sousEnDur.length === 0, sousEnDur.join(', '));
assert('chaque table ou billet du budget renvoie à RESERVER', sansResa.length === 0, sansResa.join(', '));
```

Puis :
- retirer « · à réserver » (et ses variantes) des `sub` ;
- dans `budget.html`, là où un élément est affiché, ajouter l'état après son
  `sub` : `etatDe(RESERVER.find((r) => r.id === key.replace(/^(table|billet)-/, '')))`,
  affiché « à réserver » ou « réservé ». Il faut importer `RESERVER` de
  `data/pratique.js` et `etatDe` d'`app/resa.js`.

Vérifier dans le navigateur que `budget.html` affiche « à réserver » pour Junsei,
et rien de plus pour Nintendo.

- [ ] **Étape 7 : vérifier.**

Lancer `node tools/verify.mjs | grep -E "✗|passées"` : on attend « ✓ … passées,
1 en attente ». Puis lancer `node tools/coherence.mjs | tail -2`.

---

### Tâche 12 : le budget refait (`budget.html`)

Tâche ajoutée le 15 octobre, à la demande d'Ilyès : « la page budget n'est pas
hyper claire ». La maquette est validée, et la spec la décrit dans la section
« Le budget — budget.html (refait) ». Elle part après la tâche 9, qui touche les
mêmes fichiers.

**Fichiers :**
- `budget.html` : le gabarit et le script, réécrits ;
- `data/trip.js` : seulement le champ `qui` de deux lignes du `BUDGET` ;
- `tools/verify.mjs` : les totaux ;
- `app.css` : le bloc `/* --- le budget : le solde entre vous…` (l. ~2646) est
  remplacé par un bloc `/* --- le budget --- */`.

**Interfaces :**
- **Consomme :**
  - `BUDGET.categories[].items[]` (`key`, `label`, `sub`, `fix`, `dyn`, `qui`)
    et `BUDGET.defaults` / `formula` ;
  - `HOTELS[].paid` ;
  - `RESERVATIONS[]` (Nintendo, `status: 'payé'`) ;
  - `RESERVER` et `etatDe` (`app/resa.js`) ;
  - `eur()` (`app/ui.js`).
- **Produit :** rien pour les autres tâches.

- [ ] **Étape 1 : les contrôles qui échouent** (`tools/verify.mjs`, près du
  contrôle « déjà réglé au total »).

```js
// Qui a payé quoi vit dans les données (BUDGET[].qui : 'I', 'M' ou 'D' à deux), pareil sur les deux téléphones.
const lignes = BUDGET.categories.flatMap((c) => c.items);
const quiInvalides = lignes.filter((i) => i.qui !== undefined && !['I', 'M', 'D'].includes(i.qui)).map((i) => i.key);
assert('chaque payeur vaut I, M ou D', quiInvalides.length === 0, quiInvalides.join(', '));
assert('les vols sont payés à deux', lignes.find((i) => i.key === 'vol')?.qui === 'D');
assert('le Nintendo Museum a été payé par Ilyès', lignes.find((i) => i.key === 'resa-nintendo')?.qui === 'I');
```

Mets à jour l'assertion « déjà réglé au total » : le total vaut maintenant
5 197 € (les 6 hôtels 3 259 €, les vols 1 900 €, Nintendo 38 €). Le calcul de
« réglé » doit compter une ligne comme payée dès qu'elle a un `qui`, en plus
des hôtels `paid`. Ajoute :

```js
ok('reste à payer = 3 009 €', total - regle, 3009);
```

Lance `node tools/verify.mjs | grep ✗` : ces contrôles échouent tant que les
données n'ont pas changé.

- [ ] **Étape 2 : les données.**

Dans `data/trip.js` (`BUDGET`, ligne JSON unique) :
- ligne `vol` : ajouter `"qui":"D"` ;
- ligne `resa-nintendo` : ajouter `"qui":"I"`.

Rien d'autre ne change. Relance verify : tout est au vert.

- [ ] **Étape 3 : la page.**

Le gabarit de `<main class="wrap">` :

```html
<header class="section">
  <h1>Le budget</h1>
</header>
<section class="section" id="synthese"></section>      <!-- la phrase et la barre -->
<section class="section" id="entre-vous"></section>    <!-- une phrase -->
<section class="section" id="avant"></section>         <!-- avant le départ (à réserver) -->
<section class="section" id="sur-place"></section>     <!-- sur place -->
<section class="section" id="detail"></section>        <!-- le détail par catégorie, replié -->
```

Le calcul, sans `localStorage` :

```js
// Payé = un payeur connu dans les données, ou un hôtel réglé, ou un billet payé.
const payeLigne = (i) => !!i.qui || HOTELS.some((h) => h.id === i.key && h.paid);
const lignes = BUDGET.categories.flatMap((c) => c.items.map((i) => ({ ...i, cat: c.id })));
const total = somme(lignes);
const paye = somme(lignes.filter(payeLigne));
// Avant le départ : ce qui se réserve ou se paie en ligne (billets, tables), non réglé.
const avant = lignes.filter((i) => ['billets', 'tables'].includes(i.cat) && !payeLigne(i));
// Sur place : le reste non réglé (passes, trains, repas, sorties).
const surPlace = lignes.filter((i) => !payeLigne(i) && !avant.includes(i));
// Entre vous : la part de chacun = ce qu'il a avancé seul + la moitié de ce qui est payé à deux.
const avI = somme(lignes.filter((i) => i.qui === 'I'));
const avM = somme(lignes.filter((i) => i.qui === 'M'));
const ecart = (avI - avM) / 2;   // > 0 : Mathilde doit cet écart à Ilyès
```

Reprends la fonction `montant(item)` et le taux de change existants (`somme`,
`dyn`, `formula`). Ce qui était lu ou écrit dans le `localStorage`
(`jp2026_payeur`, `jp2026_paid`, `bdg_paid`, `jp2026_budget_onglet`)
disparaît. Garde `jp2026_rates` seulement s'il sert encore au taux.

**L'affichage :**
- **`#synthese` :** « Le voyage coûte 8 206 € pour deux (4 103 € chacun). Déjà
  payé : 5 197 € · Reste : 3 009 € », puis une barre `.bud__barre` en trois
  segments, proportionnels à payé / avant / sur place, avec une légende. Les
  couleurs viennent uniquement des variables d'`app.css`.
- **`#entre-vous` :**
  - « Vous êtes à égalité » si `ecart` vaut 0 ;
  - sinon « Mathilde doit 19 € à Ilyès » ou l'inverse, avec le montant
    arrondi à l'euro ;
  - et une ligne courte qui explique : « les vols et les hôtels payés à deux ;
    le Nintendo par Ilyès ». Elle est générée à partir des `qui`, pas écrite
    en dur.
- **`#avant` :** une ligne par élément, avec le libellé, la date, le montant et
  l'état (`etatDe` sur l'entrée de `RESERVER` dont l'`id` vaut la clé sans
  `table-` ni `billet-`). Les tables sont regroupées sous un total
  (« 10 tables · 691 € »), dans un `<details>` qui les liste.
- **`#sur-place` :**
  - les passes (Hakone, Nikko) ;
  - les trains ;
  - « Repas et sorties ≈ 66 € par jour pour deux », calculé :
    `(defaults.food + defaults.act) * 2`.
- **`#detail` :** un `<details>` par catégorie, avec son total, ce qui est payé
  et ce qu'il reste ; dedans, ses lignes avec leur payeur (« à deux »,
  « Ilyès », « Mathilde » ou « pas encore payé »).
- **Le lien en bas :** « Les hébergements » mène désormais à
  `secours.html#logements`, car `pratique.html` n'est plus qu'une redirection.
  « Ce qu'il reste à réserver » mène à `aujourdhui.html`.

- [ ] **Étape 4 : les tests dans le navigateur** (`http://t12.localhost:4173/`,
  375 × 812, en clair et en sombre).

```js
// budget.html?date=2026-10-15
const t = document.body.innerText;
[t.includes('8 206'), t.includes('4 103'), t.includes('5 197'), t.includes('3 009')]   // → [true, true, true, true]
document.querySelector('#entre-vous').textContent.includes('Mathilde doit 19')   // → true
document.querySelectorAll('.qui button, [data-qui]').length === 0   // → true : plus de boutons de payeur
[...document.querySelectorAll('main section.section')].map((s) => s.id).filter(Boolean)   // → ['synthese','entre-vous','avant','sur-place','detail']
// un vieux payeur gardé sur le téléphone n'a plus d'effet
localStorage.setItem('jp2026_payeur', JSON.stringify({ vol: 'M' })); location.reload();
// → après rechargement : toujours « Mathilde doit 19 € à Ilyès »
document.documentElement.scrollWidth === innerWidth   // → true
```

Le premier écran (812 px) montre la phrase, la barre et « Entre vous » sans
défiler.

- [ ] **Étape 5 : vérifier.**

Lance `node tools/verify.mjs` (« ✓ … passées, 1 en attente ») et
`node tools/coherence.mjs` (« ✓ aucun point bloquant »).

---

### Tâche 10 : intégration, vérifications et personas (orchestrateur)

**Fichiers :** au cas par cas. Ceux qui sont sûrs :
- `app/quartiers.js` : le ménage des exports morts ;
- `tools/verify.mjs` : ajouter `valises.html` à la liste `pages` ;
- `sw.js` : la montée finale de `V`.

- [ ] **Étape 1 : les liens et les ancres entre tâches.**

Lancer `node tools/coherence.mjs`, puis corriger chaque ancre ou lien interne
mort que les tâches 3 à 9 ont signalé dans des fichiers qu'elles ne
possédaient pas.

- [ ] **Étape 2 : les exports morts.**

Pour chaque export d'`app/quartiers.js`, compter ses usages :
`grep -rn "<nom>" *.html app/`. Supprimer ceux qui ne servent plus, avec ce
qu'ils sont seuls à utiliser. Sont attendus :
- `montePerdu` ;
- `montePresDeMoi` ;
- `dansLeCoinHTML` ;
- `autourHotel`, `autourHotelHTML` ;
- `positionConnue`.

`autoPres` disparaît avec `montePerdu`.

- [ ] **Étape 3 : les contrôles.**

Lancer `node tools/verify.mjs` et `node tools/coherence.mjs` : les deux doivent
être verts. Monter `V`.

- [ ] **Étape 4 : la revue visuelle.**

À 375 × 812, en clair et en sombre, pour chaque page de chaque menu, plus
Passes et Valises, et aux six dates de test :
- pas de défilement horizontal ;
- les hauteurs sous les cibles ;
- aucune erreur dans la console ;
- une capture par page.

- [ ] **Étape 5 : les personas.**

Lancer 6 sous-agents en parallèle, en lecture seule, chacun dans son onglet,
avec une date simulée et une question. Chacun rend le chemin suivi (nombre de
touches), la réponse trouvée, et ce qui l'a gêné.

| Persona | Date | Question | On attend |
|---|---|---|---|
| Perdu à Gion | 2026-11-19 | « Je suis à Gion, il fait nuit : comment je rentre ? » | Aujourd'hui › Ce soir › Y aller ou Montrer au chauffeur ; 1 touche |
| Faim à Kanazawa | 2026-11-15 | « On mange quoi, où, ce midi ? » | À table, ouvert sur Kanazawa |
| Le bus de Hakone | 2026-11-26 | « Ce bus bleu, mon pass le couvre ? » | Transports › Passes › Reconnaître le bon bus |
| Les valises | 2026-11-22 | « Kyoto → Osaka, je fais quoi des valises ? » | Aujourd'hui › Les valises, ou Transports › trajet 3 |
| Urgence | 2026-11-30 | « Mathilde s'est blessée : qui appeler ? » | Secours › Urgences ; 1 touche |
| Avant le départ | 2026-10-20 | « Qu'est-ce qu'il reste à réserver cette semaine ? » | À faire, ou l'accueil › Prochaines échéances |

- [ ] **Étape 6 : corriger.**

Corriger ce que les personas ont relevé, puis rejouer les étapes 3 et 4.

---

### Tâche 11 : livraison (orchestrateur)

- [ ] **Étape 1 :** annoncer à Ilyès que tout est vert :
  - les contrôles ;
  - les captures ;
  - le résultat des personas.

  Attendre son « ok » explicite.
- [ ] **Étape 2 :** commiter au nom d'Ilyès, sans ligne d'attribution, en deux
  commits :
  - la spec et le plan ;
  - la refonte, avec un message dans le style du dépôt.
- [ ] **Étape 3 :** `git fetch`, puis pousser.
- [ ] **Étape 4 :** vérifier le site publié :
  - la `V` du `sw.js` en ligne ;
  - `table.html` et `transports.html` répondent 200 ;
  - le dernier déploiement Pages a réussi (`gh run list -L 1`).
- [ ] **Étape 5 :** rappeler à Ilyès et Mathilde de relancer « Préparer le
  hors-ligne » (page À faire) sur leurs deux iPhone.
