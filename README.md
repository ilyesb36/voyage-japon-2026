# Japon 2026

Le site du voyage : 8 novembre → 3 décembre 2026, six villes, 23 nuits.
En ligne sur <https://ilyesb36.github.io/voyage-japon-2026/>.

Site statique, **sans build**. Ce qui est dans le dépôt est ce qui est servi :
HTML, une feuille de style, des modules ES natifs. Pas de bundler, pas de
`npm run build`, rien à installer pour travailler dessus.

```bash
python3 -m http.server 4173     # puis http://localhost:4173
```

## Les pages

La barre de navigation **change selon le moment** (`moment()` dans `app/ui.js`) :
avant le départ elle mène aux préparatifs et au budget ; pendant le voyage,
« Aujourd'hui » est la page du jour, le guide passe en deuxième, le budget
recule ; après, c'est un souvenir. Aucune page n'est supprimée, seule la barre
bouge. Le paramètre `?date=2026-11-18` permet de voir chaque moment.

Les couleurs de ville s'écrivent `var(--c-tokyo)` et jamais en hexadécimal
dans le JS : c'est ainsi que la palette sombre s'applique aux pastilles, aux
calendriers et aux matrices sans qu'une seule règle ne le sache.

| Page | Ce qu'elle fait |
|---|---|
| `index.html` | l'ouverture, les six villes, la ligne, les vols, la carte, la bande des momiji |
| `villes.html` | **une page par étape** (`?e=1` à `6`) : l'hôtel (adresse en japonais, « M'y emmener », « Appeler », « Montrer au chauffeur »), « Près de moi », « À ne pas rater », **les quartiers** (une carte par quartier, dans l'ordre du programme : à voir / à faire / à manger, les jours où le programme y passe, tout le quartier), « À table » (les plats, puis les tables recommandées), les événements datés, les jours, les journées type |
| `itineraire.html` | la vue d'ensemble : 25 lignes de jours menant chacune à sa page, et les 34 journées type |
| `guide.html` | 456 adresses. Un seul chemin, le même partout : **ville → quartier → à voir / à faire / à manger**, le type de lieu en affinage. Recherche sans accents, avec synonymes (ramen, onsen, pluie…), tri « Près de moi » |
| `jour.html` | **une journée à la fois** : les arrêts dans l'ordre, avec leur heure, situés sur une carte, tout le parcours en un lien Google Maps, « Dans le coin » (manger, et quoi faire s'il reste du temps), « Près de moi », et « Ce soir » (l'hôtel, le chauffeur). `?d=14` ou `?date=2026-11-21` |
| `budget.html` | « Entre vous » en tête, puis deux onglets : *Le compte*, un tableau par poste (reste à payer, et pour chacun ce qu'il a payé et ce qu'il lui reste) ; *Les dépenses*, une ligne par dépense avec son payeur (Ilyès, Mathilde, moitié) |
| `pratique.html` | les six hébergements (consignes d'arrivée, téléphone, prélèvements), les urgences à un geste, les réflexes de terrain, le mode hors-ligne |
| `aujourdhui.html` | **Préparatifs** : le compte à rebours et l'échéancier, rangé **par catégorie** (santé et papiers, hébergements, transports, téléphone, billets, à table, valise) ou par échéance, cochable, le détail replié. Pendant le voyage, elle renvoie à la journée en cours |

Pendant le voyage, un bouton **« Perdu ? »** est dans la barre de toutes les
pages : montrer l'adresse de l'hôtel du soir au chauffeur, l'appeler, « Près de
moi » (le quartier où l'on est et les adresses à quelques minutes, à voir / à
faire / à manger, avec leurs jours de fermeture), rentrer à l'hôtel en
transports, et les urgences.

« Près de moi » se sert du GPS du téléphone : il marche hors-ligne, et rien ne
quitte le téléphone (le lien « Rentrer » ne porte que la destination).

`aujourdhui.html?date=2026-11-18` permet de voir n'importe quel jour du voyage
sans attendre novembre.

## Les données

Aucune donnée n'est écrite dans le HTML. Tout vit dans `data/*.js`.

**Depuis le 28 septembre 2026, `data/*.js` est tenu à la main** et fait foi.
Ce jour-là, une centaine d'adresses (les Secrets de Tokyo), la sélection, les
plats et les journées adaptées y ont été saisis directement ; le 14 octobre
s'y sont ajoutés les quartiers, 31 tables et 11 événements. L'extraction ne
les connaît pas : **ne plus lancer `tools/extract.mjs` ni `fetch-images.mjs`**,
ils effaceraient tout cela sans prévenir.

| Fichier | Ce qu'il tient |
|---|---|
| `data/trip.js` | le voyage, les villes (couleur, fenêtre des momiji), les étapes, les hôtels (adresse en japonais, téléphone, consignes d'arrivée, prélèvement), les trajets, les vols, le budget, les billets datés |
| `data/days.js` | les 25 journées (chaque ligne : `text`, `h` l'heure, `evening`, `lieux`) et les 34 journées type |
| `data/lieux.js` | les lieux cités par les journées, géolocalisés |
| `data/spots.js` | les 456 adresses du guide, une par ligne ; les tables portent `table`, `tabelog`, `resa`, `fermeture` ; les événements `du`, `au`, `etape`, `confirme` |
| `data/quartiers.js` | les 56 quartiers, et `OU` : la position de chaque adresse `[lat, lng, quartier, confiance, famille]` — confiance `sure`, `approx` ou `quartier` (seul le quartier est sûr : pas de distance affichée) |
| `data/selection.js` | « À ne pas rater », étape par étape, avec le pourquoi |
| `data/delices.js` | les plats à goûter, par ville |
| `data/pratique.js` | les démarches (`AVANT`), le sur-place (`SURPLACE`), les normales de saison, les réservations à faire (`RESERVER`) |

On garde la forme : un objet par ligne, les mêmes champs, les mêmes mots.
**Jamais** de numéro de réservation, de code de porte ou de boîte à clés, ni de
lien de pré-enregistrement : le site est public.

`tools/lib/` reste l'archive des sources : les confirmations Booking
(`bookings.mjs`, tenu en phase avec `data/trip.js`), les tables
(`spots-tables.json`), les notes de réservation (`reserver-liens.json`), et
tout ce qui alimentait l'extraction :

| Fichier | Ce qu'il tient |
|---|---|
| `bookings.mjs` | les six réservations d'hôtel. **Rien de sensible** — voir l'avertissement en tête du fichier |
| `reservations.mjs` | les billets datés (Nintendo Museum) |
| `day-plan.mjs` | les journées réécrites en entier, par date |
| `day-additions.json` | des lignes ajoutées à une journée, par numéro |
| `spot-fixes.mjs` | tarifs, horaires et fermetures vérifiés, par nom de lieu |
| `guide-removals.mjs` | les entrées retirées du guide, **par identifiant** |
| `lore*.json` | les notices historiques ; tout fichier `lore*.json` est fusionné |
| `lieux.json` | les lieux du programme, géolocalisés (nom, lat/lng, ville, confiance) |
| `jours-lieux.json` | quelle ligne de quelle journée renvoie à quels lieux |
| `spots-*.json` | les lots d'adresses ajoutés après coup, fusionnés par ordre alphabétique : `spots-nouveaux` (cafés, bars, ouvertures récentes), `spots-insolites`, `spots-sombres` |
| `reserver-liens.json` | où réserver chaque billet (canal, URL officielle, mode d'emploi) |
| `additions.mjs` | les adresses ajoutées au guide d'origine |
| `flights.mjs`, `gazetteer.mjs`, `heroes.json` | vols, villes, images d'ouverture |

## Après une modification de données

```bash
node tools/verify.mjs        # 125 assertions : totaux, argent, notices, images, hors-ligne
node tools/coherence.mjs     # références croisées, heures des journées, quartiers, hôtels, liens
node tools/rapatrier-photos.mjs data/spots.js   # si une fiche a reçu une photo Wikimedia
```

`verify.mjs` est le filet. Ses totaux sont verrouillés : une divergence est une
perte de données, pas un ajustement — sauf ajout volontaire, qu'on reporte
alors dans le compte avec sa raison (c'est ce qui a été fait le 14 octobre
pour les 94 Secrets de Tokyo, les tables et les événements). Il verrouille
notamment les 22 conseils de l'amie guide, les totaux d'argent, la date et
l'heure du billet Nintendo, et le fait qu'aucun monument ne soit sans notice.

`coherence.mjs` vérifie que les fichiers tenus à la main se tiennent entre eux :
chaque choix de la sélection, chaque réservation et chaque lieu d'une journée
existe ; les heures avancent ; les lignes du soir finissent la journée ; chaque
adresse est rangée dans un quartier de sa ville ; aucune consigne d'hôtel ne
contient de code.

Un site hors-ligne doit avoir ses photos dans `img/` : une photo laissée en
URL Wikimedia disparaît sans bruit dès qu'il n'y a plus de réseau.

## Après chaque changement de CSS, de JS ou de données

Monter le numéro de version dans `sw.js` :

```js
const V = 'v33';
```

Sans ça, le service worker continue de servir l'ancienne version et personne
ne voit la mise à jour. C'est déjà arrivé.

## Hors-ligne

Le hors-ligne est une **action explicite** : un bouton sur `pratique.html`,
avec une vraie barre de progression et un décompte. Il met en cache la coque
(pages, modules, données, quartiers) et toutes les photos citées par les
données et les pages, plats compris. Il ne se déclenche pas tout seul à
l'installation : une mise en cache silencieuse s'était déjà déclarée prête
alors qu'elle n'avait rien mis en cache.

## Outils annexes

```bash
node tools/fetch-heroes.mjs           # les images d'ouverture, en grand
node tools/fetch-addition-images.mjs  # les photos des adresses ajoutées
node tools/fetch-fonts.mjs            # les WOFF2, embarquées dans le dépôt
```

Ils ont besoin de `sharp`, seule dépendance, et seulement en développement :
le site servi n'a aucune dépendance.

## Notes de terrain

- **Wikimedia renvoie des 429** au bout d'une soixantaine d'images. Les outils
  respectent `Retry-After` et espacent les requêtes de 700 ms.
- **Les homonymes de Commons** sont un vrai danger : une recherche « Shisen-do »
  ramène un temple de Sapporo. D'où le garde-fou `mustMatch` dans les outils
  de récupération d'images.
- **Les URL de photos Booking expirent** (paramètre `?k=`). Elles sont
  rapatriées dans `img/`, ne pas compter sur les liens d'origine.
- **Les captures d'écran du navigateur sortent parfois blanches** après un
  défilement programmatique. C'est un artefact de l'outil : vérifier par le DOM
  (`img.complete`, `naturalWidth`) plutôt que de croire l'image.
- **Le serveur de test (`python3 -m http.server`) ne pose aucun en-tête de
  cache** : le navigateur garde des versions périmées des modules. Pour tester,
  ajouter `&nc=<n>` aux URL, vider `caches` et désinscrire le service worker.
- **Les blogs recopient les dates de l'an passé.** Eikan-dō : des sites
  annonçaient une ouverture « mi-novembre », le temple dit 20 novembre 2026.
  La source officielle tranche.
- **Musée Ghibli : fermé le mardi**, billets en vente le 10 du mois précédent
  à 10:00 heure du Japon (2:00 à Paris), partis en quelques minutes.
- **Tori-no-ichi** : les foires suivent les jours du coq de novembre ; en 2026,
  le 7 et le 19 seulement, pas de troisième.
- **Le Kagayaki n'a que des places réservées** ; la vente ouvre un mois avant.
- **Les messages des hôtels contiennent des codes** (portail, boîte à clés) et
  des liens de pré-enregistrement nominatifs : on en tire les consignes, jamais
  les codes.
- **Une carte Leaflet sans vue ne s'affiche pas du tout**, et lire ses bornes
  lève « Set map center and zoom first ». Or `fitBounds` ne peut rien calculer
  tant que le conteneur a une largeur de 0, ce qui arrive quand la carte est
  loin sous la ligne de flottaison. `createMap` pose donc toujours une vue de
  repli sur le Japon, et le cadrage exact se fait quand la taille arrive.
