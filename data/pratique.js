// Informations pratiques — tenues à la main, pas extraites.
//
// Deux blocs : ce qu'il faut faire AVANT de partir (avec les liens et les
// échéances), et ce qu'il faut savoir SUR PLACE. Le second sert le téléphone
// à la main dans la rue, donc il reste court et factuel.
//
// `check: true` marque ce qui doit être revérifié : soit parce que la règle
// change en 2026, soit parce que mes informations s'arrêtent à mai 2026.

export const AVANT = Object.freeze([
  {
    id: 'vjw',
    deadline: '2026-11-05',
    title: 'Visit Japan Web',
    what: "Pré-enregistrement immigration et douane. On remplit en ligne, on obtient deux QR codes à présenter à l'arrivée — ça évite les formulaires papier et la file.",
    when: 'Dans les jours avant le départ',
    url: 'https://services.digital.go.jp/en/visit-japan-web/',
    tag: 'Obligatoire en pratique',
  },
  {
    id: 'esim',
    deadline: '2026-11-01',
    title: 'eSIM',
    what: "À commander avant de partir et à activer une fois posés à Haneda. Compter 10–25 € pour 20 jours de data. Le wifi des konbini dépanne, mais pas pour naviguer.",
    when: 'Une semaine avant',
    tag: null,
  },
  {
    id: 'suica',
    deadline: '2026-11-06',
    title: 'Suica dans le Wallet',
    what: "Sur iPhone, la Suica s'ajoute directement dans Wallet et se recharge à la carte bancaire — pas besoin de passer par un guichet. Elle sert au métro, aux trains locaux, aux konbini et aux casiers de gare.",
    when: 'Avant de partir',
    tag: null,
  },
  {
    id: 'cartes',
    deadline: '2026-11-06',
    title: 'Cartes hors-ligne',
    what: "Télécharger les zones Tokyo, Kyoto, Osaka, Kanazawa et Hakone dans Google Maps. Le site aussi fonctionne hors-ligne — le bouton « Préparer le hors-ligne » est plus bas sur cette page.",
    when: 'Avant de partir',
    tag: null,
  },
  {
    id: 'pass',
    deadline: '2026-11-01',
    canal: 'en ligne',
    url: 'https://www.hakonenavi.jp/international/en/discount_passes/free_pass',
    commentReserver: "Les places de l'express Tobu du 12 nov. sont déjà en vente : elles ouvrent un mois avant, sur Tobuchike (トブチケ). HAKONE FREEPASS « depuis Odawara », 3 jours (25 → 27 nov.), 6 400 ¥ par adulte : en ligne sur EMot Online Tickets (en vente un mois avant ; billet sur le téléphone), ou au guichet Odakyu de la gare d'Odawara en arrivant le 25. NIKKO PASS WORLD HERITAGE AREA, 2 jours, 3 000 ¥ par adulte, réservé aux voyageurs étrangers : sur le site de Tobu, billet numérique ou bon papier à retirer à Asakusa. Le détail, les bus compris et le mode d'emploi : page Les passes.",
    title: 'Hakone Freepass et Nikko Pass',
    what: "Le Freepass de Hakone (3 jours depuis Odawara) couvre les transports de Hakone du 25 au 27 : bus, train de montagne, funiculaire, téléphérique, bateau pirate. Le Nikko Pass couvre le train Tokyo ↔ Nikko (supplément express en plus) et les bus des sanctuaires, pas celui du lac Chuzenji. Pas de JR Pass : sur cet itinéraire, les billets à l'unité reviennent moins cher.",
    page: 'passes.html',
    pageLabel: 'Les passes',
    when: 'Avant de partir, ou sur place',
    tag: null,
  },
  {
    id: 'medicaments',
    deadline: '2026-10-30',
    title: 'Médicaments : la douane est stricte',
    what: "Le Japon interdit à l'importation la pseudoéphédrine (beaucoup de traitements du rhume) et la codéine. Au-delà d'un mois de traitement, ou pour tout produit sensible, il faut un certificat « Yakkan Shoumei », à demander en ligne sur le portail du ministère, au moins une à deux semaines avant. Vérifier chaque boîte de la trousse.",
    when: 'Fin octobre au plus tard',
    url: 'https://impconf.mhlw.go.jp/',
    tel: '+81-48-740-0800',
    commentReserver: "Demande en ligne sur le portail impconf.mhlw.go.jp (la voie par défaut depuis juillet 2025), bureau Kanto-Shinetsu pour une arrivée à Haneda. Téléphone : lun.–ven., 10:00 – 12:00 et 13:00 – 16:00 heure du Japon. Compter une à deux semaines.",
    hard: true,
    tag: 'Refoulé à la douane sinon',
  },
  {
    id: 'assurance',
    deadline: '2026-10-25',
    title: 'Assurance santé',
    what: "La carte européenne ne vaut rien au Japon : les soins sont payés d'avance, et une hospitalisation chiffre vite. Vérifier ce que couvre la carte bancaire — beaucoup de cartes premium incluent une couverture voyage, mais souvent limitée aux 90 premiers jours et sous conditions.",
    when: 'Avant de partir',
    tag: null,
  },
  {
    id: 'precheckin-osaka',
    deadline: '2026-11-06',
    title: 'Pré-enregistrement de l’appartement d’Osaka',
    what: "Obligatoire pour vous deux, avec le passeport : sans lui, la porte ne s'ouvre pas. Le lien est dans la messagerie Booking de 川HOUSE黒門 (message du 17 août). Les autres hébergements envoient leur enregistrement en ligne quelques jours avant ou le jour même — surveiller la messagerie Booking.",
    when: 'Dès maintenant',
    url: 'https://secure.booking.com/inbox.fr.html',
    hard: true,
    tag: 'Pas d’accès sinon',
  },
  {
    id: 'fiche-secours',
    cat: 'papiers',
    deadline: '2026-11-07',
    title: 'Imprimer la fiche de secours',
    what: "Une page avec les six adresses en japonais, les téléphones, les vols, les urgences et les phrases à montrer. Une copie papier dans le portefeuille de chacun, et une capture d'écran dans les photos : elle sert même téléphone éteint.",
    when: 'La veille du départ',
    url: 'secours.html',
    tag: null,
  },
  {
    id: 'prise',
    deadline: '2026-11-07',
    title: 'Adaptateur type A',
    what: "Prises à deux lames plates, 100 V. La plupart des chargeurs récents encaissent le 100 V sans transformateur — vérifier la mention « 100–240 V » sur le bloc.",
    when: 'Dans la valise',
    tag: null,
  },
  {"id":"shinkansen-kanazawa","deadline":"2026-11-07","title":"Sièges shinkansen Tokyo → Kanazawa (sam 14 nov)","what":"Le Kagayaki du samedi 14 novembre n'a que des places réservées, et le Hokuriku shinkansen se remplit le week-end. La vente ouvre un mois avant sur Eki-Net (le 14 octobre pour le 14 novembre) : réserver avant de partir, billets à retirer à la gare de Tokyo. Prévenir Center Point si l'arrivée à Kanazawa passe 19h.","when":"Avant de partir — la vente est ouverte","tag":null,"commentReserver":""},
]);

// Chaque conseil a un identifiant, et UNE seule page, `place` : 'secours'
// (la fiche de secours), 'transports', ou 'avant' (« À lire avant de partir »,
// sur la page À faire).
export const SURPLACE = Object.freeze([
  // En tête : c'est ce qu'on cherche quand ça va mal. `tels` devient des
  // boutons d'appel, pour ne rien avoir à recopier.
  {
    id: 'urgences',
    place: 'secours',
    title: 'Urgences',
    what: "110 et 119 sont gratuits, depuis n'importe quel téléphone. La hotline touristes (050) est un numéro normal, payant : elle répond 24h/24 en anglais (santé, vol, galère administrative).",
    tels: [
      { label: 'Police', n: '110' },
      { label: 'Pompiers, ambulance', n: '119' },
      { label: 'Hotline touristes', n: '050-3816-2787' },
    ],
  },
  {
    id: 'detaxe',
    place: 'avant',
    title: 'Détaxe : tout change le 1er novembre',
    what: "On paie désormais le prix TTC en magasin (10 % de plus qu'avant), et on se fait rembourser à l'aéroport avant le vol. Passeport sur soi, seuil inchangé : 5 000 ¥ par magasin et par jour.",
    warn: "Le voyage entier tombe sous le nouveau régime. Concrètement : garder les tickets ET les articles achetés — ils peuvent être contrôlés au comptoir de remboursement de Haneda le 2 décembre. Prévoir de la marge avant l'enregistrement du vol de 20:15.",
  },
  {
    id: 'poubelles',
    place: 'avant',
    title: 'Pas de poubelles',
    what: "Presque aucune poubelle dans la rue. On garde ses déchets sur soi jusqu'à un konbini ou l'hôtel.",
  },
  {
    id: 'pourboire',
    place: 'avant',
    title: 'Pas de pourboire',
    what: "Jamais, nulle part. Laisser de la monnaie met mal à l'aise.",
  },
  {
    id: 'valises',
    place: 'transports',
    title: 'Faire suivre les valises',
    what: "Le takkyubin (宅急便) fait suivre les deux valises d'un logement au suivant, livrées le lendemain — précieux quand un appartement n'ouvre que l'après-midi. Mais deux logements ne reçoivent aucun colis (Matatabi à Kyoto, La Vita à Tokyo), Hakone a sa propre consigne, et les courtes étapes se font plus simplement valises en main. Chaque changement de ville a ses règles, son option conseillée et son coût.",
    page: 'valises.html',
    pageLabel: 'Les valises, trajet par trajet',
  },
  {
    id: 'especes',
    place: 'avant',
    title: 'Espèces',
    what: "Le Japon reste très liquide : petits restaurants, temples, marchés. Les distributeurs des 7-Eleven et de la Japan Post acceptent les cartes étrangères, 24h/24. Prévoir du liquide dès l'aéroport.",
  },
  {
    id: 'taxe-sejour',
    place: 'avant',
    title: 'Taxe de séjour',
    what: "Plusieurs villes prélèvent quelques centaines de yens par personne et par nuit, réglés à l'hôtel, souvent en espèces. Kyoto est la plus chère. Ce n'est pas compris dans les prix affichés ici.",
  },
  {
    id: 'seisme',
    place: 'secours',
    title: 'Tremblement de terre',
    what: "S'il secoue : on s'éloigne des fenêtres, on se met sous une table, on ne sort pas en courant. Les secousses faibles sont banales et les bâtiments sont conçus pour. Le téléphone sonne quelques secondes avant (alerte nationale) — le bruit est impressionnant, c'est normal.",
  },
  {
    id: 'onsen-tatouages',
    place: 'avant',
    title: 'Onsen et tatouages',
    what: "On se lave assis, entièrement, AVANT d'entrer dans le bain ; la serviette ne touche jamais l'eau. Beaucoup de bains publics refusent encore les tatouages — le bain privé du ryokan règle la question.",
  },
  {
    id: 'escalator',
    place: 'transports',
    title: 'L\'escalator change de côté',
    what: "On se tient à gauche à Tokyo, à droite à Osaka. Ça a l'air anecdotique jusqu'au moment où on bloque une file de trente personnes.",
  },
  {
    id: 'couches',
    place: 'avant',
    title: 'S’habiller par couches',
    what: "Le vrai enjeu de novembre n'est pas le froid mais l'écart : les trains, les magasins et les restaurants surchauffent, et on ressort dans 8 °C. Trois couches qu'on enlève et remet valent mieux qu'un gros manteau. Pour Ōwakudani (1 040 m, en téléphérique), ajouter coupe-vent et gants. Prévision à un mois de l'agence météo japonaise (15 oct. 2026, jusqu'au 16 nov.) : plus doux que la normale, et plus de pluie que d'habitude de Tokyo à Kyoto — un parapluie pliant chacun, et des chaussures qui supportent l'eau.",
  },
  {
    id: 'nuit',
    place: 'avant',
    title: 'La nuit tombe tôt',
    what: "Coucher de soleil vers 16h35 à Tokyo à la mi-novembre, 16h30 début décembre. Les temples ferment souvent à 16h30 ou 17h. Commencer tôt.",
  },
]);

// Normales de saison, en °C. Sert à savoir quoi mettre dans la valise,
// pas à prévoir le temps qu'il fera. Revu le 19 oct. 2026 : la prévision à un mois de l'agence
// météo japonaise (15 oct.) annonce un automne plus doux et plus pluvieux que la normale
// (Kanto à Kinki) ; les normales restent le plancher, le conseil est dans « couches ».
export const METEO = Object.freeze({
  tokyo:    { max: 17, min: 9,  note: 'doux en journée, frais le soir' },
  kanazawa: { max: 15, min: 8,  note: 'la côte de la mer du Japon : prévoir la pluie' },
  kyoto:    { max: 17, min: 7,  note: 'bassin fermé, matins froids' },
  osaka:    { max: 18, min: 9,  note: 'la plus douce des cinq' },
  hakone:   { max: 12, min: 4,  note: 'lac Ashi à 720 m, Ōwakudani à 1 040 m : les nuits frôlent le 0' },
});

// À réserver, et AVANT QUAND. Le site marquait « résa conseillée » un peu
// partout sans jamais dire à quelle échéance — ce qui revient à ne rien dire.
// Ces dates viennent soit d'une contrainte dure (une annulation gratuite qui
// expire, un délai administratif), soit d'un ordre de grandeur assumé pour le
// pic des momiji, la période la plus tendue de l'année au Japon.
//
// `hard: true` = la date est une vraie limite, pas un conseil.
// `spotId` / `hotelId` rattachent l'entrée à sa fiche : la photo, la
// description et le lieu en viennent, plutôt que d'être recopiés ici.
// `type` dit ce que c'est : 'table' (un repas) ou 'billet' (une entrée).
// `etat` vaut 'a-reserver' (le défaut, quand le champ manque) ou 'reserve' ;
// une réservation faite porte aussi son `heure` ('HH:MM'). L'état vit ici, dans
// les données, pour être le même sur les deux téléphones — contrairement à la
// case cochée de la page À faire, qui reste propre à chaque téléphone.
//
// Le dîner kaiseki du ryokan de Hakone a été retiré de cette liste : il est
// confirmé auprès du ryokan (18:30 les deux soirs). Ce qui est fait ne doit
// pas rester dans une liste de choses à faire, sinon la liste ne se lit plus.

export const RESERVER = Object.freeze([
  {
    id: 'shibuya-sky',
    type: 'billet',
    canal: 'en ligne',
    url: 'https://www.shibuya-scramble-square.com/sky/en/ticket/',
    commentReserver: "Sur Klook (dès 16,85 €) ou la billetterie officielle, date et créneau horodatés, nom du passeport sur le billet (contrôles au hasard). La vente ouvre deux semaines avant, à minuit heure du Japon : pour le 11 novembre, le mardi 27 octobre à 16:00 heure de Paris. Viser 15:40 ou 16:00 (coucher vers 16:35) ; les créneaux du couchant partent en quelques minutes — être connecté avant 16:00. Sinon 17:00–17:20 : la ville qui s'allume vaut le couchant. Revérifié le 19 octobre 2026.",
    check: true,
    spotId: 'spot-shibuya-sky',
    title: 'Shibuya Sky, créneau coucher de soleil',
    what: "Les créneaux du couchant partent des semaines à l'avance, et c'est la tranche la plus chère. Coucher de soleil vers 16h35 à la mi-novembre.",
    deadline: '2026-10-28',
    forDate: '2026-11-11',
  },
  {
    id: 'hakone-freepass',
    type: 'billet',
    canal: 'en ligne',
    url: 'https://www.klook.com/activity/821-hakone-transport-day-pass-tokyo/',
    commentReserver: "Sur Klook : « Hakone », 3 jours, e-ticket (un billet par téléphone), 2 adultes, à partir du 25 novembre — environ 42,80 € par personne (le pass au départ de Shinjuku, le seul que vend Klook). La vente n'ouvre qu'un mois avant : le 25 novembre apparaît vers le 25 octobre. Sinon, au guichet Odakyu de la gare d'Odawara en arrivant le 25 (6 400 ¥ par personne, au départ d'Odawara).",
    title: 'Hakone Freepass, 3 jours dès le 25 nov',
    what: "Trains, bus, bateau et téléphérique de Hakone pendant les trois jours. Rien ne presse : il ne se vend jamais en rupture, seule la date d'ouverture de la vente compte.",
    deadline: '2026-10-25',
    forDate: '2026-11-25',
  },
  {
    id: 'teamlab',
    type: 'billet',
    canal: 'en ligne',
    url: 'https://teamlabplanets.dmm.com/en/ticket',
    commentReserver: "Billetterie officielle (boutique DMM), billet horodaté obligatoire, 3 600 à 3 800 ¥ selon la date (tarif variable). Ouvert jusqu'à fin 2027. Les dates sortent trois à quatre semaines avant : le 13 novembre doit apparaître au calendrier ces jours-ci. Réserver dès qu'il y est. Revérifié le 14 octobre 2026.",
    check: true,
    spotId: 'spot-teamlab-planets',
    title: 'teamLab Planets, Toyosu',
    what: "Entrée par créneau horaire, aucun guichet sur place : sans billet, on ne rentre pas. Créneau de 17:30, après le coucher du soleil à Yanaka.",
    deadline: '2026-10-20',
    forDate: '2026-11-13',
    etat: 'reserve',
    heure: '17:30',
  },
  {
    id: 'rikugien',
    type: 'billet',
    canal: 'en ligne',
    url: 'https://www.tokyo-park.or.jp/event_search/special_nighttime_viewing_in_autumn.html',
    commentReserver: "Illumination 2026 confirmée du 25 novembre au 6 décembre, 18:00 – 20:30, dernière entrée 19:30 (annonce du 3 septembre). En ligne via Asoview, 1 000 ¥, au plus tard la veille ; au guichet 1 200 ¥. La vente en ligne ouvre habituellement fin octobre. La page officielle montre encore l'édition 2024 : ne pas s'y fier pour les dates.",
    check: true,
    spotId: 'spot-rikugi-en',
    title: 'Illumination de Rikugi-en',
    what: "Le jardin ferme à 17h puis rouvre pour l'illumination, du 25 novembre au 6 décembre, avec un billet séparé — moins cher en ligne.",
    deadline: '2026-11-15',
    forDate: '2026-12-01',
    check: true,
  },
  {"id":"the-sky","type":"table","canal":"en ligne","url":"https://www.tablecheck.com/en/shops/newotani-tokyo-restaurant-sky/reserve","commentReserver":"Réservé sur TableCheck : buffet du soir en semaine, tarif web (14 500 ¥ par personne, plus 15 % de service), côté fenêtre. Annulation après 17h la veille facturée à 100 %.","spotId":"spot-view-dining-the-sky","title":"VIEW & DINING THE SKY, dîner du 10 nov","what":"Le buffet tournant du 17e étage du New Otani : un tour complet de Tokyo de nuit pendant le repas, le deuxième soir.","deadline":"2026-10-30","forDate":"2026-11-10","etat":"reserve","heure":"18:00"},
  {"id":"tokyo-ten","type":"table","canal":"en ligne","url":"https://www.tablecheck.com/en/shops/sushitokyo-ten-shinjuku/reserve","commentReserver":"Réservé sur TableCheck : omakase du midi (5 500 ¥ par personne), au comptoir, table de 90 minutes.","spotId":"spot-sushi-tokyo-ten","title":"Sushi Tokyo Ten, omakase du midi","what":"L'omakase du midi au comptoir de NEWoMan Shinjuku, sur la route entre Kitanomaru et Gotoku-ji.","deadline":"2026-10-30","forDate":"2026-11-30","etat":"reserve","heure":"12:30"},
  {"id":"junsei","type":"table","canal":"en ligne","url":"https://www.klook.com/activity/5198-nanzenji-junsei-restaurant-kyoto/","commentReserver":"En ligne via Klook (anglais), confirmation sous 24 h, ou par téléphone. Demander la salle côté jardin. Menu du midi ~4 500 ¥.","spotId":"spot-nanzenji-junsei","title":"Nanzenji Junsei, déjeuner du 19 nov","what":"Le tofu des temples dans un jardin de Nanzen-ji. En pleine saison des érables, pas de table sans réservation.","deadline":"2026-10-21","forDate":"2026-11-19","tel":"+81-75-761-2311","etat":"reserve","heure":"11:30"},
  {"id":"mitsukawa","type":"table","canal":"en ligne","url":"https://www.tablecheck.com/en/sushi-mitsukawa-kanazawa","commentReserver":"Réservé sur TableCheck : le menu nigiri du midi (8 800 ¥ par personne).","spotId":"spot-mitsukawa","title":"Sushi Mitsukawa, déjeuner du 15 nov (Kanazawa)","what":"Huit places au comptoir à Higashi Chaya, les poissons de la mer du Japon, sur un comptoir de hinoki de 200 ans.","deadline":"2026-10-21","forDate":"2026-11-15","tel":"+81-76-253-5005","etat":"reserve","heure":"12:00"},
]);
