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

  '2026-11-20': {
    // L'illumination d'Eikan-do commence le 20 novembre : elle était programmée
    // le 19, soit la veille de l'ouverture. Le 19 et le 20 sont donc échangés —
    // la journée reste la bonne (Eikan-do est sur le chemin de la philosophie),
    // c'est la date qui était fausse d'un jour.
    title: 'Le chemin de la philosophie',
    items: [
      { text: 'Nanzen-ji et son aqueduc, puis le chemin au fil de l’eau' },
      { text: 'Honen-in, Ginkaku-ji — le pavillon d’argent' },
      { text: 'Konkai Komyo-ji (Kurodani) en chemin : immense, gratuit, presque personne' },
      { text: 'Déjeuner dans un café au fil de l’eau, le long du chemin' },
      { text: 'Rurikō-in : le reflet des érables sur la table laquée. Ligne Eizan depuis Demachiyanagi, à deux pas du chemin (résa obligatoire)' },
      { text: 'Soir : illuminations d’Eikan-do, LE moment momiji du voyage — c’est le premier soir de la saison, elle ouvre ce 20 novembre', evening: true },
      { text: 'Soir : yudofu ou obanzai chaud après les illuminations', evening: true },
    ],
    tip: '💡 Rurikō-in et le chemin de la philosophie sont sur le même axe nord-est : la ligne Eizan part de Demachiyanagi, au bout du chemin. Billet d’Eikan-do de nuit distinct de celui du jour, à prendre sur place — arriver avant l’ouverture à 17h30, le premier soir attire du monde.',
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

  // --- corrections issues de l'audit du 1er septembre 2026 -------------------

  '2026-11-09': {
    // Le Tokyo Monorail va à Hamamatsucho, pas vers Asakusa : c'est le Keikyu
    // qui rejoint la ligne Asakusa sans changement. Premier trajet du voyage,
    // à 21h, fatigués — ce n'est pas le moment de se tromper de quai.
    items: [
      { text: 'Atterrissage Haneda 20:50 — immigration, puis activation de l’eSIM avant de sortir' },
      { text: 'Keikyu Airport Line, direct sur la ligne Asakusa jusqu’à Hop Inn (~40 min). Pas le monorail : il va à Hamamatsucho' },
      { text: 'Retirer du cash au 7-Eleven en bas (ATM 24h/24, accepte les cartes étrangères)', evening: true },
      { text: 'Konbini pour le petit-déjeuner du lendemain', evening: true },
      { text: 'Coup d’œil au Senso-ji illuminé de nuit, à deux pas de l’hôtel', evening: true },
    ],
    tip: '💡 Arrivée à l’hôtel vers 22h–22h30. Rien d’autre n’est prévu, et c’est voulu.',
  },

  '2026-11-30': {
    // Le 30 novembre est un LUNDI. Les jardins de l'enceinte impériale (le site
    // du château d'Edo) ferment le lundi ET le vendredi ; le parc de
    // Kitanomaru, lui, est un parc public ouvert tous les jours. La ligne
    // d'origine mélangeait les deux.
    items: [
      { text: '⚠ Lundi : les jardins de l’enceinte impériale (site du château d’Edo) sont fermés le lundi et le vendredi. Le parc de Kitanomaru, lui, est ouvert' },
      { text: 'Parc de Kitanomaru : le Budokan, le musée d’art moderne, les douves' },
      { text: 'Gotoku-ji et ses milliers de chats porte-bonheur, à l’ouest' },
      { text: 'Déjeuner dans le quartier de Setagaya, sans se presser' },
      { text: 'Todoroki, la seule gorge de Tokyo — le sentier a rouvert en mars 2026' },
      { text: 'Kameido Tenjin et son pont rouge, si l’envie de traverser la ville est là', evening: true },
      { text: 'Soir : dernier izakaya, on est à deux jours du départ', evening: true },
    ],
    tip: '💡 Gotoku-ji à l’ouest et Kameido à l’est, ce sont deux bouts opposés de Tokyo : une heure de train entre les deux. Choisir l’un OU l’autre, sauf à vouloir passer la journée assis.',
  },

  '2026-12-01': {
    items: [
      { text: 'Tokyo Character Street sous la gare de Tokyo : Ghibli, Nintendo, Sanrio' },
      { text: 'Musée Ghibli si vous avez eu les billets — il rouvre le 19 novembre, après une fermeture du 4 au 18' },
      { text: 'Itoya Ginza, papeterie sur huit étages depuis 1904' },
      { text: '⚠ Détaxe : depuis le 1er novembre 2026, on paie le prix TTC en magasin et on se fait rembourser à Haneda. Garder les tickets ET les articles' },
      { text: 'Don Quijote : skincare Matsukiyo, KitKat, snacks. Passeport sur soi, seuil 5 000 ¥ par magasin' },
      { text: 'Illumination de Rikugi-en : le jardin ferme à 17h puis rouvre, billet séparé', evening: true },
      { text: 'Pesée des valises, envoi takkyubin éventuel', evening: true },
    ],
    tip: '💡 Tout ce qui est acheté aujourd’hui devra être présentable demain matin au comptoir de remboursement : ne pas le mettre au fond de la valise en soute.',
  },

  '2026-12-02': {
    items: [
      { text: 'Check-out à 10h — laisser les valises à l’hôtel ou en casier de gare : le vol n’est qu’à 20:15' },
      { text: 'Matinée légère dans Ikebukuro, sans rien de lourd' },
      { text: 'Déjeuner tôt, puis récupération des bagages' },
      { text: 'Départ pour Haneda vers 15h — Keikyu depuis la ligne Asakusa' },
      { text: 'Comptoir de remboursement de la détaxe AVANT l’enregistrement : tickets et articles à portée de main' },
      { text: 'Vol 20:15', evening: true },
    ],
    tip: '💡 Gardez ~2 000 ¥ pour le dernier ramen à l’aéroport. Le remboursement de la détaxe se fait à Haneda, avant l’enregistrement : c’est la première chose à faire en arrivant, pas la dernière.',
  },

  '2026-11-25': {
    // Confirmé par échange avec le ryokan : arrivée 14:30-15:00 au port,
    // appel depuis le 7-Eleven, dîner à 18:30 les deux soirs. C'est le seul
    // hébergement du voyage qu'on ne rejoint pas tout seul.
    items: [
      { text: 'Shinkansen Hikari → Odawara (~2h15). Kamaboko d’Odawara à grignoter en gare avant le bus' },
      { text: 'Faire suivre les valises depuis la gare de Yumoto : la suite se fait en bus et en bateau' },
      { text: 'Bus Tozan → port de Moto-Hakone, arrivée annoncée entre 14:30 et 15:00' },
      { text: '☎ Appeler le ryokan depuis le 7-Eleven du port, comme convenu — ils viennent chercher. Retard de train : prévenir avant 17:00' },
      { text: 'Check-in : yukata, thé, premier bain avant la nuit' },
      { text: 'Torii de Hakone-jinja les pieds dans le lac, à deux pas du ryokan' },
      { text: 'Dîner kaiseki en chambre à 18:30 — le grand soir du voyage', evening: true },
      { text: 'Bain extérieur privatif une seconde fois, la nuit tombée', evening: true },
    ],
    tip: '💡 Le check-in du Fukuya est la contrainte la plus serrée du voyage : 15:00 – 18:00, pas après. L’appel depuis le 7-Eleven n’est pas une option, c’est comme ça qu’on est récupéré.',
  },
};
