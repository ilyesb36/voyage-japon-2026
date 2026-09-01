// Réservations à date et heure fixes, payées.
//
// Ce ne sont pas des « idées » du guide : ce sont des rendez-vous. Elles
// contraignent la journée autour d'elles, donc elles remontent sur la page
// Aujourd'hui et sur le jour concerné.

export const RESERVATIONS = [
  {
    id: 'resa-nintendo',
    title: 'Nintendo Museum',
    where: 'Ogura, Uji',
    date: '2026-11-18',
    slot: '14:00 – 14:30',
    people: 2,
    price: 38,               // 2 × 3 300 ¥
    priceYen: 6600,
    status: 'payé',
    spotId: 'spot-nintendo-museum-uji',
    // Ce qu'il faut savoir le jour même, pas au moment de réserver.
    notes: [
      'Créneau d’entrée ferme : 14:00 – 14:30. Passé l’horaire, le billet ne vaut plus.',
      'Billets nominatifs : pièce d’identité contrôlée à l’entrée, pour vous deux.',
      'À 5 min à pied de la gare Ogura (Kintetsu, ligne de Kyoto) ou 8 min de la gare JR Ogura (ligne de Nara).',
      'Interdit d’arriver en voiture, en taxi, à moto ou à vélo — transports en commun uniquement.',
      'Les bornes interactives coûtent des jetons, distribués en nombre limité à l’entrée : on ne fait pas tout en une visite.',
      'Fermé le mardi. Le mardi 17 novembre n’est pas férié, donc pas de report : c’est bien le mercredi 18.',
    ],
    // Le trajet réel depuis Kyoto, pour calibrer la journée.
    access: 'Depuis Kyoto : métro Karasuma jusqu’à Takeda, puis Kintetsu jusqu’à Ogura — ou la ligne JR Nara jusqu’à JR Ogura. Environ 25 min, puis 5 à 8 min à pied. Vérifié le 1er septembre 2026.',
  },
];
