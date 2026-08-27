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
    title: 'Visit Japan Web',
    what: "Pré-enregistrement immigration et douane. On remplit en ligne, on obtient deux QR codes à présenter à l'arrivée — ça évite les formulaires papier et la file.",
    when: 'Dans les jours avant le départ',
    url: 'https://services.digital.go.jp/en/visit-japan-web/',
    tag: 'Obligatoire en pratique',
  },
  {
    id: 'esim',
    title: 'eSIM',
    what: "À commander avant de partir et à activer une fois posés à Haneda. Compter 10–25 € pour 20 jours de data. Le wifi des konbini dépanne, mais pas pour naviguer.",
    when: 'Une semaine avant',
    tag: null,
  },
  {
    id: 'suica',
    title: 'Suica dans le Wallet',
    what: "Sur iPhone, la Suica s'ajoute directement dans Wallet et se recharge à la carte bancaire — pas besoin de passer par un guichet. Elle sert au métro, aux trains locaux, aux konbini et aux casiers de gare.",
    when: 'Avant de partir',
    tag: null,
  },
  {
    id: 'cartes',
    title: 'Cartes hors-ligne',
    what: "Télécharger les zones Tokyo, Kyoto, Osaka, Kanazawa et Hakone dans Google Maps. Le site aussi fonctionne hors-ligne — le bouton est sur la page Pratique.",
    when: 'Avant de partir',
    tag: null,
  },
  {
    id: 'pass',
    title: 'Les pass à acheter à l\'avance',
    what: "Hakone Freepass (2 jours depuis Odawara) et Nikko Pass World Heritage. Pas de JR Pass : sur cet itinéraire, les billets à l'unité reviennent moins cher.",
    when: 'Avant de partir',
    tag: null,
  },
  {
    id: 'especes',
    title: 'Espèces',
    what: "Le Japon reste très liquide : petits restaurants, temples, marchés. Les distributeurs des 7-Eleven et de la Japan Post acceptent les cartes étrangères, 24h/24. Prévoir du liquide dès l'aéroport.",
    when: 'Sur place',
    tag: null,
  },
  {
    id: 'prise',
    title: 'Adaptateur type A',
    what: "Prises à deux lames plates, 100 V. La plupart des chargeurs récents encaissent le 100 V sans transformateur — vérifier la mention « 100–240 V » sur le bloc.",
    when: 'Dans la valise',
    tag: null,
  },
]);

export const SURPLACE = Object.freeze([
  {
    title: 'Détaxe',
    what: "Passeport sur soi, à partir de 5 000 ¥ d'achat dans un même magasin.",
    warn: "Le Japon a annoncé le passage à un remboursement au départ de l'aéroport à partir de novembre 2026 — soit pendant votre séjour. À revérifier avant de partir : mes informations s'arrêtent à mai 2026.",
    check: true,
  },
  {
    title: 'Urgences',
    what: 'Police 110 · Pompiers et ambulance 119. Gratuit depuis n\'importe quel téléphone.',
  },
  {
    title: 'Pas de poubelles',
    what: "Presque aucune poubelle dans la rue. On garde ses déchets sur soi jusqu'à un konbini ou l'hôtel.",
  },
  {
    title: 'Pas de pourboire',
    what: "Jamais, nulle part. Laisser de la monnaie met mal à l'aise.",
  },
  {
    title: 'Faire suivre les valises',
    what: "Le takkyubin envoie les bagages d'un hôtel au suivant pour ~2 000 ¥ la pièce, livrés le lendemain. Utile avant Hakone : le ryokan se rejoint en bus et en bateau.",
  },
  {
    title: 'La nuit tombe tôt',
    what: "Coucher de soleil vers 16h35 à Tokyo à la mi-novembre, 16h30 début décembre. Les temples ferment souvent à 16h30 ou 17h. Commencer tôt.",
  },
]);

// Normales de saison, en °C. Sert à savoir quoi mettre dans la valise,
// pas à prévoir le temps qu'il fera.
export const METEO = Object.freeze({
  tokyo:    { max: 17, min: 9,  note: 'doux en journée, frais le soir' },
  kanazawa: { max: 15, min: 8,  note: 'la côte de la mer du Japon : prévoir la pluie' },
  kyoto:    { max: 17, min: 7,  note: 'bassin fermé, matins froids' },
  osaka:    { max: 18, min: 9,  note: 'la plus douce des cinq' },
  hakone:   { max: 12, min: 4,  note: '720 m d\'altitude : une couche de plus' },
});
