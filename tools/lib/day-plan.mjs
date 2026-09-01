// Réécriture de journées entières, par DATE.
//
// POURQUOI CE FICHIER EXISTE
// Le billet du Nintendo Museum est daté : mercredi 18 novembre, 14:00–14:30, à
// Ogura (Uji). Or le 18 était la journée Arashiyama — l'extrême OUEST de Kyoto,
// à 1h15 du musée. Impossible de tenir les deux.
//
// Plutôt que de caser le musée en biais dans une journée qui part à l'ouest, on
// a recalé les journées de Kyoto pour qu'une journée = un secteur, sans allers-
// retours :
//   17 nov  est / sud-est   Fushimi Inari, Higashiyama, Tofuku-ji  (inchangé)
//   18 nov  sud             Uji : Byodo-in, la ruelle du thé, le musée à 14h
//   19 nov  est / nord-est  chemin de la philosophie, puis Rurikō-in
//   20 nov  nord-ouest      Kinkaku-ji, Ryoan-ji, Ninna-ji, Kitano Tenmangu
//   21 nov  ouest           Arashiyama (et le marché Kobo-san à l'ouverture)
//
// Deux corrections viennent avec :
//   · Kinkaku-ji était rangé dans la journée Arashiyama alors qu'il est au
//     nord-ouest, à côté de Ryoan-ji et Ninna-ji. Il rejoint le 20.
//   · Rurikō-in est à Yase, sur la ligne Eizan, au départ de Demachiyanagi :
//     c'est la même ligne que la journée du chemin de la philosophie. Il
//     rejoint le 19.
//
// La journée « libre » du 21 disparaît : elle était déjà remplie de rendez-vous
// fixes (le marché Kobo-san qui n'a lieu que le 21, Rurikō-in sur réservation,
// le dîner de la guide à Gion). Arashiyama tombe donc un samedi — le seul coût
// de l'opération, et la raison pour laquelle la bambouseraie passe à 7h30.
//
// `items` remplace INTÉGRALEMENT la journée : les lignes de
// day-additions.json pour ces jours-là sont ignorées.

export const DAY_PLAN = {
  '2026-11-18': {
    title: 'Uji : le matcha, puis Nintendo',
    items: [
      { text: 'Byodo-in dès l’ouverture (8h30) : le pavillon du Phénix sur son étang, celui de la pièce de 10 yens. Intérieur du Hoodo en supplément, par créneaux de 20 min' },
      { text: '10h pile — prendre le ticket QR chez Nakamura Tokichi (1854). On ne fait pas la queue debout : on est rappelé plus tard, et ça peut monter à 2 h en automne' },
      { text: 'Ujigami-jinja à 10 min à pied, la plus vieille architecture de sanctuaire debout au Japon' },
      { text: 'Ruelle du thé Byodo-in Omotesando en attendant d’être appelés' },
      { text: 'Matcha chez Nakamura Tokichi quand le tour arrive — et sinon, tant pis : le créneau du musée ne se rattrape pas' },
      { text: '⏰ 14:00 — Nintendo Museum, gare d’Ogura. Billets payés, créneau ferme : 14:00 – 14:30' },
      { text: 'Retour à Kyoto en 25 min par la ligne JR Nara', evening: true },
      { text: 'Soir : dîner libre autour de Nishinokyo, journée déjà bien remplie', evening: true },
    ],
    tip: '💡 Toute la journée tient sur la même ligne : Uji le matin, Ogura l’après-midi. Un seul piège — Nakamura Tokichi peut faire attendre 2 h. Prendre le ticket à 10h et visiter Byodo-in pendant ce temps ; si l’appel tombe après 13h, on laisse tomber le thé. Le billet du musée ne vaut plus rien passé 14:30.',
  },

  '2026-11-19': {
    title: 'Le chemin de la philosophie',
    items: [
      { text: 'Nanzen-ji et son aqueduc, puis le chemin au fil de l’eau' },
      { text: 'Honen-in, Ginkaku-ji — le pavillon d’argent' },
      { text: 'Konkai Komyo-ji (Kurodani) en chemin : immense, gratuit, presque personne' },
      { text: 'Déjeuner dans un café au fil de l’eau, le long du chemin' },
      { text: 'Rurikō-in : le reflet des érables sur la table laquée. Ligne Eizan depuis Demachiyanagi, à deux pas du chemin (résa obligatoire)' },
      { text: 'Soir : illuminations d’Eikan-do, LE moment momiji du voyage', evening: true },
      { text: 'Soir : yudofu ou obanzai chaud après les illuminations', evening: true },
    ],
    tip: '💡 Rurikō-in et le chemin de la philosophie sont sur le même axe nord-est : la ligne Eizan part de Demachiyanagi, au bout du chemin. À réserver, le créneau se remplit en novembre.',
  },

  '2026-11-20': {
    title: 'Kyoto nord-ouest',
    items: [
      { text: 'Kinkaku-ji, le pavillon d’or, à l’ouverture — puis Ryoan-ji à 15 min à pied' },
      { text: 'Ninna-ji ou Daitoku-ji, monastères au calme' },
      { text: 'Kitano Tenmangu et son Momiji-en, jardin d’érables ouvert seulement en automne (thé et wagashi inclus)' },
      { text: 'Déjeuner : Honke Owariya (1465) a fermé en janvier 2026 — le nishin soba se mange chez Matsuba, à Gion, là où il a été inventé en 1882' },
      { text: 'Marché Nishiki en fin d’après-midi : tsukemono, tamagoyaki, thé' },
      { text: 'Balade le long de la Kamogawa avant Pontocho' },
      { text: 'Soir : Pontocho, la ruelle des lanternes', evening: true },
      { text: 'Soir : glace kinako chez Gion Kinana, planquée dans Gion', evening: true },
    ],
    tip: '💡 Kinkaku-ji, Ryoan-ji, Ninna-ji et Kitano Tenmangu tiennent dans une seule boucle : ils sont alignés sur la même ligne de bus. Kinkaku-ji d’abord, c’est le plus pris d’assaut.',
  },

  '2026-11-21': {
    title: 'Arashiyama, dans l’ordre',
    items: [
      { text: 'C’est le 21 : marché Kobo-san au To-ji dès l’ouverture, l’immense brocante mensuelle — puis train pour Arashiyama' },
      { text: 'Bambouseraie à 7h30 si vous sautez le marché : c’est un samedi, elle sera prise dès 9h' },
      { text: 'Tenryu-ji, puis déjeuner tôt au bord de la rivière' },
      { text: 'Pont Togetsukyo → singes → forêt de kimonos' },
      { text: 'Otagi Nenbutsu-ji et ses 1 200 statues moussues, Arashiyama sans la foule' },
      { text: 'Jojakko-ji à flanc de colline, vue sur Kyoto entre les érables' },
      { text: 'Villa Okochi Sanso si le temps le permet', evening: true },
      { text: 'Soir : Kimono Forest à la gare Randen, colonnes lumineuses au retour', evening: true },
      { text: 'Dîner : le kaiseki ou l’obanzai pas encore fait', evening: true },
    ],
    tip: '💡 L’ordre exact de la guide. Son déjeuner au bord de la rivière — y être avant midi. Samedi de pic momiji : soit le marché Kobo-san le matin et Arashiyama vers 10h, soit la bambouseraie à 7h30 et pas de marché. Les deux à fond, non.',
  },
};
