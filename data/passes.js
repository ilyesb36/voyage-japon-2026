// Les passes — comprendre, choisir, acheter et utiliser les deux passes de
// transport du voyage : le Hakone Freepass (25 → 27 nov.) et le Nikko Pass
// World Heritage Area (12 nov.). Tenu à la main, pas extrait. Rien de sensible :
// ni numéro de réservation, ni code, ni lien de pré-enregistrement.
//
// Les montants sont en yens par personne, comme sur place. Les euros du budget
// vivent dans data/trip.js (BUDGET) : on ne les recopie pas ici, pour n'avoir
// qu'une seule source à tenir.
//
// Faits relevés le 15 octobre 2026 sur les pages officielles — voir SOURCES en
// bas de fichier. On ne devine rien : ce qui n'est pas confirmé est écrit
// prudemment (« environ »), et l'usage des billets numériques vient d'EMot
// (Hakone) et de Tobu (Nikko).

// Le chapô de la page : la couverture et l'intro, plus la phrase « pas de JR
// Pass » demandée dans la section « En bref ».
export const INTRO = Object.freeze({
  sub: "Deux passes : Hakone et Nikko",
  lede: "Deux passes couvrent les journées de montagne du voyage : le Hakone Freepass, du 25 au 27 novembre, et le Nikko Pass, pour le 12 novembre. Pour chacun : ce qu'il couvre, lequel prendre, où l'acheter, et comment s'en servir sur place.",
  jrPass: "Pas de JR Pass : sur cet itinéraire, acheter les billets de train à l'unité revient moins cher.",
});

// Un objet par pass. Les mêmes champs des deux côtés, pour que la page se rende
// pareil ; seuls « pourQui » et « express » sont propres au Nikko Pass, et « regleBus »
// et « doute » (dans reconnaitreBus) au Hakone Freepass. Le champ `resume` sert aux
// deux cartes « En bref », dérivées de cette liste.
export const PASSES = Object.freeze([
  {
    id: 'hakone',
    nom: 'Hakone Freepass',
    jp: '箱根フリーパス',
    cityId: 'hakone',
    duree: '3 jours',
    prix: '6 400 ¥ / pers.',
    quand: 'du 25 au 27 nov.',
    resume: "Presque tout le massif en illimité : train, funiculaire, téléphérique, bateau et bus Tozan.",

    // La règle des bus en une ligne, à lire sans ouvrir le détail : sur la page du
    // jour (25, 26, 27 nov.) et sur la carte de la page Transports. Les noms sont
    // ceux écrits en japonais sur le bus : la seule façon sûre de le reconnaître.
    regleBus: "Bus : 箱根登山バス compris, 伊豆箱根バス non — lisez le nom sur le flanc",

    // Ce qui est compris, sans limite de passages.
    compris: [
      "Le train Hakone Tozan, d'Odawara à Gōra",
      "Le funiculaire Hakone Tozan, de Gōra à Sōunzan",
      "Le téléphérique de Hakone : Sōunzan – Ōwakudani – Tōgendai",
      "Le bateau pirate sur le lac Ashi (croisière de Hakone)",
      "Les bus Hakone Tozan, Odakyu Highway Bus et Tōkai Bus, dans leurs zones",
      "Le bus touristique « Kanko shisetsu-meguri » (ligne S)",
      "Des réductions dans une soixantaine de sites (musées…)",
    ],
    pasCompris: [
      "Le supplément du Romancecar",
      "Les bus Izu-Hakone (伊豆箱根バス)",
      "Les trajets hors zone, les taxis, les shinkansen",
    ],

    // Lequel acheter : la version, le prix, et pourquoi celle-là.
    choix: {
      version: "« Depuis Odawara », 3 jours",
      prix: "6 400 ¥ / pers.",
      pourquoi: "Vous arrivez à Odawara le 25 en shinkansen depuis Osaka, et vous repartez d'Odawara le 27 vers Tokyo. Le 3 jours couvre les trois journées ; le 2 jours ne couvrirait pas la descente du 27. La version « depuis Shinjuku », plus chère, ajoute un aller-retour Odakyu Shinjuku ↔ Odawara dont vous n'avez pas besoin.",
      tarifs: "Tarifs adultes depuis le 1er oct. 2025 : depuis Odawara, 2 jours 6 000 ¥, 3 jours 6 400 ¥ ; depuis Shinjuku, 2 jours 7 100 ¥, 3 jours 7 500 ¥.",
    },

    // Où et comment l'acheter, en étapes.
    acheter: [
      "En ligne sur EMot Online Tickets, en vente à partir d'un mois avant le premier jour : billet numérique sur le téléphone, rien à échanger à l'arrivée.",
      "Sinon au guichet Odakyu de la gare d'Odawara en arrivant le 25 (c'est le plan prévu), aux autres gares Odakyu, au 7-Eleven, ou dans une agence de voyage.",
      "Aux distributeurs du train Hakone Tozan : seulement pour le jour même.",
    ],

    // Comment s'en servir sur place : aux portiques, puis dans le bus.
    utiliser: {
      portiques: "Le Freepass d'EMot est un billet sur le téléphone. Dans l'application, ouvrez la liste de vos billets et activez le pass (« Activer ce billet ») : un écran animé s'affiche. Là où il y a un lecteur, passez le QR dessus ; sinon, montrez l'écran animé à l'agent — au train Tozan, au funiculaire, au téléphérique et à l'embarcadère du bateau.",
      bus: "Dans le bus, montrez l'écran du pass au chauffeur (ou passez le QR au lecteur). Chacun son téléphone, chargé et connecté : le billet a besoin d'Internet pour s'afficher. En billet papier, on le montre à l'agent ou on l'insère au portique.",
    },

    // Reconnaître le bon bus : plusieurs compagnies, parfois au même arrêt ; la principale
    // à éviter est Izu-Hakone (la source officielle ne cite qu'elle, sans en exclure
    // d'autres). On la reconnaît au nom japonais écrit sur le bus, jamais à une
    // couleur (on n'en garantit aucune). Le verdict « compris / pas compris » vient de
    // `statut`, la page l'écrit en gros : `note` n'a pas à le répéter. `doute` est la
    // phrase à dire au chauffeur, quand le nom ne se lit pas.
    reconnaitreBus: {
      intro: "Plusieurs compagnies desservent Hakone ; la principale à éviter avec le Freepass : Izu-Hakone (伊豆箱根バス). Le nom de la compagnie est écrit en japonais sur le flanc et au-dessus du pare-brise : 箱根登山バス = compris, 伊豆箱根バス = pas compris.",
      lignes: [
        { jp: '箱根登山バス', romaji: 'Hakone Tozan', statut: 'oui', note: "C'est la compagnie à prendre." },
        { jp: '伊豆箱根バス', romaji: 'Izu-Hakone', statut: 'non', note: "Autre compagnie : le pass ne permet pas d'y monter, même aux arrêts communs." },
      ],
      doute: "Au moindre doute, demandez au chauffeur : フリーパスは使えますか？ (furī pasu wa tsukaemasu ka\u00a0? — «\u00a0Le Free Pass est-il accepté\u00a0?\u00a0»)",
    },
  },

  {
    id: 'nikko',
    nom: 'Nikko Pass World Heritage Area',
    jp: null, // Tobu nomme ce pass en anglais, même sur ses pages : on ne traduit pas.
    cityId: 'tokyo', // Nikko est une excursion depuis Tokyo (train Tobu depuis Asakusa).
    duree: '2 jours',
    prix: '3 000 ¥ / pers.',
    quand: 'pour le 12 nov.',
    resume: "Le train Tobu et les bus des temples. Pas le lac, pas le supplément express.",

    compris: [
      "Un aller-retour en train Tobu, Asakusa (ou Tokyo Skytree) ↔ Shimo-Imaichi",
      "Toutes les lignes Tobu entre Shimo-Imaichi, Tobu-Nikko et Shin-Fujiwara",
      "Les bus Tobu de la zone du patrimoine mondial : de la gare aux sanctuaires",
    ],
    pasCompris: [
      "Le supplément des trains express (à acheter à part)",
      "Le bus du lac Chūzenji et de la cascade de Kegon",
      "Les entrées des sanctuaires",
      "(Le téléphérique d'Akechidaira est fermé jusqu'en août 2027.)",
    ],

    pourQui: "Réservé aux voyageurs étrangers ; une personne japonaise qui vous accompagne peut aussi l'acheter.",

    choix: {
      version: "World Heritage Area, 2 jours",
      prix: "3 000 ¥ / pers.",
      pourquoi: "Pour une seule journée à Nikko, il suffit : il couvre le train et les bus des temples. La version All Area (8 000 ¥, 4 jours) ajoute les bus du lac et la croisière, mais 3 000 ¥ plus deux tickets de bus font environ 5 500 ¥ : elle ne vaut pas le coup pour un jour.",
    },

    // Propre au Nikko Pass : le supplément des express, important pour le timing.
    express: {
      texte: "Le pass couvre le train Tobu, mais pas le supplément des express, où toutes les places sont réservées. Par personne et par trajet : environ 1 940 ¥ en SPACIA X (siège standard), ou 1 650 ¥ en Revaty ou Spacia « Kegon ». Acheté à bord ou à un agent du quai, c'est 200 ¥ de plus.",
      reserver: "À réserver sur トブチケ！ (Tobuchike), le site de billets de Tobu, dès un mois avant à 9 h, ou en gare Tobu.",
      sans: "Sans express : des trains ordinaires avec un changement à Minami-Kurihashi, soit environ 2 h 30 à 3 h au lieu de 2 h. Il n'y a pas d'ordinaire direct.",
    },

    acheter: [
      "En ligne sur le site de billets numériques de Tobu : le pass reste sur le téléphone, on prend le train à Asakusa (ou Tokyo Skytree).",
      "Ou acheter en ligne et retirer un billet papier au Tobu Tourist Information Center d'Asakusa, à partir d'un mois avant.",
      "À part, le supplément express (voir ci-dessus), sur トブチケ！ (Tobuchike) dès un mois avant, ou en gare.",
    ],

    utiliser: {
      portiques: "Le Nikko Pass numérique de Tobu s'active dans l'application avant le portique. À Asakusa, pas de comptoir d'échange : activez le pass, montrez l'écran à l'agent du portique, et prenez le train. En version papier, on le retire au Tourist Information Center d'Asakusa, puis on le montre ou on l'insère au portique.",
      bus: "Dans les bus Tobu de Nikko, montrez l'écran (ou le billet papier) au chauffeur en descendant.",
    },

    reconnaitreBus: {
      intro: "À Nikko, les bus compris sont ceux de Tobu.",
      lignes: [
        { jp: '東武バス', romaji: 'Tobu', statut: 'oui', note: "Entre la gare et les sanctuaires (zone du patrimoine mondial). Le bus du lac Chūzenji, lui, n'est pas compris." },
      ],
    },
  },
]);

// Dans votre programme : jour par jour, ce que le pass couvre. Le lien mène à la
// journée par son numéro de jour (champ `n` de data/days.js), comme jour.html
// l'attend : 12 nov. → 5, 25 nov. → 18, 26 nov. → 19, 27 nov. → 20.
export const PROGRAMME = Object.freeze([
  {
    passId: 'nikko',
    date: '2026-11-12',
    dayN: 5,
    titre: "Nikko, les temples",
    couvre: [
      "L'aller-retour en train Tobu, Asakusa ↔ Nikko (le supplément express se paie en plus).",
      "Les bus Tobu entre la gare et les sanctuaires : Tōshō-gū, Rinnō-ji, Futarasan, pont Shinkyō…",
    ],
    horsPass: [
      "Le bus vers le lac Chūzenji et la cascade de Kegon, l'après-midi si le timing le permet (environ 1 100 à 1 250 ¥ le trajet).",
    ],
  },
  {
    passId: 'hakone',
    date: '2026-11-25',
    dayN: 18,
    titre: "Arrivée à Hakone",
    couvre: [
      "Le bus Hakone Tozan (ligne H) d'Odawara au port de Moto-Hakone (元箱根港), environ 1 h.",
    ],
    note: "Arrivée annoncée entre 14:30 et 15:00 ; le ryokan vient vous chercher au port (le numéro est dans la journée).",
  },
  {
    passId: 'hakone',
    date: '2026-11-26',
    dayN: 19,
    titre: "La boucle de Hakone",
    couvre: [
      "Le bateau pirate de Moto-Hakone à Tōgendai (environ 30 min ; premier départ 9:40).",
      "Le téléphérique Tōgendai – Ōwakudani – Sōunzan, puis le funiculaire jusqu'à Gōra.",
      "La navette ou le bus S jusqu'au musée Pola, et le retour : bus S ou navette → Gōra, train Tozan → Miyanoshita, bus H direction Hakonemachi-ko (箱根町港), descendre à Moto-Hakone-ko (元箱根港).",
    ],
    note: "Toute la boucle est comprise. Le téléphérique s'arrête parfois (vent, gaz volcaniques) : des bus le remplacent, compris eux aussi.",
  },
  {
    passId: 'hakone',
    date: '2026-11-27',
    dayN: 20,
    titre: "Départ de Hakone",
    couvre: [
      "Le bus H puis le train Tozan jusqu'au musée en plein air (gare Chōkoku-no-mori), le matin.",
      "La descente en train Tozan jusqu'à Odawara.",
    ],
    horsPass: [
      "Le shinkansen Odawara → Tokyo.",
    ],
  },
]);

// Sources, avec la date du relevé. Repliées en bas de page. On garde l'URL pour
// pouvoir re-vérifier plus tard : les horaires et les tarifs bougent.
export const SOURCES = Object.freeze([
  { quoi: "Hakone Freepass — tarifs, contenu, points de vente (Hakone Navi)", url: 'https://www.hakonenavi.jp/international/en/discount_passes/free_pass', date: '2026-10-15' },
  { quoi: "Freepass numérique EMot — activation et usage", url: 'https://www.emot.jp/hakone.free.eng.chara1.html', date: '2026-10-15' },
  { quoi: "Téléphérique de Hakone — horaires et interruptions (vent, gaz)", url: 'https://hakonetrip.odakyu-global.com/spot/hakone-ropeway/', date: '2026-10-15' },
  { quoi: "Bateau pirate — horaires (l'horaire d'hiver commence le 1er déc.)", url: 'https://hakone.jcld.jp/ForHakoneNavi/TimeTable/indexEn.htm', date: '2026-10-15' },
  { quoi: "Musée Pola — horaires (9:00–17:00, dernière entrée 16:30)", url: 'https://www.polamuseum.or.jp/en/access/', date: '2026-10-15' },
  { quoi: "Nikko Pass World Heritage Area — prix, contenu, express (Tobu)", url: 'https://www.tobu.co.jp/en/ticket/nikko/city.html', date: '2026-10-15' },
  { quoi: "Nikko Pass All Area — comparaison (bus du lac, croisière)", url: 'https://www.tobu.co.jp/en/ticket/nikko/all.html', date: '2026-10-15' },
]);
