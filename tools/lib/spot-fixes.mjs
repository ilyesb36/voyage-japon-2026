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
    budget: '1 200 ¥',
    when: 'réservation obligatoire, par téléphone',
    note: 'Réservation obligatoire par téléphone, paiement en espèces uniquement. Créneaux courts et peu nombreux : à caler bien avant le départ.',
  },
  'Musée du 21e siècle': {
    budget: '450 ¥ + expos',
    note: 'Les expositions temporaires ont un tarif distinct. Les espaces publics sont gratuits.',
  },

  // --- réservé et payé -------------------------------------------------------
  'Nintendo Museum, Uji': {
    budget: '3 300 ¥ / personne · payé',
    duration: '2–3h',
    when: 'mercredi 18 novembre, 14:00 – 14:30',
    blurb: 'ouvert fin 2024 dans une ancienne usine de cartes à jouer Nintendo, à Ogura',
    note: 'Billets achetés et payés : mercredi 18 novembre 2026, créneau 14:00 – 14:30, 2 adultes. Le tirage au sort est derrière nous. Créneau ferme, pièce d\'identité contrôlée.',
  },

  // --- vérifications du 1er septembre 2026 -----------------------------------
  // Rapport complet : tools/lib/verifs-2026-09.md
  'Honke Owariya': {
    priority: 'niche',
    when: 'FERMÉ — ne pas s’y rendre',
    budget: '—',
    blurb: 'soba depuis 1465, fermé en janvier 2026 après 561 ans',
    note: '⚠ FERMÉ. Le restaurant de Kurumaya-cho a cessé son activité le 11 janvier 2026, noren déposé le 17. Les confiseries sont arrêtées aussi, la boutique en ligne ne rouvre pas. Retiré du programme du 20 novembre.',
  },
  'Todoroki, la vallée': {
    when: 'rouvert — le matin, avant la chaleur',
    note: 'Le sentier, fermé depuis septembre 2023 après une chute d’arbre, a rouvert le 24 mars 2026.',
  },
  'Musée Ghibli': {
    when: '⚠ fermé du 4 au 18 novembre — à garder pour le retour à Tokyo',
    note: 'Fermeture annoncée du 4 au 18 novembre 2026 (changement d’exposition), réouverture le 19. Le premier séjour à Tokyo (9–14 nov) tombe en plein dedans : c’est donc pour le second, du 27 novembre au 2 décembre. Billets en vente le 10 du mois précédent, ils partent en quelques minutes.',
  },
  'Nakamura Tokichi': {
    when: 'ticket QR dès 10h, on est rappelé plus tard',
    note: 'Maison de thé fondée en 1854. Pas de file debout : on prend un ticket numéroté à QR dès l’ouverture (10h) et on revient quand on est appelé — jusqu’à 2 h d’attente en pleine saison d’automne.',
  },
  'Byodo-in': {
    budget: '700 ¥ · +300 ¥ l’intérieur du Hoodo',
    when: 'ouvre à 8h30 ; Hoodo par créneaux de 20 min',
    note: 'Jardin et musée Hoshokan 700 ¥ (8h30–17h30). L’intérieur du pavillon du Phénix se paie à part (300 ¥), par créneaux de 20 minutes de 9h30 à 16h10, 50 personnes à la fois, commentaire en japonais.',
  },
  'Rurikō-in': {
    budget: '2 000 ¥ · résa créneau',
    when: 'ouverture d’automne jusqu’au 13 décembre, sur réservation',
    note: 'Ouvert du 1er octobre au 13 décembre 2026, 10h–17h. Depuis Demachiyanagi : ligne Eizan jusqu’à Yase-Hieizanguchi, 14 min, puis 5 à 12 min à pied.',
  },

  // --- photo d'homonyme -------------------------------------------------------
  // La recherche d'images avait ramené le Kimono Forest (les colonnes de tissu
  // de la gare Randen) pour « Kimono à Higashiyama », qui est une balade en
  // tenue. Les deux entrées se partageaient donc la même photo, juste pour
  // l'une des deux. Le garde-fou `mustMatch` ne pouvait pas voir la différence :
  // les deux noms contiennent « kimono ».
  'Kimono à Higashiyama': {
    img: 'img/kimono-higashiyama-alt-088810eb.webp',
  },

  // --- rangé sous la mauvaise ville ------------------------------------------
  'Yuba de Nikko': {
    cityId: 'tokyo',
    area: 'nikko',
    maps: 'https://www.google.com/maps/search/?api=1&query=yuba%20Nikko%20Japon',
    note: 'La yuba est la spécialité des moines de Nikko, pas de Hakone : l’ancien site la rangeait sous Hakone et le lien Maps cherchait « Yuba de Nikko Hakone ». Nikko se fait à la journée depuis Tokyo, comme les autres lieux de l’excursion.',
  },

  // --- reclassements ---------------------------------------------------------
  "Chinatown": { priority: "symp", note: 'Reclassé : sous-étape d’un day trip, pas une destination en soi.' },

  // --- date retirée faute de source ------------------------------------------
  'Wanaka': {
    blurb: 'takoyaki à Sennichimae, une institution du quartier',
    note: "Le site d'origine annonçait « depuis 1938 » : les sources japonaises ne le confirment pas (l'échoppe dédiée au takoyaki daterait de 1986). Date retirée plutôt que reprise.",
  },
};
