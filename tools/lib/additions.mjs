// Idées ajoutées à la sélection d'origine, marquées `source: 'claude'` pour ne
// jamais se confondre avec les tiennes ni avec les conseils de l'amie guide.
//
// Deux angles, choisis parce que c'est là que le guide avait des trous :
//
//  1. Ce qui rougit PENDANT votre séjour. Le guide a les classiques, mais pas
//     ceux calés sur vos dates : Minoo fin novembre depuis Osaka, l'allée de
//     ginkgos de Jingu Gaien qui dore quand vous revenez à Tokyo, les temples
//     de Kyoto qui n'ouvrent leurs illuminations qu'à partir de mi-novembre.
//
//  2. Ce qui a ouvert après 2023. La sélection s'arrêtait là.
//
// Réserve d'usage : mes connaissances s'arrêtent à mai 2026 pour un voyage en
// novembre. Les lieux ci-dessous sont établis, mais horaires et tarifs sont à
// revérifier avant de partir. Ce qui a été confirmé en direct porte `checked`.

const maps = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export const ADDITIONS = [
  // --- Tokyo : le pic tombe pendant le second séjour (27 nov → 2 déc) --------
  {
    name: 'Icho Namiki, Jingu Gaien', cityId: 'tokyo', category: 't0', priority: 'ob',
    blurb: "l'allée de ginkgos dorés — pic fin novembre, pile quand vous revenez",
    q: 'Icho Namiki Jingu Gaien Tokyo', commons: 'Jingu Gaien Ginkgo Avenue',
  },
  {
    name: 'Koishikawa Korakuen', cityId: 'tokyo', category: 't0', priority: 'top',
    blurb: 'le plus vieux jardin de Tokyo, érables sur fond de gratte-ciels',
    q: 'Koishikawa Korakuen Tokyo', commons: 'Koishikawa Korakuen autumn',
  },
  {
    name: 'Kyu-Furukawa', cityId: 'tokyo', category: 't0', priority: 'symp',
    blurb: 'manoir occidental, roseraie et jardin japonais — jamais bondé',
    q: 'Kyu-Furukawa Gardens Tokyo', commons: 'Kyu-Furukawa Gardens',
  },
  {
    name: 'Kiyosumi Teien', cityId: 'tokyo', category: 't0', priority: 'symp',
    blurb: 'jardin de promenade autour d\'un étang, pierres à traverser',
    q: 'Kiyosumi Teien Tokyo', commons: 'Kiyosumi Garden',
  },
  {
    name: 'Todoroki, la vallée', cityId: 'tokyo', category: 't3', priority: 'niche',
    blurb: 'la seule gorge de Tokyo — 1 km de rivière sous les érables',
    q: 'Todoroki Valley Tokyo', commons: 'Todoroki Valley',
  },
  {
    name: 'Musée Nezu', cityId: 'tokyo', category: 't0', priority: 'symp',
    blurb: 'art asiatique et surtout son jardin, un des plus beaux de la ville',
    q: 'Nezu Museum Tokyo', commons: 'Nezu Museum garden',
  },
  {
    name: 'Senkyaku Banrai, Toyosu', cityId: 'tokyo', category: 't1', priority: 'top',
    blurb: 'marché-halle et onsen sur le toit face à la baie — ouvert en 2024',
    q: 'Toyosu Senkyaku Banrai Tokyo', commons: 'Toyosu Market',
  },
  {
    name: 'Azabudai Hills', cityId: 'tokyo', category: 't3', priority: 'symp',
    blurb: 'le quartier ouvert fin 2023 — teamLab Borderless est dedans',
    q: 'Azabudai Hills Tokyo', commons: 'Azabudai Hills',
  },
  {
    name: 'Tokyu Plaza Harakado', cityId: 'tokyo', category: 't4', priority: 'symp',
    blurb: 'le nouveau Harajuku (2024) — rooftop en accès libre',
    q: 'Tokyu Plaza Harakado Harajuku', commons: 'Harakado Harajuku', mustMatch: 'harakado',
  },
  {
    name: 'Kabukicho Tower', cityId: 'tokyo', category: 't3', priority: 'niche',
    blurb: "l'étage food court rétro et les salles de jeux, ouvert 2023",
    q: 'Tokyu Kabukicho Tower Shinjuku', commons: 'Kabukicho Tower',
  },

  // --- Kyoto : 16 → 22 nov, la montée vers le pic ----------------------------
  {
    name: 'Genko-an', cityId: 'kyoto', category: 't0', priority: 'top',
    blurb: "les deux fenêtres — l'Illumination et l'Égarement — remplies d'érables",
    q: 'Genko-an Kyoto', commons: 'Genkoan Kyoto',
  },
  {
    name: 'Enko-ji', cityId: 'kyoto', category: 't0', priority: 'top',
    blurb: 'un des plus beaux momiji de Kyoto, illuminé le soir en novembre',
    q: 'Enkoji Temple Kyoto', commons: 'Enkoji Kyoto autumn',
  },
  {
    name: 'Shisen-do', cityId: 'kyoto', category: 't0', priority: 'symp',
    blurb: "l'ermitage du poète, jardin d'azalées taillées et bruit du shishi-odoshi",
    q: 'Shisendo Kyoto', commons: 'Shisendo Kyoto', mustMatch: 'shisendo',
  },
  {
    name: 'Jojakko-ji', cityId: 'kyoto', category: 't0', priority: 'symp',
    blurb: 'Arashiyama à flanc de colline, vue sur Kyoto entre les érables',
    q: 'Jojakkoji Arashiyama Kyoto', commons: 'Jojakkoji',
  },
  {
    name: 'Ohara & Sanzen-in', cityId: 'kyoto', category: 't2', priority: 'top',
    blurb: 'une heure de bus au nord — mousse, jizo cachés, campagne',
    q: 'Sanzenin Ohara Kyoto', commons: 'Sanzen-in',
  },
  {
    name: 'Kitano Tenmangu, le Momiji-en', cityId: 'kyoto', category: 't0', priority: 'symp',
    blurb: 'jardin d\'érables ouvert seulement en automne, thé et wagashi inclus',
    q: 'Kitano Tenmangu Kyoto', commons: 'Kitano Tenmangu',
  },
  {
    name: 'Daigo-ji', cityId: 'kyoto', category: 't0', priority: 'symp',
    blurb: 'la pagode la plus ancienne de Kyoto, au sud-est et au calme',
    q: 'Daigoji Kyoto', commons: 'Daigo-ji',
  },
  {
    name: 'Konkai Komyo-ji', cityId: 'kyoto', category: 't0', priority: 'niche',
    blurb: 'le temple de Kurodani — immense, gratuit, et presque personne',
    q: 'Konkaikomyoji Kyoto', commons: 'Konkai Komyoji',
  },
  {
    name: 'Shoren-in', cityId: 'kyoto', category: 't0', priority: 'niche',
    blurb: 'camphriers géants et illuminations bleutées à Higashiyama',
    q: 'Shorenin Kyoto', commons: 'Shorenin Kyoto temple', mustMatch: 'shorenin',
  },
  {
    name: 'Nintendo Museum, Uji', cityId: 'kyoto', category: 't3', priority: 'ob',
    blurb: 'ouvert fin 2024 — billets par tirage au sort, fermé le mardi',
    q: 'Nintendo Museum Uji Kyoto', commons: 'Nintendo Museum Uji',
    checked: '2026-08-27',
  },

  // --- Osaka : 22 → 25 nov, en plein pic -------------------------------------
  {
    name: 'Minoo, la cascade', cityId: 'osaka', category: 't2', priority: 'ob',
    blurb: 'LE momiji d\'Osaka : 3 km de sentier jusqu\'à la cascade, pic fin novembre',
    q: 'Minoo Falls Osaka', commons: 'Minoo Falls',
  },
  {
    name: 'Katsuo-ji', cityId: 'osaka', category: 't0', priority: 'symp',
    blurb: 'le temple aux milliers de daruma rouges, juste au-dessus de Minoo',
    q: 'Katsuoji Minoh Osaka', commons: 'Katsuo-ji',
  },
  {
    name: 'Hozen-ji Yokocho', cityId: 'osaka', category: 't3', priority: 'symp',
    blurb: 'deux ruelles pavées derrière Dotonbori — le Osaka d\'avant les néons',
    q: 'Hozenji Yokocho Osaka', commons: 'Hozenji Yokocho',
  },
  {
    name: 'Nakanoshima, le musée', cityId: 'osaka', category: 't3', priority: 'niche',
    blurb: 'cube noir ouvert en 2022, très belle collection d\'affiches et de design',
    q: 'Nakanoshima Museum of Art Osaka', commons: 'Nakanoshima Museum of Art',
  },

  // --- Kanazawa : 14 → 16 nov, le tout début du pic ---------------------------
  {
    name: 'Tsuzumi-mon', cityId: 'kanazawa', category: 't5', priority: 'symp',
    blurb: 'la porte-tambour de la gare, sous sa coupole de verre — de nuit surtout',
    q: 'Tsuzumi Gate Kanazawa Station', commons: 'Kanazawa Station',
  },
  {
    name: 'Kenroku-en illuminé', cityId: 'kanazawa', category: 't3', priority: 'top',
    blurb: 'illuminations d\'automne quelques soirs de novembre — entrée gratuite',
    q: 'Kenrokuen Kanazawa', commons: 'Kenrokuen night',
  },
  {
    name: 'Natadera', cityId: 'kanazawa', category: 't2', priority: 'niche',
    blurb: 'grottes creusées dans la falaise, une heure au sud — très peu de monde',
    q: 'Natadera Komatsu Ishikawa', commons: 'Natadera',
  },

  // --- Hakone : le pic y est passé, mais ------------------------------------
  {
    name: 'Musée d\'art de Hakone', cityId: 'hakone', category: 't0', priority: 'symp',
    blurb: 'jardin de mousse et érables — ce qui tient encore fin novembre en altitude',
    q: 'Hakone Museum of Art', commons: 'Hakone Museum of Art moss garden', mustMatch: 'hakonemuseum',
  },

  // --- Nara, depuis Osaka ----------------------------------------------------
  {
    name: 'Yoshikien', cityId: 'osaka', category: 't0', priority: 'niche',
    blurb: 'trois jardins à côté de l\'Isuien, et gratuit pour les étrangers',
    q: 'Yoshikien Garden Nara', commons: 'Yoshikien',
  },
];

export const enriched = ADDITIONS.map((a) => ({
  ...a,
  maps: maps(a.q),
  source: 'claude',
  guideTip: false,
}));
