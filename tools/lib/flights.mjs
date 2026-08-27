// Les vols, en données plutôt qu'en phrase.
//
// L'ancien site n'avait qu'une ligne de texte — impossible d'en faire autre
// chose qu'un tableau. Découpés en segments, ils se dessinent comme un vrai
// itinéraire : trois aéroports, deux vols, une escale.

export const FLIGHTS = [
  {
    id: 'aller',
    label: 'Aller',
    date: '2026-11-08',
    airline: 'China Eastern',
    legs: [
      { from: 'CDG', fromCity: 'Paris',    depart: '20:05', to: 'PVG', toCity: 'Shanghai', arrive: '14:20', dayShift: 1, flight: 'MU 570', duration: '11h15' },
      { from: 'PVG', fromCity: 'Shanghai', depart: '17:10', to: 'HND', toCity: 'Tokyo',    arrive: '20:50', dayShift: 1, flight: 'MU 575', duration: '2h40' },
    ],
    layover: { at: 'Shanghai Pudong', duration: '2h50' },
    total: 'CDG 20:05 → HND 20:50 le lendemain',
  },
  {
    id: 'retour',
    label: 'Retour',
    date: '2026-12-02',
    airline: 'China Eastern',
    legs: [
      { from: 'HND', fromCity: 'Tokyo',    depart: '20:15', to: 'PVG', toCity: 'Shanghai', arrive: '23:00', dayShift: 0, flight: 'MU 540', duration: '3h45' },
      { from: 'PVG', fromCity: 'Shanghai', depart: '00:35', to: 'CDG', toCity: 'Paris',    arrive: '06:00', dayShift: 1, flight: 'MU 553', duration: '13h25' },
    ],
    layover: { at: 'Shanghai Pudong', duration: '1h35' },
    total: 'HND 20:15 → CDG 06:00 le lendemain',
  },
];
