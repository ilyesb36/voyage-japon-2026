// Corrections vérifiées sur sources officielles le 27 août 2026.
//
// Les tarifs venaient de l'ancien site et dataient de 2024. Plusieurs lieux
// ont augmenté depuis, et surtout : plusieurs temples de Kyoto appliquent un
// TARIF D'AUTOMNE plus élevé, exactement pendant le séjour.
//
// La clé est le `name` tel qu'il apparaît dans data/spots.js.

export const SPOT_FIXES = {
  // --- erreur de lieu, pas de tarif -----------------------------------------
  'teamLab Botanical Garden': {
    cityId: 'osaka',
    blurb: 'jardin botanique de Nagai transformé la nuit — c\'est à Osaka, pas à Tokyo',
    budget: '1 800 ¥ · résa',
    note: "L'ancien site le rangeait à Tokyo. Le teamLab Botanical Garden est à Nagai, Osaka ; à Tokyo il y a Planets (Toyosu) et Borderless (Azabudai).",
  },

  // --- hausses confirmées ---------------------------------------------------
  'Château d’Osaka': {
    budget: '1 200 ¥',
    note: 'Tarif doublé le 1er avril 2025 (600 → 1 200 ¥).',
  },
  'Shibuya Sky': {
    budget: '2 700–3 400 ¥ en ligne',
    when: 'créneau coucher de soleil, à réserver',
    note: 'Plus cher à partir de 15h. Se vend souvent à l\'avance.',
  },
  'teamLab Planets': {
    budget: '3 600–5 600 ¥',
    note: 'Tarification dynamique par créneau.',
  },
  'teamLab Borderless': {
    budget: '3 600–5 600 ¥',
    note: 'Tarification dynamique par créneau.',
  },
  'Aquarium Kaiyukan': {
    budget: '2 400–2 700 ¥',
    note: 'Dynamique : plutôt 2 400 ¥ en semaine.',
  },

  // --- tarifs d'automne : ils tombent pendant le séjour ---------------------
  'Eikan-do': {
    budget: '1 500 ¥ (automne) · 1 000 ¥ la nuit',
    when: 'illuminations, billet de nuit séparé',
    note: 'Exposition d\'automne du 11 nov au 6 déc ; illumination du 20 nov au 10 déc, billet distinct.',
  },
  'Enko-ji': {
    budget: '1 500 ¥ en automne · résa obligatoire',
    when: 'réservation de créneau indispensable',
    note: 'Hors saison 600 ¥. En novembre, créneau à réserver.',
  },
  'Tofuku-ji': {
    budget: '1 000 ¥ (automne)',
    when: 'ouvre à 8h30 en saison — y être tôt',
    note: 'Du 15 nov au 7 déc. Le billet combiné est suspendu pendant l\'automne.',
  },
  'Genko-an': {
    budget: '500 ¥ en novembre',
    note: '400 ¥ le reste de l\'année.',
  },
  'Rurikō-in': {
    budget: '2 000 ¥ · résa créneau',
    when: 'ouvert seulement en automne, sur réservation',
    note: 'Ouverture d\'automne uniquement, environ du 1er octobre au 10 décembre.',
  },
  'Rikugi-en': {
    budget: '300 ¥ · 1 200 ¥ l\'illumination',
    when: 'illuminations fin novembre, billet séparé',
    note: 'Le jardin ferme à 17h puis rouvre pour l\'illumination, avec un billet distinct.',
  },
  'Kodai-ji': {
    budget: '600 ¥ · 600 ¥ la nuit',
    when: 'illumination jusqu\'à 22h',
    note: 'Billet de nuit séparé de celui de la journée.',
  },
  'Koishikawa Korakuen': {
    budget: '300 ¥',
  },
  'Kenroku-en illuminé': {
    budget: 'gratuit',
    when: 'vendredis et samedis soir jusqu\'à fin novembre',
    note: 'L\'illumination d\'automne de Kenroku-en est gratuite.',
  },
  'Château de Nijō': {
    budget: '1 300 ¥',
    note: 'Comprend le palais Ninomaru. Le palais Honmaru demande un billet et une réservation à part.',
  },
  'Temple ninja (Myoryu-ji)': {
    budget: '1 200 ¥ · résa téléphonique',
    note: 'Réservation obligatoire par téléphone, paiement en espèces uniquement.',
  },
  'Musée du 21e siècle': {
    budget: '450 ¥ + expos',
    note: 'Les expositions temporaires ont un tarif distinct. Les espaces publics sont gratuits.',
  },
};
