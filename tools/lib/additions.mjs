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

  // --- second lot : les trous reperes par l'audit du guide -------------------
  // Hakone n'avait aucune adresse de shopping et un seul day trip ; Kanazawa
  // un seul day trip, deux boutiques, une vue.
  {
    name: "Gyokusen'inmaru Garden", cityId: "kanazawa", category: "t0", priority: "top",
    blurb: "le jardin du château illuminé plusieurs soirs d'automne — entrée gratuite",
    q: "Gyokusen-inmaru Garden Kanazawa", commons: "Gyokuseninmaru Garden",
  },
  {
    name: "Kazuemachi Chaya", cityId: "kanazawa", category: "t0", priority: "symp",
    blurb: "le troisième quartier de geishas, le long de l'Asano — plus intime qu'Higashi",
    q: "Kazuemachi Chaya District Kanazawa", commons: "Kazuemachi",
  },
  {
    name: "Bibliothèque Umimirai", cityId: "kanazawa", category: "t0", priority: "niche",
    blurb: "la « boîte à gâteau » aux 6 000 hublots — pèlerinage d'architecture",
    q: "Kanazawa Umimirai Library", commons: "Kanazawa Umimirai Library",
  },
  {
    name: "Ohi Museum", cityId: "kanazawa", category: "t4", priority: "niche",
    blurb: "la céramique raku de Kanazawa depuis 350 ans — musée + salon de thé",
    q: "Ohi Museum Kanazawa", commons: "Ohi ware",
  },
  {
    name: "Fumuroya Cafe", cityId: "kanazawa", category: "t1", priority: "top",
    blurb: "le maître du fu (gluten de blé) en version café — set salé et desserts",
    q: "Fumuroya Cafe Kanazawa", commons: "Fu (food)",
  },
  {
    name: "Champion Curry", cityId: "kanazawa", category: "t1", priority: "symp",
    blurb: "le curry noir de Kanazawa, épais sur le riz — l'original depuis 1961",
    q: "Champion Curry Kanazawa", commons: "Kanazawa curry",
  },
  {
    name: "Shirakawa-go", cityId: "kanazawa", category: "t2", priority: "ob",
    blurb: "le village aux toits de chaume, bus direct de Kanazawa — premières neiges possibles",
    q: "Shirakawa-go", commons: "Shirakawa-go",
  },
  {
    name: "Yamanaka Onsen", cityId: "kanazawa", category: "t2", priority: "top",
    blurb: "la gorge de Kakusenkei croulant d'érables + bain thermal, au sud",
    q: "Yamanaka Onsen Kakusenkei", commons: "Kakusenkei",
  },
  {
    name: "Kotoji-toro", cityId: "kanazawa", category: "t5", priority: "symp",
    blurb: "la lanterne à deux pieds de Kenroku-en — la carte postale de la ville",
    q: "Kotoji Lantern Kenrokuen Kanazawa", commons: "Kotoji Lantern", mustMatch: "kotoji",
  },
  {
    name: "Amazake-chaya", cityId: "hakone", category: "t1", priority: "top",
    blurb: "la maison de thé au chaume sur l'ancien Tokaido — amazake chaud depuis 400 ans",
    q: "Amazake Chaya Hakone", commons: "Amazake-chaya",
  },
  {
    name: "Bakery & Table Hakone", cityId: "hakone", category: "t1", priority: "symp",
    blurb: "pain et café les pieds dans un bain chaud, face au lac Ashi",
    q: "Bakery and Table Hakone", commons: "Lake Ashi",
  },
  {
    name: "Marqueterie de Hatajuku", cityId: "hakone", category: "t4", priority: "symp",
    blurb: "les ateliers-boutiques de yosegi — boîtes à secret, le souvenir d'Hakone",
    q: "Hatajuku Yosegi Kaikan Hakone", commons: "Yosegi",
  },
  {
    name: "Gotemba Premium Outlets", cityId: "hakone", category: "t4", priority: "symp",
    blurb: "l'outlet géant avec le Fuji en toile de fond, sur la route de Tokyo",
    q: "Gotemba Premium Outlets", commons: "Gotemba Premium Outlets",
  },
  {
    name: "Parc impérial d'Hakone", cityId: "hakone", category: "t0", priority: "symp",
    blurb: "l'ancien parc impérial sur une presqu'île du lac — érables, vue Fuji, gratuit",
    q: "Onshi Hakone Park", commons: "Onshi Hakone Park",
  },
  {
    name: "Choan-ji", cityId: "hakone", category: "t0", priority: "niche",
    blurb: "500 statues de rakan sous les érables — le momiji tranquille de Sengokuhara",
    q: "Choanji Temple Hakone", commons: "Chōan-ji",
  },
  {
    name: "Gora Park", cityId: "hakone", category: "t0", priority: "symp",
    blurb: "le jardin à la française de Gora, serre tropicale et érables en terrasses",
    q: "Gora Park Hakone", commons: "Gora Park",
  },
  {
    name: "Barrière d'Hakone", cityId: "hakone", category: "t0", priority: "niche",
    blurb: "le poste de contrôle de l'ère Edo reconstitué au bord du lac Ashi",
    q: "Hakone Checkpoint Sekisho", commons: "Hakone Checkpoint",
  },
  {
    name: "Osaka Tenmangu", cityId: "osaka", category: "t0", priority: "symp",
    blurb: "le sanctuaire de Tenjin + Tenjinbashisuji, la plus longue galerie du Japon",
    q: "Osaka Tenmangu", commons: "Osaka Tenmangu",
  },
  {
    name: "Hall public central", cityId: "osaka", category: "t0", priority: "symp",
    blurb: "le hall de brique rouge sur l'île de Nakanoshima — Osaka rétro au fil de l'eau",
    q: "Osaka City Central Public Hall", commons: "Osaka City Central Public Hall",
  },
  {
    name: "Namba Parks", cityId: "osaka", category: "t0", priority: "symp",
    blurb: "le gratte-ciel-jardin aux terrasses végétales, au-dessus de la gare Namba",
    q: "Namba Parks Osaka", commons: "Namba Parks",
  },
  {
    name: "Abeno Harukas 300", cityId: "osaka", category: "t5", priority: "top",
    blurb: "Osaka à 360° depuis le plus haut gratte-ciel du Japon (300 m)",
    q: "Abeno Harukas 300", commons: "Abeno Harukas",
  },
  {
    name: "Train panoramique de Sagano", cityId: "kyoto", category: "t2", priority: "top",
    blurb: "le petit train de la gorge de Hozu — érables plein cadre fin novembre",
    q: "Sagano Romantic Train Torokko", commons: "Sagano Scenic Railway",
  },
  {
    name: "Takao (Jingo-ji)", cityId: "kyoto", category: "t2", priority: "top",
    blurb: "le berceau du momiji — Jingo-ji et le lancer de disques dans la vallée",
    q: "Jingoji Temple Takao Kyoto", commons: "Jingo-ji",
  },
  {
    name: "% Arabica Higashiyama", cityId: "kyoto", category: "t1", priority: "symp",
    blurb: "le café iconique avec la pagode Yasaka en toile de fond",
    q: "% Arabica Kyoto Higashiyama", commons: "% Arabica",
  },
  {
    name: "SOU SOU", cityId: "kyoto", category: "t4", priority: "symp",
    blurb: "tabi, textiles et graphismes made in Kyoto — la boutique culte de Nakagyo",
    q: "SOU SOU Kyoto", commons: "Kyoto",
  },
  {
    name: "Chion-in", cityId: "kyoto", category: "t0", priority: "symp",
    blurb: "la plus grande porte en bois du Japon, voisine du parc Maruyama",
    q: "Chion-in Kyoto", commons: "Chion-in",
  },
  {
    name: "Mont Takao", cityId: "tokyo", category: "t2", priority: "top",
    blurb: "la montagne aux érables à 1h de Shinjuku — téléphérique, pic fin novembre",
    q: "Mount Takao Tokyo", commons: "Mount Takao",
  },
  {
    name: "Gare de Tokyo (Marunouchi)", cityId: "tokyo", category: "t5", priority: "symp",
    blurb: "la façade de brique éclairée + le rooftop KITTE, gratuit, de nuit",
    q: "Tokyo Station Marunouchi", commons: "Tokyo Station Marunouchi",
  },
];

export const enriched = ADDITIONS.map((a) => ({
  ...a,
  maps: maps(a.q),
  source: 'claude',
  guideTip: false,
}));
