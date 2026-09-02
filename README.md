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

| Page | Ce qu'elle fait |
|---|---|
| `index.html` | l'ouverture, les six villes, la ligne, les vols, la carte |
| `itineraire.html` | les 25 jours et les 30 journées type |
| `guide.html` | 319 adresses, filtrables, avec notice historique |
| `pratique.html` | les six hébergements, le budget, les paiements, le hors-ligne |
| `jour.html` | **une journée à la fois** : les arrêts dans l'ordre, situés, sur une carte, et tout le parcours en un lien Google Maps. `?d=14` ou `?date=2026-11-21` |
| `aujourdhui.html` | avant : le compte à rebours et les démarches. Pendant : le jour même |

`aujourdhui.html?date=2026-11-18` permet de voir n'importe quel jour du voyage
sans attendre novembre.

## Les données

Aucune donnée n'est écrite dans le HTML. Tout vit dans `data/*.js`, qui est
**généré** — ne jamais l'éditer à la main, la prochaine extraction écraserait
la correction.

La source de vérité est `legacy/*.html` (le site d'origine) plus les fichiers
de correction de `tools/lib/`. Pour changer un contenu, on modifie le fichier
de `tools/lib/` correspondant :

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

## La chaîne, dans cet ordre

```bash
node tools/extract.mjs        # legacy/ + tools/lib/ → data/*.js
node tools/fetch-images.mjs   # OBLIGATOIRE : réécrit les photos vers img/
node tools/verify.mjs         # 123 assertions
```

**`fetch-images.mjs` n'est pas optionnel.** L'extraction repart des pages
d'origine, où les photos sont encore des URL Wikimedia : elle annule la
relocalisation dans `img/`. Sauter cette étape casse le mode hors-ligne sans
que rien ne le signale — c'est le piège numéro un du dépôt.

`verify.mjs` est le filet. Ses nombres viennent du site d'avant la refonte :
une divergence est une perte de données, pas un ajustement. Il verrouille
notamment les 22 conseils de l'amie guide, les totaux d'argent, la date et
l'heure du billet Nintendo, et le fait qu'aucun monument ne soit sans notice.

## Après chaque changement de CSS, de JS ou de données

Monter le numéro de version dans `sw.js` :

```js
const V = 'v21';
```

Sans ça, le service worker continue de servir l'ancienne version et personne
ne voit la mise à jour. C'est déjà arrivé.

## Hors-ligne

Le hors-ligne est une **action explicite** : un bouton sur `pratique.html`,
avec une vraie barre de progression et un décompte. Il met en cache 38
fichiers de coque et 351 photos. Il ne se déclenche pas tout seul à
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
- **Une carte Leaflet sans vue ne s'affiche pas du tout**, et lire ses bornes
  lève « Set map center and zoom first ». Or `fitBounds` ne peut rien calculer
  tant que le conteneur a une largeur de 0, ce qui arrive quand la carte est
  loin sous la ligne de flottaison. `createMap` pose donc toujours une vue de
  repli sur le Japon, et le cadrage exact se fait quand la taille arrive.
