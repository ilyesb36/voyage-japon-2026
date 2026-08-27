# Refonte Japon 2026 — design

Date : 2026-08-27
Statut : validé

## Le problème

Le site fonctionne mais souffre de trois maux cumulés.

**Deux directions artistiques se battent.** Chacune des 8 pages porte son propre
`<style>` inline (DA v6 : papier beige, Fraunces, coins très arrondis), et
`theme.css` repasse par-dessus en `!important` pour imposer la DA v7
« Notion × matcha ». Le résultat est ni l'un ni l'autre. Un symptôme visible :
`theme.css` force `h1{color:var(--ink)}`, ce qui rend le titre du hero — texte
blanc sur photo sombre — quasi illisible.

**Les données sont dupliquées.** `aujourdhui.html` redéclare un tableau `DAYS[]`
qui double le `days[]` de `jour-par-jour.html`, et six constantes `H_*` qui
doublent le `HOTELS[]` de `hotels.html`. Le total hébergement est calculé
indépendamment dans `hotels.html` et dans `budget.html`. Changer un prix
d'hôtel demande aujourd'hui d'éditer trois fichiers cohérents à la main.

**Trois pages racontent la même chose.** `index` et `villes` affichent toutes
deux la carte et la liste des étapes ; `jour-par-jour` et `journees` présentent
deux découpages du même matériau sans que la nav n'explique lequel sert à quoi.

S'y ajoutent deux régressions d'infrastructure : les tuiles Carto renvoient
désormais des images tamponnées « API KEY REQUIRED » sur les trois cartes du
site, et `theme.css` charge Open Props par `@import` depuis unpkg — ce qui fait
tomber tout le thème dès qu'on est hors-ligne, précisément le scénario que la
PWA est censée couvrir.

## Ce qu'on construit

Un site statique de cinq pages, sans étape de build, déployable tel quel sur
GitHub Pages, entièrement utilisable hors-ligne, où chaque donnée n'existe
qu'à un seul endroit.

### Contraintes

- **Pas de build.** Modules ES natifs, servis en HTTPS par GitHub Pages.
- **Hors-ligne d'abord.** Toute dépendance (polices, Leaflet, Open Props,
  images) est locale et pré-cachée par le service worker. Aucun `@import`
  ni hotlink réseau au chargement.
- **Le mobile est le cas nominal.** L'usage réel, c'est un téléphone tenu à
  bout de bras dans une rue de Kyoto en novembre, en plein jour.

## Architecture des données

Trois modules ES sous `data/`, sans dépendance entre eux sauf par identifiant.

```
data/trip.js   → TRIP, STEPS, EXCURSIONS, SEGMENTS, HOTELS, FLIGHTS, BUDGET
data/days.js   → DAYS (les 25 jours), TEMPLATES (les journées type)
data/spots.js  → SPOTS (les 236 idées du guide)
```

**Sources d'extraction** — tout existe déjà, il s'agit de rassembler :

| Export | Vient de |
|---|---|
| `STEPS`, `EXCURSIONS`, `SEGMENTS` | `villes.html` (déjà propre, canonique) |
| `HOTELS` | `hotels.html` `HOTELS[]` + coords de `PTS[]` |
| `BUDGET` | `budget.html` `CATS[]` et `FIELDS[]` |
| `DAYS` | `jour-par-jour.html` `days[]` — `aujourdhui.html` `DAYS[]` est jeté |
| `TEMPLATES` | `journees.html` `DC[]` |
| `SPOTS` | `guide.html`, 236 `<a class="gcard">` parsés (script d'extraction unique) |

**Règles d'intégrité**, à respecter par construction :

- Un hôtel a **un** prix, dans `HOTELS`. Le poste « Hébergement » du budget est
  la **somme calculée** de ces prix, jamais une constante saisie.
- Une étape référence son hôtel par `hotelId`, jamais par son nom recopié.
- Un spot appartient à une ville par `cityId` — le même identifiant que
  `STEPS[].id` — et porte une catégorie et une priorité.
- Un jour référence sa ville par `cityId` et ses spots par `spotId`.

Chaque module exporte des objets gelés (`Object.freeze`) : les vues lisent,
ne mutent pas. Le seul état mutable est le suivi des paiements et les cases
cochées, en `localStorage`.

### Le modèle de spot

Le champ qui manque aujourd'hui et qui débloque la page guide : `cityId`. Les
236 spots sont actuellement groupés par catégorie (`#t0`..`#t5`) puis par titre
`<h3>` de ville — la ville n'est qu'un intertitre, pas une donnée. En la
faisant remonter dans l'objet, on peut croiser ville × envie × priorité, et
poser les spots sur une carte.

```js
{ id, name, cityId, category, priority, blurb, img, maps }
```

## Les cinq pages

| Page | Absorbe | Rôle |
|---|---|---|
| `index.html` — **Le voyage** | `index` + `villes` | Carte en hero, les 6 étapes, vols et trajets, avancement |
| `aujourdhui.html` — **Aujourd'hui** | — | Avant : J−n et checklist. Pendant : le jour, l'hôtel, le prochain train |
| `itineraire.html` — **Jour par jour** | `jour-par-jour` + `journees` | Les 25 jours ; les journées type remontent sur les jours libres |
| `guide.html` — **Le guide** | `guide` | 236 idées, filtres ville × envie × priorité, grille + carte |
| `pratique.html` — **Pratique** | `hotels` + `budget` | Les 6 hôtels puis le budget et les paiements, même source |

`villes.html`, `jour-par-jour.html`, `journees.html` et `hotels.html`
disparaissent. Ils sont remplacés par des redirections `<meta http-equiv>`
vers leur nouvelle adresse, pour ne pas casser les liens déjà partagés ni les
raccourcis d'écran d'accueil.

**La fusion `jour-par-jour` + `journees`.** Les journées type ne méritent pas
une page : elles ne servent qu'au moment où l'on regarde un jour sans
programme. Elles apparaissent donc dans le jour concerné, dans un bloc
« et si… », filtrées sur la ville de ce jour-là. La page `itineraire` reste
une liste des 25 jours, chacun dépliable.

## Direction artistique

Une seule DA, un seul fichier de styles, plus aucun `<style>` inline ni
`!important`.

**Papier, encre, un vermillon.** Fond `#FBF9F4`, encre `#1C1A17`, filets
`#E6E0D4`. L'accent est le vermillon des torii, `#B7301C` — la couleur du
voyage. Le parti pris est le fond clair : l'usage réel est en extérieur, en
plein jour. Un mode sombre suit `prefers-color-scheme` pour les soirées.

**Une couleur par étape, motivée.** Elle sert d'orientation : on la retrouve
sur le marqueur de carte, la pastille de l'étape, l'entête de jour, le badge
de ville sur les cartes du guide.

| Étape | Couleur | Pourquoi |
|---|---|---|
| Tokyo | indigo `#2F4858` | l'ai-zome, les noren, la ville |
| Kanazawa | or `#9A7B2E` | la feuille d'or, Kenroku-en |
| Kyoto | vermillon `#B7301C` | Fushimi Inari, le pic des momiji |
| Osaka | ocre `#C2661F` | les néons de Dotonbori, la cuisine |
| Hakone | ardoise `#3E6A85` | le lac Ashi, le Fuji |
| Excursions | gris neutre, cercle creux | ce ne sont pas des nuits |

Kyoto porte le vermillon parce que c'est le sommet émotionnel du voyage et que
c'est la couleur de l'ensemble du site.

**Typographie.** *Zen Old Mincho* pour les titres et les chiffres qui comptent
— un serif japonais qui tient le français et les kanji. *Inter* pour le texte
courant et l'interface, avec chiffres tabulaires sur tout ce qui est prix,
durée et date. Les deux vendorées en WOFF2, sous-ensemble latin (+ les quelques
kanji utilisés), pour l'hors-ligne.

**La photo, cadrée.** 300 photos, c'est la richesse du site — mais jamais en
fond d'écran derrière du texte. Ratios fixes (16/10 en grille, 4/5 en vedette),
légende explicite, plein écran par lightbox à la demande.

**Les cartes.** Fond Esri *World Light Gray Canvas* + sa couche d'étiquettes :
sans clé, sans filigrane, et son gris neutre laisse ressortir le tracé et les
marqueurs colorés. Vérifié en rendu réel.

## Stack

| Quoi | Pourquoi |
|---|---|
| Modules ES natifs | Pas de build ; GitHub Pages sert tel quel |
| **Alpine.js 3** vendoré | Filtres, accordéons, panneaux — déclaratif, dans le HTML, 15 Ko |
| **Leaflet 1.9** vendoré | Déjà maîtrisé, léger, tuiles cachables |
| **Open Props** vendoré | Tokens, sans l'`@import` réseau qui casse l'hors-ligne |
| CSS `@layer`, container queries, `color-mix()`, `:has()` | Un seul fichier lisible, sans cascade sauvage |

`vendor/` contient tout : Alpine, Leaflet, Open Props, les WOFF2.

## Images

Les 275 photos Wikimedia et 24 photos Booking sont rapatriées dans `img/`.

**Pas de conversion locale.** Le registre npm de la machine est derrière une
authentification d'entreprise, `sharp` n'est donc pas installable, et `sips`
(macOS) ne sait pas écrire de WebP. Wikimedia, de son côté, ne sert plus que
des largeurs de vignettes autorisées — 250, 500, 960, 1280 ; toute autre
largeur renvoie 400.

On s'appuie donc sur le redimensionnement de Wikimedia lui-même :

- **500 px** (~72 Ko) pour toutes les photos de grille — soit ~21 Mo ;
- **960 px** (~230 Ko) pour la trentaine d'images en vedette (hero, chambres
  d'hôtel, têtes de ville) — soit ~8 Mo.

Total attendu ~30 Mo, en JPEG. À ces tailles, l'écart avec du WebP ne justifie
pas d'ajouter une dépendance de build.

**Les photos Booking sont urgentes.** Leurs URL `cf.bstatic.com` portent une
signature `?k=…` qui expire : les photos des six chambres réservées peuvent
disparaître avant le départ. Elles sont rapatriées en priorité.

Le rapatriement répare au passage les images cassées de la page guide. Les
crédits Wikimedia sont conservés dans `img/CREDITS.md`, avec l'URL source et
la licence de chaque fichier.

Un script `tools/fetch-images.mjs` fait le téléchargement, avec reprise
(il saute ce qui est déjà là) et limitation de débit, et reste au dépôt pour
pouvoir en ajouter plus tard.

## Service worker

Passage en v11, deux caches distincts :

- **`shell`** — les 5 pages, le CSS, les modules `data/`, `vendor/`, les icônes.
  Pré-caché à l'installation. Stratégie *network-first* pour récupérer les mises
  à jour, repli sur le cache.
- **`media`** — les images. Pré-caché à l'installation également, puisque
  l'hors-ligne complet est l'objectif. Stratégie *cache-first*.

Comme le pré-cache pèse désormais ~30 Mo, l'installation affiche une
progression et un état « prêt pour le hors-ligne » sur la page Pratique, plutôt
que de se faire en silence.

## Vérification

Ce que je contrôle avant de dire que c'est fini :

1. **Intégrité des données** — un script compare le nombre de spots, de jours,
   d'hôtels et de trajets extraits aux totaux de l'ancien site (236 spots,
   25 jours, 6 hôtels, 5 segments, 4 excursions). Aucune perte silencieuse.
2. **Total du budget** — le total calculé depuis `HOTELS` égale les 3 274 €
   affichés aujourd'hui, et le total général les 7 336 €.
3. **Aucune requête réseau** — onglet réseau vide (hors tuiles de carte) au
   chargement de chaque page.
4. **Hors-ligne** — service worker installé, réseau coupé, les 5 pages et
   leurs images s'affichent.
5. **Rendu** — les 5 pages capturées en 390 px et en 1280 px, mode clair et
   mode sombre, sans débordement horizontal.
6. **Liens** — les anciennes URL redirigent, aucun lien mort.

## Hors périmètre

- Pas de framework à étape de build (Astro, SvelteKit) : écarté pour garder
  le déploiement « je pousse, c'est en ligne ».
- Pas de refonte du contenu éditorial : les textes, conseils et choix de
  spots sont conservés tels quels. Cette refonte déplace et remet en forme,
  elle ne réécrit pas le voyage.
- Pas de météo en direct ni d'API externe : ça casserait l'hors-ligne.
