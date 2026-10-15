// Valises — faire suivre (ou pas) les deux grosses valises à chaque changement
// de ville. Tenu à la main, pas extrait. Rien de sensible : ni numéro de
// réservation, ni code.
//
// Les adresses des logements ne sont PAS recopiées ici : chaque trajet et
// chaque fiche du bordereau renvoient à un hôtel par son id, et valises.html
// lit le nom, l'adresse japonaise et le téléphone dans HOTELS (data/trip.js).
//
// Tarifs : Yamato 宅急便 (TA-Q-BIN), barème en vigueur depuis le 1er octobre
// 2025 (toujours applicable en novembre 2026), payé au départ (元払い), taxes
// comprises, relevé le 15 octobre 2026 sur le barème officiel et l'outil
// « délai de livraison ». Une grosse valise entre dans la taille 160 dès
// qu'elle dépasse 20 kg (la taille 140 y est plafonnée) : c'est le tarif 160
// qui sert de référence, le 140 étant indiqué pour une valise plus légère.
// « estimation » marque ce qui n'est pas confirmé sur une page officielle.

export const TRAJETS = Object.freeze([
  {
    n: 1,
    date: '2026-11-14',
    fromHotelId: 'hotel-hop-inn-tokyo-asakusa',
    toHotelId: 'hotel-center-point-in-kanazawa',
    toAirport: false,
    region: 'Kantō → Hokuriku (Ishikawa)',
    train: 'Kagayaki — Hokuriku Shinkansen, direct, 2 h 30',
    recoTitre: 'Les garder avec soi',
    cout2: 'inclus',
    options: [
      {
        reco: true,
        titre: 'Les garder avec soi dans le Kagayaki',
        cout: 'Aucun supplément',
        pour: "Train direct, sans changement : les valises voyagent avec vous. Le Hokuriku Shinkansen n'impose aucune réservation « bagage surdimensionné » (contrairement au Tōkaidō — voir « Dans le train »). Réserver les sièges de la dernière rangée pour loger les valises derrière.",
        contre: "Il faut hisser deux grosses valises dans le train ; monter tôt le samedi, le Hokuriku se remplit le week-end.",
      },
      {
        titre: 'Les faire suivre en takkyubin',
        cout: '≈ 6 040 ¥ les deux (taille 160 ; 5 260 ¥ si ≤ 20 kg)',
        delai: 'Livré le lendemain (le 15), créneau du matin possible',
        quand: "Déposer la veille (le 13) à la réception du Hop Inn, ou dans un 7-Eleven / FamilyMart.",
        pour: "On voyage les mains libres.",
        contre: "Center Point est un appartement sans personne après 19 h, et sa politique de colis est inconnue : à ne tenter que s'il confirme qu'il reçoit et qu'un créneau de livraison colle à votre présence. Sinon, 営業所止め — livraison à un centre Yamato de Kanazawa, à retirer soi-même.",
      },
    ],
    demander: {
      hotelId: 'hotel-center-point-in-kanazawa',
      texte: "Acceptez-vous une livraison takkyubin (宅急便) pendant notre séjour, et à quelle heure peut-elle être remise, puisqu'il n'y a personne après 19 h ?",
    },
    sources: [
      { quoi: 'Barème Yamato 宅急便 (1er oct. 2025), Kantō → Hokuriku', url: 'https://www.yamato-hd.co.jp/important/pdf/info_250501_1.pdf', date: '2026-10-15' },
      { quoi: 'Bagages surdimensionnés — Hokuriku Shinkansen (JR East)', url: 'https://media.jreast.co.jp/articles/4808', date: '2026-10-15' },
    ],
  },
  {
    n: 2,
    date: '2026-11-16',
    fromHotelId: 'hotel-center-point-in-kanazawa',
    toHotelId: 'hotel-matatabi-stay-nishinokyo',
    toAirport: false,
    region: 'Hokuriku → Kansai',
    train: 'Tsurugi + Thunderbird via Tsuruga, 2 h 15 (un changement)',
    recoTitre: 'Les garder avec soi',
    cout2: 'inclus',
    options: [
      {
        reco: true,
        titre: 'Les garder avec soi',
        cout: 'Aucun supplément',
        pour: "Un seul changement, à Tsuruga, où le Tsurugi et le Thunderbird se font quai à quai ; aucune réservation « bagage surdimensionné » sur ces deux trains. À l'arrivée, l'appartement n'ouvre qu'à 16 h : laisser les valises aux casiers de la gare de Kyoto, ou de la gare JR de Nijō (7 min de l'appartement).",
        contre: null,
      },
      {
        titre: 'Les envoyer en 営業所止め à Kyoto',
        cout: '≈ 6 040 ¥ les deux (taille 160)',
        delai: 'Livré le lendemain, à retirer au centre Yamato',
        quand: "Déposer la veille à un centre Yamato ou un konbini de Kanazawa.",
        pour: "Matatabi ne reçoit aucun colis — mais on peut faire livrer les valises à un centre Yamato près de Nijō et les retirer soi-même, pour faire le changement de Tsuruga les mains vides.",
        contre: "Il faut aller chercher les valises au centre (passeport + double du bordereau), et elles n'y sont qu'à partir du lendemain.",
      },
    ],
    demander: null,
    sources: [
      { quoi: 'Barème Yamato (1er oct. 2025), Hokuriku → Kansai', url: 'https://www.yamato-hd.co.jp/important/pdf/info_250501_1.pdf', date: '2026-10-15' },
      { quoi: 'Matatabi : aucune livraison, bagages compris (conditions Booking)', date: '2026-10-14' },
      { quoi: 'Bagages en train — Thunderbird (ligne classique, JR West)', url: 'https://www.jr-odekake.net/railroad/service/baggage/', date: '2026-10-15' },
    ],
  },
  {
    n: 3,
    date: '2026-11-22',
    fromHotelId: 'hotel-matatabi-stay-nishinokyo',
    toHotelId: 'hotel-house-kuromon',
    toAirport: false,
    region: 'Kansai (intra)',
    train: 'JR Special Rapid, 30 min, direct',
    recoTitre: 'Les garder avec soi',
    cout2: 'inclus',
    options: [
      {
        reco: true,
        titre: 'Les garder avec soi',
        cout: 'Aucun supplément',
        pour: "Trajet direct de 30 min : porter les valises ne coûte rien. 川HOUSE n'ouvre qu'à 16 h (l'hôte répond de 9 h à 12 h) — casiers du côté de Nipponbashi / Namba en attendant : la gare Kintetsu-Nippombashi est la mieux fournie en grands casiers (grand 600–1 000 ¥, surdimensionné 800–1 500 ¥).",
        contre: null,
      },
      {
        titre: 'Les faire suivre en takkyubin',
        cout: '≈ 6 040 ¥ les deux (taille 160)',
        delai: 'Livré le lendemain',
        pour: "Possible, mais peu utile pour 30 min de train.",
        contre: "川HOUSE est un appartement sans accueil et sa politique de colis est inconnue ; pour une si courte étape, les casiers sont plus simples.",
      },
    ],
    demander: {
      hotelId: 'hotel-house-kuromon',
      texte: "Acceptez-vous une livraison takkyubin, et où peut-elle être déposée puisqu'il n'y a pas d'accueil ?",
    },
    sources: [
      { quoi: 'Barème Yamato (1er oct. 2025), intra-Kansai', url: 'https://www.yamato-hd.co.jp/important/pdf/info_250501_1.pdf', date: '2026-10-15' },
      { quoi: 'Casiers (tailles et prix) — Kintetsu', url: 'https://www.kintetsu.co.jp/foreign/english/coinlocker/index.html', date: '2026-10-15' },
    ],
  },
  {
    n: 4,
    date: '2026-11-25',
    fromHotelId: 'hotel-house-kuromon',
    toHotelId: 'hotel-hananoyado-fukuya',
    toAirport: false,
    region: 'Kansai → Kanagawa',
    train: 'Hikari → Odawara, puis bus Tozan → port de Moto-Hakone',
    recoTitre: 'Avec soi — le ryokan vient au port',
    cout2: 'inclus',
    options: [
      {
        reco: true,
        titre: 'Les garder avec soi (navette du ryokan)',
        cout: 'Aucun supplément',
        pour: "Le ryokan vient vous chercher en voiture au port de Moto-Hakone : le dernier tronçon, le plus pénible, est assuré. Les valises montent avec vous dans le Hikari (somme des trois côtés ≤ 160 cm : rien à réserver — voir « Dans le train »).",
        contre: "Le bus Tozan (Odawara → Moto-Hakone, ~1 h) est souvent bondé et peu commode avec deux grosses valises.",
      },
      {
        titre: 'Le 箱根キャリーサービス depuis Hakone-Yumoto',
        cout: '1 500 ¥/valise (≤ 140 cm, 15 kg) ou 2 500 ¥ (≤ 200 cm, 30 kg) — 3 000 à 5 000 ¥ les deux',
        delai: "Livré l'après-midi même (après 15 h)",
        quand: "Descendre à Hakone-Yumoto en chemin et déposer entre 8:30 et 12:00.",
        pour: "Enlève les valises du bus Tozan et de l'attente au port : livraison le jour même à l'hébergement.",
        contre: "Seulement si le Fukuya est hébergement partenaire — à confirmer dans la messagerie Booking.",
      },
      {
        titre: "Les envoyer d'avance depuis Osaka — déconseillé",
        cout: '≈ 6 320 ¥ les deux (taille 160)',
        delai: 'Livré le lendemain (Hakone est en zone « lendemain », sans supplément montagne)',
        pour: "Techniquement possible et rapide.",
        contre: "Fukuya ne confirme pas recevoir les colis, et l'étape ne dure que 2 nuits : la navette du ryokan reste plus sûre.",
      },
    ],
    demander: {
      hotelId: 'hotel-hananoyado-fukuya',
      texte: "Êtes-vous hébergement partenaire du 箱根キャリーサービス de Hakone-Yumoto, et acceptez-vous une livraison takkyubin avant notre arrivée ?",
    },
    sources: [
      { quoi: 'Barème Yamato (1er oct. 2025), Kansai → Kantō ; Osaka → Hakone en « lendemain » (outil officiel)', url: 'https://www.yamato-hd.co.jp/important/pdf/info_250501_1.pdf', date: '2026-10-15' },
      { quoi: '箱根キャリーサービス — gare de Hakone-Yumoto (dépôt 8:30–12:00, livraison après 15:00)', date: '2026-10-15' },
    ],
  },
  {
    n: 5,
    date: '2026-11-27',
    fromHotelId: 'hotel-hananoyado-fukuya',
    toHotelId: 'hotel-la-vita-ikebukuro-residence',
    toAirport: false,
    region: 'Kanagawa → Tokyo',
    train: 'Bus → Odawara, Odakyu → Shinjuku, Fukutoshin → Kanamecho (~2 h 45, plusieurs changements)',
    recoTitre: '営業所止め — centre Yamato d’Ikebukuro',
    cout2: '≈ 6 040 ¥ les deux (taille 160)',
    options: [
      {
        reco: true,
        titre: "Les envoyer en 営業所止め au centre Yamato d'Ikebukuro",
        cout: '≈ 6 040 ¥ les deux (taille 160 ; un peu moins avec les remises)',
        delai: 'Livré le lendemain au centre, gardé 7 jours',
        quand: "Faire remettre les valises à Yamato par le ryokan le matin du départ.",
        pour: "La Vita ne reçoit aucun colis et propose justement ce centre Yamato (Ikebukuro-Ekimae), à retirer soi-même. On traverse Shinjuku les mains libres, puis on récupère les valises à deux pas de l'hôtel quand on veut.",
        contre: "Vérifier que le ryokan peut confier les valises à Yamato ; retrait au centre sur présentation du passeport et du double du bordereau.",
      },
      {
        titre: 'Les garder avec soi',
        cout: 'Aucun supplément',
        pour: "Toujours possible ; le jour de l'arrivée, La Vita a un espace à bagages en libre accès près de l'entrée.",
        contre: "Plusieurs changements (Odawara, Shinjuku) avec deux grosses valises.",
      },
    ],
    demander: {
      hotelId: 'hotel-hananoyado-fukuya',
      texte: "Pouvez-vous confier nos valises à Yamato le matin du départ, en 営業所止め vers le centre d'Ikebukuro-Ekimae ?",
    },
    sources: [
      { quoi: "La Vita : ne reçoit pas de colis ; propose le centre Yamato d'Ikebukuro-Ekimae (réponse du 14 oct.)", date: '2026-10-14' },
      { quoi: '営業所止め — garde 7 jours, passeport accepté (Yamato)', url: 'https://www.kuronekoyamato.co.jp/ytc/customer/send/services/tc-receive/', date: '2026-10-15' },
    ],
  },
  {
    n: 6,
    date: '2026-12-02',
    fromHotelId: 'hotel-la-vita-ikebukuro-residence',
    toHotelId: null,
    toAirport: true,
    region: 'Tokyo → Haneda (terminal 3, international)',
    train: 'Keikyū depuis la ligne Asakusa → Haneda T3 (~50–65 min)',
    recoTitre: 'Les emporter le jour même',
    cout2: 'inclus',
    options: [
      {
        reco: true,
        titre: 'Les emporter le jour même',
        cout: 'Aucun supplément',
        pour: "Départ du logement à 10 h, vol à 20:15 : toute la journée devant soi. Les valises à l'espace bagages de La Vita ou en casier à Ikebukuro, puis Keikyū vers Haneda T3 l'après-midi. Surtout : la détaxe se récupère à Haneda sur présentation des achats — ne jamais les expédier à l'avance.",
        contre: null,
      },
      {
        titre: 'Le 空港宅急便 vers Haneda — à envoyer avant',
        cout: '≈ 6 340 ¥ les deux (taille 160 ; 5 700 ¥ en taille 140 — frais aéroport compris)',
        delai: "À déposer au plus tard le 30 nov. (2 jours avant) ; livré à Haneda la veille",
        quand: "Déposer au centre Yamato d'Ikebukuro-Ekimae avant le 30 nov.",
        pour: "Permet de finir le séjour léger ; retrait au comptoir Yamato « réception » du terminal 3, hall des arrivées (2e étage), 6:00–23:00, avec le double du bordereau.",
        contre: "Pas de service le jour même : impossible d'expédier le 2 déc. Et jamais les achats détaxés dedans — ils sont à montrer à Haneda.",
      },
    ],
    demander: null,
    sources: [
      { quoi: '空港宅急便 — délai et frais (Yamato)', url: 'https://www.kuronekoyamato.co.jp/ytc/customer/send/services/airport/', date: '2026-10-15' },
      { quoi: 'Comptoir Yamato « réception », Haneda terminal 3, 2e étage arrivées, 6:00–23:00 (site officiel Haneda)', url: 'https://tokyo-haneda.com/service/facilities/delivery.html', date: '2026-10-15' },
    ],
  },
]);

// Comment envoyer : les bases du takkyubin, le bordereau, le 営業所止め, et les
// adresses de chaque logement (lues dans HOTELS, jamais recopiées ici), plus le
// centre Yamato où La Vita fait retirer les colis.
export const ENVOYER = Object.freeze({
  intro: "Deux grosses valises à déplacer six fois. La règle simple : sur les trajets directs ou courts, on les garde avec soi ; sur les étapes à changements, on les fait suivre — quand le logement le permet. Deux logements ne reçoivent aucun colis (Matatabi, La Vita), deux sont des appartements sans accueil (Center Point, 川HOUSE) : la bonne option change à chaque fois.",
  recapNote: "Coûts pour deux valises, barème Yamato en vigueur en 2026, payé au départ, taxes comprises. Une grosse valise se facture en taille 160 dès qu'elle dépasse 20 kg ; « estimation » quand un montant n'est pas confirmé sur une page officielle. Toutes les routes sont livrées le lendemain.",
  envoi: [
    "Le takkyubin (宅急便, « Kuroneko Yamato ») fait suivre une valise d'un point à un autre au Japon, livrée le lendemain entre toutes ces villes — Hakone compris, sans supplément montagne. On remplit un bordereau (送り状), on paie au dépôt, on garde le double : c'est lui qu'on présente pour un retrait en 営業所止め ou au comptoir de l'aéroport.",
    "Où déposer : à la réception d'un hôtel qui a un accueil (il remplit le bordereau pour vous — demander que ce soit « payé au départ », 元払い), à un centre Yamato (営業所), ou dans un konbini partenaire — en 2026, seuls 7-Eleven et FamilyMart prennent Yamato ; Lawson et Ministop passent par la Poste (ゆうパック), un autre réseau. Un konbini n'accepte pas au-delà de la taille 160 : mesurer la somme des trois côtés avant d'y compter.",
    "Un petit rabais « dépôt » (持込割) d'environ 100 ¥ par valise s'applique hors réception d'hôtel, et 100 ¥ de plus par valise si les deux partent ensemble vers le même logement (複数口). Paiement en espèces ou par carte au comptoir.",
  ],
  bordereau: [
    { champ: 'お届け先 — destinataire', valeur: "Nom et adresse du logement d'arrivée, + téléphone", aide: "Adresses prêtes à recopier ci-dessous." },
    { champ: 'ご依頼主 — expéditeur', valeur: "Votre nom, le logement de départ, et un numéro joignable", aide: "Un numéro japonais atteignable (l'eSIM) aide le livreur." },
    { champ: '品名 — contenu', valeur: 'スーツケース / 衣類 (valise / vêtements)', aide: null },
    { champ: 'お届け日・時間帯 — date et créneau', valeur: "Une date où quelqu'un peut recevoir, + un créneau (8:00–12:00, etc.)", aide: "Appartement sans accueil : préférer le 営業所止め." },
    { champ: '元払い — port payé au départ', valeur: "Oui : on paie au moment du dépôt", aide: "着払い (payé à l'arrivée) est à éviter ici." },
  ],
  ejusho: {
    titre: '営業所止め — se faire livrer au centre Yamato, et retirer soi-même',
    texte: "Quand le logement ne reçoit pas de colis (Matatabi, La Vita) ou n'a pas d'accueil, on adresse l'envoi « 営業所止め » à un centre Yamato proche : le centre comme destinataire, avec son nom et son code sur le bordereau, plus votre nom et un téléphone. On retire ensuite sur place avec une pièce d'identité — le passeport est accepté — et le double du bordereau. Le centre garde le colis 7 jours, sans prolongation.",
  },
  logements: [
    { hotelId: 'hotel-hop-inn-tokyo-asakusa', recoit: 'inconnu', note: "Réception ouverte : peut confier un envoi à Yamato pour vous. Sa politique de réception de colis entrants n'est pas confirmée — sans objet ici, rien n'y est livré." },
    { hotelId: 'hotel-center-point-in-kanazawa', recoit: 'inconnu', note: "Appartement, personne après 19 h. Demander s'il accepte une livraison et à quelle heure." },
    { hotelId: 'hotel-matatabi-stay-nishinokyo', recoit: 'non', note: "A confirmé ne recevoir aucun colis, bagages envoyés à l'avance compris. Ne rien y expédier — passer par un 営業所止め à Kyoto." },
    { hotelId: 'hotel-house-kuromon', recoit: 'inconnu', note: "Appartement sans accueil, ouvre à 16 h. Demander s'il accepte une livraison et où la déposer." },
    { hotelId: 'hotel-hananoyado-fukuya', recoit: 'inconnu', note: "Ryokan avec accueil. Demander s'il est partenaire du 箱根キャリーサービス et s'il reçoit un takkyubin." },
    { hotelId: 'hotel-la-vita-ikebukuro-residence', recoit: 'non', note: "Ne reçoit aucun colis et ne garde rien avant l'arrivée. Passer par le centre Yamato d'Ikebukuro-Ekimae (ci-dessous), en 営業所止め." },
  ],
  yamato: {
    nom: 'Centre Yamato — Ikebukuro-Ekimae (池袋駅前)',
    adresseJp: '東京都豊島区西池袋2-39-7',
    note: "Le centre que La Vita recommande pour un envoi 営業所止め : on y retire soi-même, passeport + double du bordereau. C'est aussi le point de dépôt d'un envoi 空港宅急便 vers Haneda (avant le 30 nov.).",
  },
});

// Dans le train et en gare : les règles de bagages des trains du voyage, et les
// casiers / comptoirs pour les jours d'arrivée avant l'ouverture du logement.
export const TRAINS = Object.freeze([
  {
    titre: 'Bagages surdimensionnés : seulement sur le Tōkaidō',
    texte: "Sur le Tōkaidō Shinkansen (le Hikari Shin-Osaka → Odawara du 25 nov.), une valise dont la somme des trois côtés dépasse 160 cm doit voyager sur un « siège avec espace bagage » réservé — gratuit ; sans réservation, 1 000 ¥ de frais. En dessous de 160 cm, rien à faire. À mesurer : une grande valise peut atteindre 165–180 cm ; dans ce cas, réserver ce siège (gratuit) à l'achat.",
  },
  {
    titre: 'Le Hokuriku Shinkansen et le Thunderbird : rien à réserver',
    texte: "Le Kagayaki, le Tsurugi (Hokuriku Shinkansen) et le Thunderbird (ligne classique) n'ont pas ce système en 2026 : les espaces à bagages y sont libres, sans réservation ni frais. On réserve plutôt le siège de la dernière rangée pour poser les valises derrière, et on monte tôt aux heures chargées.",
  },
  {
    titre: 'Caser deux grosses valises',
    texte: "La vraie place d'une grosse valise est derrière la dernière rangée de sièges — d'où l'intérêt de réserver ces places. Les filets au-dessus conviennent aux bagages cabine, rarement à une valise de soute pleine. Ne jamais bloquer le couloir ni les portes.",
  },
  {
    titre: 'Casiers et comptoirs en gare',
    texte: "Les jours d'arrivée avant l'ouverture du logement : casiers à la gare de Kyoto (grand 700–900 ¥, surdimensionné ~1 000 ¥, vite pris en milieu de journée) et vers Nipponbashi / Namba (grand 600–1 000 ¥, surdimensionné 800–1 500 ¥). En secours : la consigne Crosta au sous-sol de la gare de Kyoto (1 000 ¥/valise/jour, 8 h–20 h) ou ecbo cloak, réservable (800 ¥/valise). La gare de Nijō a peu de grands casiers : viser Kyoto ou ecbo. Les comptoirs « mains libres » (Crosta : Kyoto 1 500 ¥/valise avant 14 h, Osaka 2 000 ¥ avant 12 h) ne livrent que dans la même ville, vers des hôtels partenaires avec accueil — ils ne couvrent ni ces changements de ville ni les appartements sans réception.",
  },
]);
