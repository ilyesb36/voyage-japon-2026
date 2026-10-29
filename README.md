# Japon 2026

Le site du voyage : 8 novembre → 3 décembre 2026, cinq villes en six étapes
(Tokyo en compte deux), 23 nuits.
En ligne sur <https://ilyesb36.github.io/voyage-japon-2026/>.

Site statique, **sans build**. Ce qui est dans le dépôt est ce qui est servi :
HTML, une feuille de style, des modules ES natifs. Pas de bundler, pas de
`npm run build`, rien à installer pour travailler dessus.

```bash
python3 -m http.server 4173     # puis http://localhost:4173
```

## Les pages

La barre de navigation **change selon le moment** (`moment()` et
`PAGES_PAR_MOMENT` dans `app/ui.js`). Les bornes sont celles du séjour au Japon
(`TRIP.japon` dans `data/trip.js`), pas du voyage :

| Moment | Quand | Le menu |
|---|---|---|
| avant | jusqu'au 8 novembre inclus, le jour du vol | À faire · Le programme · Les villes · Transports · Le budget |
| pendant | du 9 novembre au 2 décembre | Aujourd'hui · Autour de moi · À table · Transports · Secours · Le budget |
| après | à partir du 3 décembre | Le voyage · Le programme · Le budget |

Avant le départ on prépare ; pendant le voyage, téléphone en main, on veut la
journée, ce qu'il y a autour, où manger, comment bouger et les urgences ; après,
c'est un souvenir. Aucune page n'est supprimée, seule la barre bouge. Le
paramètre `?date=2026-11-18` permet de voir chaque moment.

Autour du menu :

- une **loupe** « Chercher » est dans la barre à tous les moments : elle ouvre
  `guide.html?chercher`, curseur dans la recherche. Ce n'est pas une entrée du
  menu ;
- le **pied de page** reprend le menu, plus Le voyage, À faire et Secours : ces
  trois pages restent joignables partout ;
- une page absente du menu du moment allume sa page mère (`PARENT`) :
  `passes.html` et `valises.html` allument Transports ; avant le départ,
  `jour.html` allume Le programme, `table.html` allume Les villes et
  `secours.html` allume À faire ; pendant le voyage, `aujourdhui.html` allume
  Aujourd'hui ;
- pendant le voyage, `index.html` ouvre Aujourd'hui, sauf avec `?accueil` ;
- toutes les pages installent le service worker, depuis `mountChrome` : la
  première page ouverte suffit à l'installer ; le hors-ligne complet se prépare
  avec le bouton de la page À faire (voir plus bas).

Les couleurs de ville s'écrivent `var(--c-tokyo)` et jamais en hexadécimal
dans le JS : c'est ainsi que la palette sombre s'applique aux pastilles, aux
calendriers et aux matrices sans qu'une seule règle ne le sache.

| Page | Ce qu'elle fait |
|---|---|
| `index.html` | l'ouverture, les six étapes (chacune avec ses incontournables, qui mènent à la carte de leur quartier, et ses spécialités à goûter), la ligne, les vols, la carte, la bande des momiji. Avant le départ, en haut, les échéances en retard et celles des 7 prochains jours (6 au plus, rien s'il n'y en a pas) ; pendant le voyage, elle ouvre `jour.html` (sauf avec `?accueil`) |
| `villes.html` | **Les villes** avant le départ, **Autour de moi** pendant le voyage. **Une page par étape** (`?e=1` à `6`), ouverte sur l'étape en cours pendant le voyage. En haut, « Où suis-je ? » : il trouve la position et ouvre le quartier le plus proche (dans une autre ville, il ouvre l'étape de cette ville). Puis le chapeau de l'étape (et, quand il existe, ce qu'on laisse de côté), et **les quartiers** : une carte repliée par quartier, dans l'ordre du programme (à voir / à faire / à manger, une ★ sur les incontournables, les jours où le programme y passe). Puis les fêtes et les illuminations datées, l'hôtel de l'étape en une ligne (avec un lien vers Secours), les plans B (journées type), repliés, et un lien vers toutes les adresses de la ville dans Chercher |
| `table.html` | **À table** : des onglets par ville (`?ville=kyoto` ; pendant le voyage, la ville en cours est ouverte). Vos réservations (les tables de `RESERVER`, avec leur date, leur heure et leur état), les spécialités à goûter (`DELICES`, avec photo et nom japonais), les bonnes tables (les adresses marquées `table`, rangées par quartier : prix, Tabelog, jours de fermeture ; le pourquoi et la façon de réserver sont repliés). Chaque plat a son ancre `#d-<id>` |
| `itineraire.html` | **Le programme** : deux onglets, *Les jours* (25 lignes menant chacune à sa page) et *Journées type* (les 34 plans B, `?onglet=types`) |
| `guide.html` | **Chercher**, la page de la loupe. Une seule recherche pour tout le site : adresses, quartiers, plats, journées, logements, conseils, et les pages Passes, Valises et Secours, retrouvées par mots-clés. Sans accents ni tirets (« todaiji » trouve Tōdai-ji), avec synonymes pour les adresses (ramen, onsen, pluie…). Les résultats sont groupés par type, la ville en cours d'abord, sans s'y limiter. `?chercher` met le curseur dans le champ, `?q=<texte>` le pré-remplit. Sans recherche, le catalogue de 433 adresses : un seul chemin, le même partout, **ville → quartier → à voir / à faire / à manger**, le type de lieu en affinage, les filtres repliés, tri « Près de moi » |
| `jour.html` | **Aujourd'hui** : **une journée à la fois**. En tête, le calendrier pour choisir sa journée, puis la barre **« Ce soir »** : l'hôtel du soir et trois boutons (y aller en transports, montrer l'adresse au chauffeur, en japonais et en grand, appeler — ou « messagerie Booking » quand il n'y a pas de téléphone) ; le 2 décembre, elle devient « Départ ». Puis « À ne pas manquer » (les réservations du jour avec leur heure et leur état, les échéances du jour), le trajet et la décision pour les valises les jours de changement de ville, le parcours (les arrêts dans l'ordre, avec leur heure, tout le parcours en un lien Google Maps), et en dernier la carte et la météo. `?d=14` ou `?date=2026-11-21` |
| `transports.html` | **Transports** : vos trajets entre villes (les cinq segments de `SEGMENTS`, plus le départ pour Haneda ; chacun avec sa décision pour les valises et un lien vers son trajet sur Valises — c'est la seule source des trajets entre villes), vos deux passes, les valises en trois étapes, et le quotidien (Suica, le côté de l'escalator, le taxi) |
| `passes.html` | **Les passes** : le Hakone Freepass (25 → 27 novembre, `#hakone`) et le Nikko Pass World Heritage Area (12 novembre, `#nikko`). « En bref » et « Dans votre programme » restent visibles ; le détail (ce qui est compris, lequel acheter, où l'acheter, comment s'en servir, reconnaître le bon bus) est replié (données : `data/passes.js`) |
| `valises.html` | **les valises, trajet par trajet** : le système en trois étapes, puis pour chaque trajet l'option conseillée, le coût pour deux valises (barème Yamato), où et quand déposer ; au comptoir, les phrases à montrer et le bordereau champ par champ ; ce que chaque logement accepte ; les règles dans les trains, repliées (données : `data/valises.js`) |
| `secours.html` | **la fiche de secours**, dans l'ordre : **Blessé ou malade** (le 119, la hotline touristes, AMDA, deux phrases, et un hôpital qui parle anglais par étape — celui du soir sort du pli), les urgences (les numéros, la hotline touristes, l'ambassade, la conduite à tenir en cas de séisme), les six logements (adresse en japonais, téléphone ou « messagerie Booking », heure d'arrivée, lien vers la carte), les vols (repliés à l'écran, ouverts à l'impression), les phrases à montrer. Une page A4, à imprimer ou à garder en capture d'écran ; à l'écran elle porte le menu, masqué à l'impression. C'est la seule page qui affiche les numéros d'urgence |
| `budget.html` | **Le budget**, en une phrase : ce que coûte le voyage, ce qui est payé, ce qu'il reste, avec une barre en trois couleurs. Puis, dans l'ordre : **Entre vous** (qui doit combien à l'autre, et en une ligne qui a payé quoi) ; **À réserver avant le départ** (les billets et les tables qu'il reste à régler, avec leur date et leur état ; les tables sont repliées sous un seul total) ; **Sur place** (les passes, les trains, et un forfait repas et sorties par jour pour deux) ; **Le détail**, une catégorie par bloc replié. Rien ne se saisit sur le téléphone : qui a payé quoi vit dans les données (`BUDGET.categories[].items[].qui` de `data/trip.js` : `I`, `M` ou `D` pour deux ; un hôtel compte pour payé quand son `paid` est vrai), donc la page est la même chez Ilyès et chez Mathilde. Les forfaits se règlent dans `BUDGET.defaults` |
| `pratique.html` | **une redirection vers `secours.html`** : elle ne sert plus qu'aux anciens favoris. Son contenu est réparti : les logements dans Secours, les trajets dans Transports, l'argent dans Le budget, les conseils dans À faire et Secours, le hors-ligne dans À faire |
| `hotels.html`, `jour-par-jour.html`, `journees.html` | **des redirections**, pour les mêmes raisons : `hotels.html` mène tout droit à `secours.html#logements`, les deux autres à `itineraire.html` |
| `aujourdhui.html` | **À faire** : le compte à rebours et l'échéancier, rangé **par catégorie** (santé et papiers, hébergements, transports, téléphone, billets, à table, valise) ou par échéance, cochable, le détail replié ; puis **le hors-ligne** (le bouton « Préparer le hors-ligne » et l'état du téléchargement) ; puis « À lire avant de partir », les conseils de `SURPLACE` ; puis les billets déjà en poche (payés, à une heure précise), le temps qu'il fait là-bas, et le premier jour (avant le départ). Elle ne renvoie plus à la journée en cours pendant le voyage : elle montre ce qu'il reste à faire |

« Où suis-je ? » se sert du GPS du téléphone : il marche hors-ligne, et rien ne
quitte le téléphone. Le lien « Y aller » de la barre « Ce soir » ne porte que la
destination.

`jour.html?date=2026-11-18` permet de voir n'importe quel jour du voyage sans
attendre novembre.

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
| `data/trip.js` | le voyage, les villes (couleur, fenêtre des momiji), les étapes, les hôtels (adresse en japonais, téléphone, consignes d'arrivée, prélèvement), les trajets, les vols, le budget (une ligne payée dit par qui : `qui`), les billets datés |
| `data/days.js` | les 25 journées (chaque ligne : `text`, `h` l'heure, `evening`, `lieux`) et les 34 journées type |
| `data/lieux.js` | les lieux cités par les journées, géolocalisés |
| `data/spots.js` | les 433 adresses du guide, une par ligne ; les tables portent `table`, `tabelog`, `resa`, `fermeture` ; les événements `du`, `au`, `etape`, `confirme` |
| `data/quartiers.js` | les 56 quartiers, et `OU` : la position des adresses qui ont un lieu fixe `[lat, lng, quartier, confiance, famille]` — confiance `sure`, `approx` ou `quartier` (seul le quartier est sûr : pas de distance affichée) |
| `data/selection.js` | « À ne pas rater », étape par étape, avec le pourquoi |
| `data/delices.js` | les plats à goûter, par ville |
| `data/pratique.js` | les démarches (`AVANT`), le sur-place (`SURPLACE` : chaque conseil a un `id` et une seule page, `place` vaut `secours`, `transports` ou `avant`), les normales de saison, les réservations à faire (`RESERVER` : `type` vaut `table` ou `billet` ; `etat` et `heure` sont facultatifs : sans eux, c'est « à réserver », et une fois fait on note `etat: 'reserve'` et l'heure en `HH:MM`) |
| `data/passes.js` | les deux passes (`PASSES` : Hakone Freepass, Nikko Pass), le chapô, les journées où un pass sert (`PROGRAMME`), les sources relevées (`SOURCES`) |
| `data/valises.js` | les six trajets (`TRAJETS` : décision, options, coût, où et quand déposer), le système d'envoi, le bordereau et ce que chaque logement accepte (`ENVOYER`), les règles des trains (`TRAINS`) |

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
node tools/verify.mjs        # 167 vérifications : totaux, argent, fermetures, notices, structure des pages, hors-ligne, images
node tools/coherence.mjs     # références croisées, heures des journées, quartiers, hôtels, pages et liens
node tools/rapatrier-photos.mjs data/spots.js   # si une fiche a reçu une photo Wikimedia
```

`verify.mjs` est le filet. Ses totaux sont verrouillés : une divergence est une
perte de données, pas un ajustement — sauf ajout volontaire, qu'on reporte
alors dans le compte avec sa raison (c'est ce qui a été fait le 14 octobre
pour les 94 Secrets de Tokyo, les tables et les événements). Il verrouille
notamment les 20 conseils de l'amie guide, les totaux d'argent, la date et
l'heure du billet Nintendo, le fait qu'aucun monument ne soit sans notice, et
l'unicité de chaque information : une journée n'affirme pas l'état d'une
réservation, et les numéros de repli de la fiche de secours (110, 119, la
hotline) sont ceux de `SURPLACE`.

`coherence.mjs` vérifie que les fichiers tenus à la main se tiennent entre eux :
chaque choix de la sélection, chaque réservation et chaque lieu d'une journée
existe ; les heures avancent ; les lignes du soir finissent la journée ; chaque
adresse est rangée dans un quartier de sa ville ; aucune consigne d'hôtel ne
contient de code ; chaque page des menus existe et est dans la coque du service
worker ; aucune ancre ni aucun lien interne ne mène nulle part.

Un site hors-ligne doit avoir ses photos dans `img/` : une photo laissée en
URL Wikimedia disparaît sans bruit dès qu'il n'y a plus de réseau.

## Après chaque changement de CSS, de JS ou de données

Monter le numéro de version dans `sw.js` :

```js
const V = 'vNN';   // un cran de plus à chaque livraison
```

Ce numéro est celui de la coque (voir plus bas) : le monter vide l'ancienne
coque sur chaque téléphone, et la page À faire propose alors de retélécharger
les pages. Sans ça, une copie enregistrée peut rester ancienne (hors-ligne, ou
sur un réseau lent) et personne ne voit la mise à jour. Les photos et les cartes
déjà téléchargées n'en dépendent pas.

## Hors-ligne

Le hors-ligne est une **action explicite** : le bouton « Préparer le
hors-ligne » de la page À faire (`aujourdhui.html`, section `#hors-ligne`), avec
une vraie barre de progression et un décompte. Il met en cache la coque (pages,
modules, données, quartiers) et toutes les photos citées par les données et les
pages, plats compris. Il ne se déclenche pas tout seul à l'installation : une
mise en cache silencieuse s'était déjà déclarée prête alors qu'elle n'avait rien
mis en cache.

Le service worker, lui, s'installe depuis toutes les pages (`mountChrome`, dans
`app/ui.js`). Sans le bouton, il garde déjà ce qu'on ouvre au fil de la
navigation : les pages, les photos, les tuiles de carte. Le bouton met tout, en
une fois.

Le décompte (« Prêt », « Téléchargement incomplet ») compte les **fichiers
attendus réellement présents**, pas les clés des caches : une variante d'adresse
(`jour.html?d=7`) ou une photo qui n'est plus dans les données ne fait pas
croire que tout est là. Sans réseau, ou quand le réseau répond par une erreur
(une page de connexion de wifi d'hôtel, par exemple), la liste des photos
attendues se relit dans les copies enregistrées des pages et des données :
l'état affiché reste juste. Relancer le bouton ne retélécharge pas les photos
déjà là (elles ne changent jamais) : seules les pages se rafraîchissent, et la
relance est bien plus rapide.

Trois caches, dont un seul porte la version :

| Cache | Ce qu'il tient | Servi | Monter `V` |
|---|---|---|---|
| `jp-shell-vNN` | les pages, le CSS, les modules, les données, les polices | réseau d'abord ; la copie enregistrée au bout de 3 s, ou tout de suite sans réseau | le vide |
| `jp-media` | les photos | cache d'abord | n'y touche pas |
| `jp-tiles` | les tuiles de carte, mises en cache quand on regarde la carte | cache d'abord | n'y touche pas |

**Monter `V` ne vide donc plus que la coque.** Les photos et les cartes
téléchargées à l'hôtel survivent aux mises à jour du site, même en plein
voyage. À la première activation d'une nouvelle version, le service worker
recopie le contenu des anciens caches `jp-media-vNN` et `jp-tiles-vNN` dans les
caches stables, puis les supprime : c'est ainsi qu'on passe de l'ancien schéma
à celui-ci sans rien perdre. Cette migration est à l'abri : si une recopie
échoue (disque plein), l'ancien cache reste en place et sera retenté à
l'activation suivante. À part ces anciens caches une fois recopiés, le service
worker ne supprime que ses anciennes coques `jp-shell-*` : jamais le cache d'une
autre application de la même adresse.

**Les cartes se mettent en cache à la consultation.** Le fond de carte (Esri)
est demandé avec `crossOrigin` (`app/map.js`) : sans cela, le navigateur reçoit
des réponses « opaques », que le service worker n'écrit pas, et `jp-tiles` reste
vide. Le bouton « Préparer le hors-ligne » ne télécharge pas les cartes : pour
retrouver une carte sans réseau, il faut l'avoir ouverte en ligne, à ce zoom et
à cet endroit. Esri répond `Access-Control-Allow-Origin: *` ; s'il le retirait,
les tuiles ne s'afficheraient plus du tout.

Dans le métro, le réseau répond parfois au bout de trente secondes. Les pages et
les données ne l'attendent donc pas plus de **3 secondes** : au-delà, la copie
enregistrée s'affiche, et la mise à jour continue derrière, si bien que la
visite suivante est à jour. Sans réseau du tout, la copie s'affiche tout de
suite ; une page jamais visitée retombe sur l'accueil.

Après une mise à jour, la coque repart de zéro : relancer « Préparer le
hors-ligne » la remplit. Les photos, elles, sont toujours là.

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
