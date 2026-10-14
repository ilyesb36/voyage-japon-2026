// Données relevées sur les confirmations Booking, le 27 août 2026, et revues
// le 14 octobre 2026 avec les messages des hôtels et l'échéancier des paiements.
// Les adresses sont en japonais complet, telles que les hôtels les donnent :
// c'est ce qu'on montre à un chauffeur de taxi.
// Fichier tenu à la main : extract.mjs les fusionne dans HOTELS.
//
// NE JAMAIS AJOUTER ICI : numéro de réservation, code confidentiel, e-mail,
// numéro de fidélité, code de porte ou de boîte à clés, lien de pré-enregistrement
// (il porte le code de la réservation). Le site est public sur GitHub Pages. Ce fichier ne
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
    address: '〒111-0033 東京都台東区花川戸1-7-8',
    checkIn: '15:00 – 00:00',
    checkOut: "jusqu'à 11:00",
    price: 483,
    paid: true,                     // réglé intégralement via Booking
    priceYen: 89590,
    tel: '+81-3-3841-6031',
    refundable: false,
    cancelBefore: null,
    meals: null,
    amenities: { kitchen: false, washer: false, dryer: false, fridge: true, microwave: false, balcony: false, ac: true },
    bath: 'Baignoire + douche, salle de bains privative',
    arrivee: "Réception ouverte : on se présente au comptoir. La taxe de séjour n'est pas comprise dans le prix Booking, elle se règle à l'arrivée. Ménage tous les 4 jours.",
  },

  'Center Point In Kanazawa': {
    room: 'Appartement entier',
    size: 32,
    capacity: '2 adultes',
    address: '石川県金沢市幸町3-36',
    // Booking affiche 20:00, mais l'hôtel a écrit : personne après 19:00.
    checkIn: '15:00 – 19:00',
    checkOut: '06:00 – 11:00',
    price: 164,
    paid: false,
    debit: '2026-11-08',            // prélèvement automatique programmé par Booking
    priceYen: 30400,
    refundable: true,
    cancelBefore: null,
    meals: null,
    amenities: { kitchen: true, washer: true, dryer: true, fridge: true, microwave: true, balcony: false, ac: true },
    bath: 'Douche ou baignoire, salle de bains privative',
    arrivee: "Enregistrement autonome : l'hôtel envoie les instructions par la messagerie Booking. Personne sur place après 19:00 — en cas de retard, prévenir avant.",
  },

  'Matatabi Stay Nishinokyo': {
    room: 'Appartement entier',
    size: 15,
    capacity: '2 adultes',
    address: '〒604-8375 京都府京都市中京区西ノ京池ノ内町16-8',
    checkIn: '16:00 – 00:00',
    checkOut: "00:00 – 10:00",
    price: 678,
    paid: true,
    priceYen: 125873,
    refundable: false,
    cancelBefore: null,
    meals: null,
    // Micro-ondes et lave-linge (à pièces, avec séchage) sont partagés, au rez-de-chaussée.
    amenities: { kitchen: false, washer: true, dryer: true, fridge: true, microwave: true, balcony: false, ac: true },
    bath: 'Baignoire + douche, salle de bains privative',
    tel: '+81-50-6877-5947',        // urgences seulement ; sinon la messagerie Booking
    arrivee: "Numéro de chambre, clés et enregistrement en ligne (obligatoire) arrivent par la messagerie Booking, au plus tard à 10:00 le jour J. Gare de Nijō, 7 min à pied. Ne pas se fier à Street View, qui montre un autre immeuble. Ni cuisine ni vaisselle : micro-ondes et laverie partagés au rez-de-chaussée. Une serviette chacun, pas de change.",
  },

  '川HOUSE Kuromon': {
    bookingName: '川HOUSE黒門',
    room: 'Appartement entier',
    size: null,                     // non communiquée par l'établissement
    capacity: '2 adultes',
    address: '〒556-0006 大阪府大阪市浪速区日本橋東1丁目1-1',
    checkIn: '16:00 – 00:00',
    checkOut: '00:00 – 10:00',
    price: 159,
    paid: false,
    debit: '2026-11-05',
    priceYen: 29426,
    tel: '+81-70-8927-5779',        // 9:00 – 12:00, heure du Japon
    refundable: true,
    cancelBefore: null,
    meals: null,
    amenities: { kitchen: true, washer: true, dryer: false, fridge: true, microwave: true, balcony: true, ac: true },
    bath: 'Douche ou baignoire, salle de bains privative',
    arrivee: "Pré-enregistrement en ligne obligatoire pour les deux, passeport en main : sans lui, pas d'accès au logement. Le lien est dans la messagerie Booking de 川HOUSE黒門. L'hôte écrit la veille avec les instructions.",
  },

  'Hananoyado Fukuya': {
    room: "Chambre attribuée à l'arrivée, avec baignoire en plein air",
    size: 42,
    capacity: '2 adultes',
    address: '〒250-0521 神奈川県足柄下郡箱根町箱根571-18',
    checkIn: '15:00 – 18:00',       // ⚠ le plus contraignant du voyage
    checkOut: "jusqu'à 11:00",
    price: 1231,
    paid: false,
    debit: '2026-10-25',            // Revolut Pay, programmé par Booking
    priceYen: 228000,
    tel: '+81-460-86-2121',         // 9:00 – 18:00, heure du Japon
    refundable: true,
    cancelBefore: '2026-10-27',     // gratuit jusqu'au 27/10 23:59, ferme ensuite
    // Confirmé par échange avec le ryokan : demi-pension, dîner kaiseki servi
    // à 18:30 les deux soirs, aucune allergie signalée.
    meals: 'Demi-pension · dîner kaiseki à 18:30 les deux soirs, petit-déjeuner compris',
    // L'arrivée a son protocole, donné par le ryokan. C'est le seul hébergement
    // du voyage qu'on ne rejoint pas seul : à noter avant de perdre le réseau.
    arrivee: 'Arrivée annoncée entre 14:30 et 15:00 au port de Moto-Hakone. Appeler le ryokan depuis le 7-Eleven, comme indiqué — ils viennent chercher. En cas de retard de train, prévenir avant 17:00. Navette du ryokan de 14:30 à 18:00 ; passé 18:00, c’est une non-présentation. Taxe onsen de 600 ¥ à régler sur place.',
    amenities: { kitchen: false, washer: false, dryer: false, fridge: true, microwave: false, balcony: false, ac: true },
    bath: 'Baignoire en plein air privative · tatami · vue lac',
  },

  'La Vita Ikebukuro Residence': {
    bookingName: 'La Vita 池袋 Residence',
    room: 'Appartement entier',
    size: 24,
    capacity: '2 adultes',
    address: '〒171-0044 東京都豊島区千早1丁目22-3',
    checkIn: 'à partir de 16:00',
    checkOut: "jusqu'à 10:00",
    price: 544,
    paid: true,                     // réglé le 5 octobre 2026
    priceYen: 100916,
    refundable: true,
    cancelBefore: null,
    meals: null,
    amenities: { kitchen: true, washer: true, dryer: false, fridge: true, microwave: true, balcony: true, ac: true },
    bath: 'Douche ou baignoire, salle de bains privative',
    arrivee: "Métro Kanamecho, sortie 4 : à droite tout de suite, puis tout droit, à droite au carrefour ; l'immeuble noir sur la droite. Le code du portail est dans le PDF d'accès envoyé par l'hôte ; numéro de chambre et code de la boîte à clés arrivent 3 jours avant, le 24 novembre, par la messagerie Booking. Pas d'accueil sur place : ils ne réceptionnent pas de colis et ne gardent rien avant le jour d'arrivée (réponse du 14 octobre). Le jour même, un espace à bagages en libre accès près de l'entrée, avant 16:00 et après le départ (message du 17 août). Valises envoyées d'avance : au centre Yamato d'Ikebukuro-Ekimae, 2-39-7 Nishi-Ikebukuro, à y retirer soi-même.",
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
