# Une place par besoin — design

Date : 2026-10-15
Statut : validé en conversation (approche B, puis les deux parties du design) ;
fichier à relire par Ilyès.

## Le problème

Ilyès a coché les trois gênes proposées, plus « fais au mieux » :

- **On ne sait pas où chercher.** La fiche de secours et la page Valises ne
  sont dans aucun menu, ni le budget avant le départ. Les Préparatifs
  disparaissent dès le 8 novembre (`aujourdhui.html:52`), alors que deux
  échéances tombent pendant le voyage (Saikō Shinkan le 14, Rikugi-en le 15).
  Le menu « pendant » a sept entrées, et derrière le ☰ chacune coûte deux
  touches.
- **C'est trop long à lire.** Les couvertures prennent 46 à 78 % de l'écran
  avant la moindre information. La page Tokyo empile 25 quartiers, 12 tables,
  17 plats et 12 journées types. La page Valises fait environ 17 écrans de
  téléphone.
- **Les infos sont éparpillées, et parfois se contredisent :**
  - les spécialités sont affichées à 4 endroits, les numéros d'urgence à 3,
    « près de moi » à 5, les trajets entre villes à 4 ;
  - le 27 novembre, la journée dit shinkansen et la fiche du ryokan dit
    Odakyu ;
  - Sushi Tomohiro est « réservé » sur la journée et « à réserver » dans le
    budget ;
  - une fiche du guide donne un faux prix pour les valises, et aucun jour ne
    prévoit leur retrait à Ikebukuro.

S'y ajoute un risque : chaque mise à jour du site efface les photos et les
cartes téléchargées pour le hors-ligne (`sw.js`, caches nommés avec la
version).

## Ce qu'on construit

Le même site statique, réorganisé pour qu'**à chaque besoin corresponde une
seule page, à deux touches au plus** de l'ouverture, avec des pages courtes et
une seule version de chaque information.

### Contraintes

- **Les contraintes du site ne changent pas :**
  - pas de build ;
  - hors-ligne d'abord ;
  - le téléphone est le cas nominal (iPhone, 375 px) ;
  - thème clair et thème sombre.
- `data/*.js` est tenu à la main. Ne jamais lancer `tools/extract.mjs` ni
  `tools/fetch-images.mjs`.
- **Le site est public :** jamais de numéro de réservation, de code de porte ou
  de boîte à clés, de lien de pré-enregistrement ni d'e-mail.
- `node tools/verify.mjs` et `node tools/coherence.mjs` restent verts.
- Départ le 8 novembre. La refonte doit être en ligne assez tôt pour
  qu'Ilyès et Mathilde relancent le hors-ligne et le testent sur leurs deux
  iPhone.

### Critères de réussite

| Besoin | Chemin cible |
|---|---|
| Ce qu'il reste à faire | Avant : menu › À faire. Pendant : les échéances du jour sont en haut d'Aujourd'hui. |
| Ce qu'on fait aujourd'hui | Pendant : l'ouverture du site (0 touche). |
| Rentrer à l'hôtel, le montrer au chauffeur, l'appeler | Aujourd'hui › barre « Ce soir » (1 touche). |
| Ce qu'il y a autour de moi | Menu › Autour de moi › « Où suis-je ? ». |
| Où manger, quoi goûter | Menu › À table. |
| Passes, valises, trajets entre villes | Menu › Transports. |
| Urgences, adresses des logements | Menu › Secours. |
| Retrouver n'importe quoi | 🔍 dans la barre. |
| Le budget | Menu › Le budget, avant comme pendant. |

**Hauteurs cibles à 375 px, détails repliés :**
- Passes : 5 000 px au plus ;
- Valises : 6 000 px au plus ;
- Transports : 3 500 px au plus ;
- Secours : 4 000 px au plus ;
- À table et Autour de moi (Tokyo, le cas le plus chargé) : 6 000 px au plus ;
- Aujourd'hui : la barre « Ce soir » et la première réservation du jour sont
  visibles sans défiler.

## La navigation

**Les moments**, dans `app/ui.js` (`moment()`) :
- « avant » va jusqu'au 8 novembre inclus, le jour du vol, où l'on veut encore
  la liste ;
- « pendant » va du 9 novembre au 2 décembre ;
- « après » commence le 3 décembre.
- Ces bornes vivent dans les données : `TRIP.japon = { du: '2026-11-09', au:
  '2026-12-02' }`. Le compte à rebours garde `TRIP.start`.

**Les menus** (`PAGES_PAR_MOMENT`) :
- **Avant :** À faire (`aujourdhui.html`) · Le programme (`itineraire.html`) ·
  Les villes (`villes.html`) · Transports (`transports.html`) · Le budget
  (`budget.html`).
- **Pendant :** Aujourd'hui (`jour.html`) · Autour de moi (`villes.html`) ·
  À table (`table.html`) · Transports (`transports.html`) · Secours
  (`secours.html`) · Le budget (`budget.html`).
- **Après :** Le voyage · Le programme · Le budget.

**Autour des menus :**
- Une loupe 🔍 « Chercher », dans la barre et à tous les moments, ouvre
  `guide.html` avec le champ de recherche actif. C'est un bouton, pas une entrée
  du menu.
- Le pied de page reprend le menu, plus Le voyage, À faire et Secours, pour que
  ces pages restent toujours joignables.
- Les pages de détail allument leur parent : `passes.html` et `valises.html`
  allument Transports ; `jour.html` allume Le programme avant le départ.
- **Le bouton « Perdu ? » disparaît**, avec sa boîte de dialogue. Ce qu'il
  avait d'utile vit dans la barre « Ce soir » et dans « Où suis-je ? ».
- **L'accueil** (`index.html`) :
  - avant le départ, il montre les 3 prochaines échéances en haut, puis le
    voyage ;
  - pendant, il ouvre toujours Aujourd'hui (sauf avec `?accueil`) ;
  - le logo « Japon 2026 » y mène.

## Les pages

### Aujourd'hui — `jour.html`

De haut en bas :
1. **Le choix du jour.**
2. **La barre « Ce soir » :**
   - l'hôtel du soir, avec trois boutons : y aller (itinéraire en transports),
     montrer au chauffeur (l'adresse en japonais en grand), appeler ;
   - sans téléphone, elle affiche « pas de téléphone : messagerie Booking » ;
   - le jour d'arrivée dans un logement, elle déplie les consignes d'arrivée ;
   - le 2 décembre, elle devient « Départ » : le vol de 20:15, Haneda T3.
3. **À ne pas manquer :** les réservations du jour, avec leur heure et leur
   état, et les échéances qui tombent ce jour-là.
4. **Les jours de changement de ville :** le trajet et la décision pour les
   valises, avec un lien vers le trajet sur la page Valises.
5. **Le parcours.**
6. **La carte et la météo**, en dernier.

**Ce qui part :** « Près de moi » et « Dans le coin » ; ils vivent dans Autour
de moi, et la page y renvoie.

### Autour de moi / Les villes — `villes.html`

Une seule page. Son libellé suit le moment : « Les villes » avant le départ,
« Autour de moi » pendant le voyage. Pendant le voyage, elle s'ouvre sur l'étape
en cours.

De haut en bas :
1. **Les étapes**, en onglets.
2. **Le bouton « Où suis-je ? » :** il trouve la position et ouvre la fiche du
   quartier le plus proche. Sans géolocalisation, il ne montre rien de plus.
3. **Les quartiers**, en cartes repliées : à voir, à faire, à manger, avec les
   incontournables marqués d'une étoile.
4. **Les fêtes et les illuminations** datées.
5. **L'hôtel de l'étape**, en une ligne, avec un lien vers Secours.
6. **Les plans B** (les journées types), repliés.

**Ce qui part :**
- « Près de moi » (remplacé par « Où suis-je ? ») ;
- la liste « À ne pas rater » (les étoiles la remplacent) ;
- « À table » (va dans `table.html`) ;
- « Vos jours » (le programme et le calendrier d'Aujourd'hui le font déjà).

### À table — `table.html` (nouvelle)

Des onglets par ville ; pendant le voyage, la ville en cours est ouverte. De haut
en bas :
1. **Vos réservations :** les entrées de `RESERVER` qui sont des tables, avec
   leur date, leur heure et leur état.
2. **Les spécialités à goûter :** `DELICES`, avec photo, nom japonais et une
   ligne de description.
3. **Les bonnes tables :** les adresses de `SPOTS` marquées `table`, avec prix,
   Tabelog, comment réserver, jours de fermeture et nom japonais.

**Ce qu'elle remplace :** les spécialités affichées sur l'accueil
(`index.html:180-184`, dont le lien cassé `#gouter`), dans l'onglet « À manger »
du programme, dans la section « À table » des villes et dans la « Sélection »
masquée du guide. Ces quatre endroits renvoient désormais ici.

### Transports — `transports.html` (nouvelle)

1. **Vos trajets entre villes :** les 5 segments de `SEGMENTS` (train, durée,
   prix), plus le départ vers Haneda le 2 décembre. Chacun a la décision pour
   les valises tirée de `data/valises.js`, et un lien vers son trajet sur la page
   Valises. C'est la seule source des
   trajets entre villes : la ligne de l'accueil et les journées la lisent, la
   rubrique « Y aller » de Pratique disparaît.
2. **Vos passes :** deux cartes, qui mènent à `passes.html`.
3. **Les valises :** le système en trois étapes, qui mène à `valises.html`.
4. **Au quotidien :** Suica dans le Wallet, le côté de l'escalator, montrer
   l'adresse au chauffeur de taxi (lien vers Secours).

**Passes** (`passes.html`, déjà construite) : ne restent visibles que « En
bref » et « Dans votre programme ». Le détail de chaque pass est replié, pour
tenir la cible de 5 000 px.

**Valises** (`valises.html`, en cours de refonte) : le système en trois étapes,
le plan trajet par trajet replié, le comptoir avec les phrases en japonais, et
ce que chaque logement accepte.

### Secours — `secours.html`

La fiche reste imprimable en A4, et se lit aussi sur le téléphone, avec le menu
à l'écran, masqué à l'impression. De haut en bas :
1. **Les urgences :** les numéros, l'ambassade, la ligne d'assistance, la
   conduite à tenir en cas de séisme.
2. **Vos 6 logements :** l'adresse en japonais, le téléphone ou « messagerie
   Booking », l'heure d'arrivée, un lien vers la carte.
3. **Les vols.**
4. **Les phrases à montrer.**

C'est la seule page qui affiche les numéros d'urgence. La barre « Ce soir »
n'appelle que l'hôtel.

### À faire — `aujourdhui.html`

1. **Les démarches et les réservations**, par catégorie et par échéance, comme
   aujourd'hui.
2. **Le hors-ligne :** le bouton et l'état du téléchargement, qui viennent de
   Pratique.
3. **« À lire avant de partir » :** les conseils de `SURPLACE`, sauf les
   urgences et le séisme (qui vont dans Secours) et les valises (qui vont dans
   Transports).

**Ce qui change :** la redirection vers `jour.html` pendant le voyage
disparaît. La page reste joignable par le pied de page et par Aujourd'hui, et
montre ce qu'il reste à faire.

### Chercher — `guide.html`

- **Une seule recherche** couvre :
  - les adresses et leurs quartiers ;
  - les plats ;
  - les lignes des journées ;
  - les logements ;
  - les conseils ;
  - les pages Passes, Valises et Secours, retrouvées par mots-clés ;
- **les résultats sont groupés par type**, avec la ville en cours en premier ;
  ils ne sont plus limités à cette ville. À Kyoto, « Tōdai-ji » trouve donc
  Nara ;
- **sans recherche**, le catalogue par ville reste consultable, et ses filtres
  sont repliés.

### Le programme, le budget, l'accueil

- **Le programme :** l'onglet « À manger » part dans À table, et le code mort
  disparaît.
- **Le budget :** refait, voir la section suivante (ajoutée le 15 octobre, à la
  demande d'Ilyès : « la page budget n'est pas hyper claire »).
- **L'accueil :** voir la navigation ci-dessus. La section « L'argent », qui
  était masquée, disparaît.

### Le budget — `budget.html` (refait)

Validé par Ilyès sur une maquette, le 15 octobre. De haut en bas :

1. **Une phrase :** « Le voyage coûte 8 206 € pour deux (4 103 € chacun). Déjà
   payé : 5 197 € · Reste : 3 009 €. » Dessous, une seule barre en trois
   couleurs : payé, avant le départ, sur place.
2. **Entre vous, une phrase :** « Vous êtes à égalité », ou « Mathilde doit
   19 € à Ilyès ».
3. **Avant le départ (à réserver) :** les billets et les tables qui ne sont pas
   encore réglés, avec leur date et leur état (tiré de `RESERVER`).
4. **Sur place :** les passes, les trains, et le forfait repas et sorties, en
   euros par jour pour deux (environ 66 €).
5. **Le détail par catégorie**, replié.

**Qui a payé quoi** vit dans les données : le champ `qui` de chaque ligne du
`BUDGET` vaut `'I'`, `'M'` ou `'D'` (à deux). C'est donc la même chose sur les
deux téléphones. Les boutons I / M / ½ et les payeurs gardés sur le téléphone
disparaissent. Quand quelqu'un paie, Ilyès le dit, et la donnée est mise à jour.

**Les faits connus au 15 octobre :**
- les vols (1 900 €) sont payés moitié-moitié ;
- le Nintendo Museum (38 €) a été payé par Ilyès ;
- les six hôtels sont payés à deux.

### Pratique — `pratique.html`

Elle devient une page de redirection vers `secours.html`, comme `hotels.html`,
et son contenu est réparti :
- les logements vont dans Secours (plus la barre « Ce soir » et la ligne
  d'hôtel des villes) ;
- les trajets vont dans Transports ;
- l'argent va dans Le budget ;
- les conseils vont dans À faire et dans Secours ;
- le hors-ligne va dans À faire.

### Les couvertures

`.cover--short` ne dépasse plus 30 % de la hauteur d'un écran de téléphone.
L'accueil garde sa grande photo.

## Les données

1. **`TRIP.japon`**, qui donne les bornes du séjour (voir la navigation).
2. **L'état des réservations :**
   - chaque entrée de `RESERVER` reçoit `etat: 'a-reserver' | 'reserve'` (par
     défaut « à réserver »), puis une heure une fois réservée ;
   - aucune réservation n'a été signalée à ce jour, donc tout est « à
     réserver » ;
   - le texte des journées n'affirme plus jamais un état (« réservé » sort de
     `days.js`) : la journée affiche la carte de la réservation ;
   - `RESERVATIONS` (les billets payés, Nintendo) ne change pas.
3. **Le 27 novembre :** un seul trajet, bus jusqu'à Odawara (Freepass),
   shinkansen jusqu'à Tokyo (35 min), puis métro jusqu'à Kanamecho, environ
   20 € par personne. On corrige `SEGMENTS`, la fiche du ryokan et le trajet 5
   de `data/valises.js`.
4. **Les valises du 27 et du 28, au conditionnel :**
   - le 27 : « si les valises partent au centre Yamato, gardez un petit sac pour
     la nuit » ;
   - le 28 : « retirer les valises au centre Yamato d'Ikebukuro-Ekimae
     (passeport et double du bordereau) ».
5. **Les fausses adresses :**
   - on retire `spot-faire-suivre-les-valises` ;
   - on retire aussi les plats rangés comme des adresses. Une fausse adresse a
     pour nom un plat ou un produit générique (nodoguro, obanzai, yudōfu,
     monjayaki…), et son lien Maps n'est qu'une recherche, sans boutique
     précise. Restent les vrais commerces (Butaman 551 Horai, Nakatanidō…), les
     marchés et ce qui se passe au ryokan ;
   - chaque plat retiré doit exister dans `DELICES` ; sinon, on l'y ajoute ;
   - on met à jour les références (`quartiers.js`, `selection.js`) et les
     totaux de `verify.mjs`.
6. **Le 2 décembre :** « Départ » remplace « Ce soir ».
7. **Les logements sans téléphone :** l'interface affiche « messagerie
   Booking ». On n'invente aucun numéro.

## Le hors-ligne — `sw.js`

- **Seule la coque est versionnée** (`jp-shell-${V}`). Les photos et les tuiles
  vont dans des caches stables (`jp-media`, `jp-tiles`), qu'une mise à jour
  n'efface plus.
- **À la première activation**, le contenu des anciens caches versionnés est
  recopié dans les caches stables. Si ce n'est pas faisable simplement, on
  relance le téléchargement une fois.
- **Pages et données sans réseau :** au bout de 3 secondes, la page s'affiche
  depuis la version enregistrée, et la mise à jour continue en arrière-plan.
- **Ce que met en cache `PAGES` :**
  - on ajoute `table.html`, `transports.html`, `passes.html` et
    `data/passes.js` ;
  - `pratique.html` reste listée, pour que sa redirection marche hors-ligne.
- Le README décrit la nouvelle règle.

## Le ménage

- **Le code mort relevé par l'audit :**
  - `aujourdhui.html:320-457` et `511-545` ;
  - la « Sélection » masquée de `guide.html:571-615` ;
  - « L'argent » masqué de `index.html` ;
  - les restes de `itineraire.html` ;
  - « Autour de l'hôtel » et `autoPres` dans `app/quartiers.js` ;
  - la couverture vide de Pratique.
- **Le code de « Perdu ? ».** On ne garde que ce que la barre « Ce soir » et
  « Où suis-je ? » réutilisent, par exemple « montrer au chauffeur ».
- **On garde** `hotels.html`, `jour-par-jour.html` et `journees.html`. Ce sont
  des redirections de quelques lignes, utiles pour les anciens favoris.

## Les vérifications et la livraison

**`verify.mjs` et `coherence.mjs` vérifient en plus :**
- chaque page de chaque menu existe et figure dans `PAGES` du service worker ;
- aucun lien interne ne vise une ancre absente ;
- aucune ligne de journée n'affirme un état de réservation ;
- un même segment n'a qu'un seul trajet.

**Les autres contrôles :**
- **Revue visuelle** de chaque page à 375 px, en clair et en sombre.
- **Six dates simulées** (`?date=`) :
  - le 15 octobre ;
  - le 8 novembre, le jour du vol ;
  - le 9 novembre, l'arrivée ;
  - le 14 novembre, une échéance pendant le voyage ;
  - le 25 novembre, Hakone ;
  - le 2 décembre, le départ.
- **Des sous-agents en mode persona**, par exemple :
  - « perdu à Gion le soir » ;
  - « où manger à Kanazawa » ;
  - « mon pass couvre ce bus ? » ;
  - « je dois envoyer mes valises » ;
  - « urgence » ;
  - « qu'est-ce qu'il reste à réserver ».
- **Le service worker :** on vérifie qu'une montée de version garde les photos.

**La livraison :**
- commit au nom d'Ilyès seul ;
- push seulement après son ok ;
- puis on vérifie le site publié.

## Hors périmètre

- Les onglets en bas d'écran et l'agenda unique (l'approche C).
- Un signal de rythme par journée.
- La synchronisation des cases cochées entre les deux téléphones : l'état des
  réservations, lui, vit dans les données.
- Le dossier `legacy/`, et la suppression des redirections.
- Toute nouvelle recherche de contenu, hormis les faits que ces corrections
  exigent.
