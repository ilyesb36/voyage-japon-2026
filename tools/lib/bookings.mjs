// Données relevées sur les confirmations Booking, le 27 août 2026.
// Fichier tenu à la main : extract.mjs les fusionne dans HOTELS.
//
// NE JAMAIS AJOUTER ICI : numéro de réservation, code confidentiel, e-mail,
// numéro de fidélité. Le site est public sur GitHub Pages. Ce fichier ne
// contient que ce qu'on assumerait d'afficher à quelqu'un qui a le lien :
// adresse, horaires, chambre réservée, équipements, prix.
//
// Les prix ici sont ceux réellement facturés par Booking. Ils diffèrent de
// ceux saisis dans l'ancien site, qui les surestimait de 15 € au total.

export const BOOKINGS = {
  'Hop Inn Tokyo Asakusa': {
    room: 'Chambre Double',
    size: null,                     // non communiquée par l'établissement
    capacity: '2 adultes',
    address: '1-7-8 Hanakawado, Taito City, Tokyo',
    checkIn: '15:00 – 00:00',
    checkOut: "jusqu'à 11:00",
    price: 483,
    paid: true,                     // réglé intégralement via Booking
    priceYen: 89590,
    refundable: false,
    cancelBefore: null,
    meals: null,
    amenities: { kitchen: false, washer: false, dryer: false, fridge: true, microwave: false, balcony: false, ac: true },
    bath: 'Baignoire + douche, salle de bains privative',
  },

  'Center Point In Kanazawa': {
    room: 'Appartement entier',
    size: 32,
    capacity: '2 adultes',
    address: '幸町 3-36, Kanazawa, Ishikawa',
    checkIn: '15:00 – 20:00',       // fenêtre courte : arriver avant 20h
    checkOut: '06:00 – 11:00',
    price: 164,
    paid: false,
    priceYen: 30400,
    refundable: true,
    cancelBefore: null,
    meals: null,
    amenities: { kitchen: true, washer: true, dryer: true, fridge: true, microwave: true, balcony: false, ac: true },
    bath: 'Douche ou baignoire, salle de bains privative',
  },

  'Matatabi Stay Nishinokyo': {
    room: 'Appartement entier',
    size: 15,
    capacity: '2 adultes',
    address: '中京区西ノ京池ノ内町 16-8, Kyoto',
    checkIn: '16:00 – 00:00',
    checkOut: "00:00 – 10:00",
    price: 678,
    paid: true,
    priceYen: 125873,
    refundable: false,
    cancelBefore: null,
    meals: null,
    amenities: { kitchen: false, washer: true, dryer: false, fridge: true, microwave: true, balcony: false, ac: true },
    bath: 'Douche ou baignoire, salle de bains privative',
  },

  '川HOUSE Kuromon': {
    bookingName: '川HOUSE黒門',
    room: 'Appartement entier',
    size: null,                     // non communiquée par l'établissement
    capacity: '2 adultes',
    address: '大阪市浪速区日本橋東 1-1-1, Osaka',
    checkIn: '16:00 – 00:00',
    checkOut: '00:00 – 10:00',
    price: 159,
    paid: false,
    priceYen: 29426,
    refundable: true,
    cancelBefore: null,
    meals: null,
    amenities: { kitchen: true, washer: true, dryer: false, fridge: true, microwave: true, balcony: true, ac: true },
    bath: 'Douche ou baignoire, salle de bains privative',
  },

  'Hananoyado Fukuya': {
    room: "Chambre attribuée à l'arrivée, avec baignoire en plein air",
    size: 42,
    capacity: '2 adultes',
    address: 'Hakone 571-18, Kanagawa',
    checkIn: '15:00 – 18:00',       // ⚠ le plus contraignant du voyage
    checkOut: "jusqu'à 11:00",
    price: 1231,
    paid: false,
    priceYen: 228000,
    refundable: true,
    cancelBefore: '2026-10-27',     // gratuit jusqu'au 27/10 23:59, ferme ensuite
    // Confirmé par échange avec le ryokan : demi-pension, dîner kaiseki servi
    // à 18:30 les deux soirs, aucune allergie signalée.
    meals: 'Demi-pension · dîner kaiseki à 18:30 les deux soirs, petit-déjeuner compris',
    // L'arrivée a son protocole, donné par le ryokan. C'est le seul hébergement
    // du voyage qu'on ne rejoint pas seul : à noter avant de perdre le réseau.
    arrivee: 'Arrivée annoncée entre 14:30 et 15:00 au port de Moto-Hakone. Appeler le ryokan depuis le 7-Eleven, comme indiqué — ils viennent chercher. En cas de retard de train, prévenir avant 17:00.',
    amenities: { kitchen: false, washer: false, dryer: false, fridge: true, microwave: false, balcony: false, ac: true },
    bath: 'Baignoire en plein air privative · tatami · vue lac',
  },

  'La Vita Ikebukuro Residence': {
    bookingName: 'La Vita 池袋 Residence',
    room: 'Appartement entier',
    size: 24,
    capacity: '2 adultes',
    address: '東京都豊島区千早一丁目 22-3, Tokyo',
    checkIn: 'à partir de 16:00',
    checkOut: "jusqu'à 10:00",
    price: 544,
    paid: false,
    priceYen: 100916,
    refundable: true,
    cancelBefore: null,
    meals: null,
    amenities: { kitchen: true, washer: true, dryer: false, fridge: true, microwave: true, balcony: true, ac: true },
    bath: 'Douche ou baignoire, salle de bains privative',
  },
};

// Libellés des équipements, pour que les six fiches affichent les mêmes lignes.
export const AMENITY_LABELS = {
  kitchen: 'Cuisine',
  washer: 'Lave-linge',
  dryer: 'Sèche-linge',
  fridge: 'Réfrigérateur',
  microwave: 'Micro-ondes',
  balcony: 'Balcon',
  ac: 'Climatisation',
};
