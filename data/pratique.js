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
    deadline: '2026-11-05',
    title: 'Visit Japan Web',
    what: "Pré-enregistrement immigration et douane. On remplit en ligne, on obtient deux QR codes à présenter à l'arrivée — ça évite les formulaires papier et la file.",
    when: 'Dans les jours avant le départ',
    url: 'https://services.digital.go.jp/en/visit-japan-web/',
    tag: 'Obligatoire en pratique',
  },
  {
    id: 'esim',
    deadline: '2026-11-01',
    title: 'eSIM',
    what: "À commander avant de partir et à activer une fois posés à Haneda. Compter 10–25 € pour 20 jours de data. Le wifi des konbini dépanne, mais pas pour naviguer.",
    when: 'Une semaine avant',
    tag: null,
  },
  {
    id: 'suica',
    deadline: '2026-11-06',
    title: 'Suica dans le Wallet',
    what: "Sur iPhone, la Suica s'ajoute directement dans Wallet et se recharge à la carte bancaire — pas besoin de passer par un guichet. Elle sert au métro, aux trains locaux, aux konbini et aux casiers de gare.",
    when: 'Avant de partir',
    tag: null,
  },
  {
    id: 'cartes',
    deadline: '2026-11-06',
    title: 'Cartes hors-ligne',
    what: "Télécharger les zones Tokyo, Kyoto, Osaka, Kanazawa et Hakone dans Google Maps. Le site aussi fonctionne hors-ligne — le bouton est sur la page Pratique.",
    when: 'Avant de partir',
    tag: null,
  },
  {
    id: 'pass',
    deadline: '2026-11-01',
    canal: 'en ligne',
    url: 'https://www.hakonenavi.jp/international/en/discount_passes/free_pass',
    commentReserver: 'HAKONE FREEPASS : achat en ligne avant de partir sous forme de pass numérique (smartphone) via EMot Online Tickets (emot-tickets.jp) ou Klook. Tarifs 2026 depuis Shinjuku : 2 jours 7 100 ¥ / 3 jours 7 500 ¥ (depuis Odawara : 6 000 / 6 400 ¥). Le pass numérique s\'active dans l\'appli EMot, AUCUN bon papier à échanger ; à défaut, version papier à retirer via bon aux Odakyu Sightseeing Service Centers (Shinjuku/Odawara). NIKKO PASS WORLD HERITAGE AREA : 2 jours, 3 000 ¥ adulte / 1 500 ¥ enfant. Achat en ligne officiel via Tobu (https://www.tobu.co.jp/en/ticket/nikko/city.html) de J-90 à J-2, ou via Klook. La version papier s\'échange sur bon au Tobu Tourist Information Center d\'Asakusa ; une version numérique existe (même prix, sans échange).',
    title: 'Hakone Freepass et Nikko Pass',
    what: "Hakone Freepass (2 jours depuis Odawara) et Nikko Pass World Heritage. Pas de JR Pass : sur cet itinéraire, les billets à l'unité reviennent moins cher.",
    when: 'Avant de partir',
    tag: null,
  },
  {
    id: 'medicaments',
    deadline: '2026-10-15',
    title: 'Médicaments : la douane est stricte',
    what: "Le Japon interdit à l'importation la pseudoéphédrine (beaucoup de traitements du rhume) et la codéine. Au-delà d'un mois de traitement, ou pour tout produit sensible, il faut un certificat « Yakkan Shoumei », à demander par mail au moins deux semaines avant. Vérifier chaque boîte de la trousse.",
    when: 'Mi-octobre au plus tard',
    url: 'https://impconf.mhlw.go.jp/',
    tel: '+81-48-740-0800',
    commentReserver: "Demande en ligne sur le portail, ou par mail au bureau régional Kanto-Shinetsu (yakkan@mhlw.go.jp) pour une arrivée à Haneda. Compter au moins deux semaines.",
    hard: true,
    tag: 'Refoulé à la douane sinon',
  },
  {
    id: 'assurance',
    deadline: '2026-10-25',
    title: 'Assurance santé',
    what: "La carte européenne ne vaut rien au Japon : les soins sont payés d'avance, et une hospitalisation chiffre vite. Vérifier ce que couvre la carte bancaire — beaucoup de cartes premium incluent une couverture voyage, mais souvent limitée aux 90 premiers jours et sous conditions.",
    when: 'Avant de partir',
    tag: null,
  },
  {
    id: 'prise',
    deadline: '2026-11-07',
    title: 'Adaptateur type A',
    what: "Prises à deux lames plates, 100 V. La plupart des chargeurs récents encaissent le 100 V sans transformateur — vérifier la mention « 100–240 V » sur le bloc.",
    when: 'Dans la valise',
    tag: null,
  },
]);

export const SURPLACE = Object.freeze([
  {
    title: 'Détaxe : tout change le 1er novembre',
    what: "On paie désormais le prix TTC en magasin (10 % de plus qu'avant), et on se fait rembourser à l'aéroport avant le vol. Passeport sur soi, seuil inchangé : 5 000 ¥ par magasin et par jour.",
    warn: "Le voyage entier tombe sous le nouveau régime. Concrètement : garder les tickets ET les articles achetés — ils peuvent être contrôlés au comptoir de remboursement de Haneda le 2 décembre. Prévoir de la marge : c'est le dernier matin.",
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
    title: 'Espèces',
    what: "Le Japon reste très liquide : petits restaurants, temples, marchés. Les distributeurs des 7-Eleven et de la Japan Post acceptent les cartes étrangères, 24h/24. Prévoir du liquide dès l'aéroport.",
  },
  {
    title: 'Taxe de séjour',
    what: "Plusieurs villes prélèvent quelques centaines de yens par personne et par nuit, réglés à l'hôtel, souvent en espèces. Kyoto est la plus chère. Ce n'est pas compris dans les prix affichés ici.",
  },
  {
    title: 'Tremblement de terre',
    what: "S'il secoue : on s'éloigne des fenêtres, on se met sous une table, on ne sort pas en courant. Les secousses faibles sont banales et les bâtiments sont conçus pour. Le téléphone sonne quelques secondes avant (alerte nationale) — le bruit est impressionnant, c'est normal.",
  },
  {
    title: 'Un numéro qui parle français',
    what: "La hotline touristes du JNTO répond 24h/24 en anglais : 050-3816-2787. Pour un souci médical, un vol, une galère administrative.",
  },
  {
    title: 'Onsen et tatouages',
    what: "On se lave assis, entièrement, AVANT d'entrer dans le bain ; la serviette ne touche jamais l'eau. Beaucoup de bains publics refusent encore les tatouages — le bain privé du ryokan règle la question.",
  },
  {
    title: 'L\'escalator change de côté',
    what: "On se tient à gauche à Tokyo, à droite à Osaka. Ça a l'air anecdotique jusqu'au moment où on bloque une file de trente personnes.",
  },
  {
    title: 'S’habiller par couches',
    what: "Le vrai enjeu de novembre n'est pas le froid mais l'écart : les trains, les magasins et les restaurants surchauffent, et on ressort dans 8 °C. Trois couches qu'on enlève et remet valent mieux qu'un gros manteau. Pour Owakudani (1 040 m, en téléphérique), ajouter coupe-vent et gants.",
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
  hakone:   { max: 12, min: 4,  note: 'lac Ashi à 720 m, Owakudani à 1 040 m : les nuits frôlent le 0' },
});

// À réserver, et AVANT QUAND. Le site marquait « résa conseillée » un peu
// partout sans jamais dire à quelle échéance — ce qui revient à ne rien dire.
// Ces dates viennent soit d'une contrainte dure (une annulation gratuite qui
// expire, un délai administratif), soit d'un ordre de grandeur assumé pour le
// pic des momiji, la période la plus tendue de l'année au Japon.
//
// `hard: true` = la date est une vraie limite, pas un conseil.
// `spotId` / `hotelId` rattachent l'entrée à sa fiche : la photo, la
// description et le lieu en viennent, plutôt que d'être recopiés ici.
//
// Le dîner kaiseki du ryokan de Hakone a été retiré de cette liste : il est
// confirmé auprès du ryokan (18:30 les deux soirs). Ce qui est fait ne doit
// pas rester dans une liste de choses à faire, sinon la liste ne se lit plus.

export const RESERVER = Object.freeze([
  {
    id: 'shibuya-sky',
    canal: 'en ligne',
    url: 'https://www.shibuya-scramble-square.com/sky/en/ticket/',
    commentReserver: 'Billetterie officielle en ligne avec date et créneau horodaté (moins cher qu\'au guichet). La vente ouvre environ 4 semaines à l\'avance, à minuit heure du Japon : pour le 11 nov 2026, viser l\'ouverture vers le 14 oct. Les créneaux au coucher du soleil (le plus prisé commence ~40 min avant le coucher, soit vers 16h20-16h30 mi-novembre) partent en quelques minutes, il faut réserver dès l\'ouverture. Tarif adulte en ligne ~2 600-3 400 ¥ selon le créneau, le coucher de soleil étant au tarif haut ; prix exact par tranche non confirmé sur la page officielle.',
    check: true,
    spotId: 'spot-shibuya-sky',
    title: 'Shibuya Sky, créneau coucher de soleil',
    what: "Les créneaux du couchant partent des semaines à l'avance, et c'est la tranche la plus chère. Coucher de soleil vers 16h35 à la mi-novembre.",
    deadline: '2026-10-11',
    forDate: '2026-11-11',
  },
  {
    id: 'teamlab',
    canal: 'en ligne',
    url: 'https://teamlabplanets.dmm.com/en/ticket',
    commentReserver: 'Billetterie officielle (boutique DMM), billet horodaté obligatoire, adulte 3 600 ¥. Les ventes ouvrent environ un mois à l\'avance (les dates de décembre sont mises en vente fin septembre), donc le créneau du 13 nov au matin devrait ouvrir mi-octobre. Site très demandé à Toyosu, il se vend plusieurs semaines à l\'avance : réserver le créneau du matin dès l\'ouverture. Fenêtre exacte d\'ouverture non confirmée officiellement.',
    check: true,
    spotId: 'spot-teamlab-planets',
    title: 'teamLab Planets, Toyosu',
    what: "Entrée par créneau horaire, aucun guichet sur place : sans billet, on ne rentre pas.",
    deadline: '2026-10-13',
    forDate: '2026-11-13',
  },
  {
    id: 'ninja',
    canal: 'téléphone',
    url: 'https://visitkanazawa.jp/en/spot/detail_50022.html',
    tel: '+81-76-241-0888',
    commentReserver: 'Réservation obligatoire et UNIQUEMENT par téléphone : aucun système de réservation en ligne n\'existe (toujours vrai en 2025/2026). On peut réserver en anglais au téléphone (personnel anglophone), donc pas besoin de parler japonais pour réserver. En revanche la visite est guidée en groupe et commentée en japonais (~40 min) ; un livret de traduction est fourni aux visiteurs étrangers. Réserver plusieurs jours à l\'avance ; ligne ouverte ~8h30-17h. L\'URL est la fiche touristique officielle de Kanazawa (référence, pas de résa en ligne).',
    spotId: 'spot-temple-ninja-myoryu-ji',
    title: 'Temple ninja (Myoryu-ji), Kanazawa',
    what: "Visite guidée uniquement sur réservation téléphonique, créneaux courts et peu nombreux. Paiement en espèces sur place.",
    deadline: '2026-10-15',
    forDate: '2026-11-15',
  },
  {
    id: 'rurikoin',
    canal: 'en ligne',
    url: 'https://rurikoin.komyoji.com/',
    commentReserver: 'Ouverture d\'automne ~1er oct-13 déc 2026, 10h-17h (dernière entrée 16h30), 2 000 ¥ adulte payés en espèces sur place. En pleine saison des érables (env. 8 nov-7 déc en 2025) l\'accès se fait sur réservation à créneau horaire via le site officiel, le plus souvent par tirage au sort (抽選) ouvert vers octobre — pas de vente libre. Le 19 nov tombe dans la fenêtre à réservation : surveiller l\'ouverture des inscriptions sur le site officiel dès début octobre. Modalités/URL exactes du système 2026 pas encore publiées au 2 sept.',
    check: true,
    spotId: 'spot-ruriko-in',
    title: 'Rurikō-in, créneau d\'automne',
    what: "Ouvert du 1er octobre au 13 décembre seulement, sur réservation de créneau. C'est le reflet des érables sur la table laquée — les créneaux de novembre partent en premier.",
    deadline: '2026-11-05',
    forDate: '2026-11-19',
  },
  {
    id: 'rikugien',
    canal: 'en ligne',
    url: 'https://www.tokyo-park.or.jp/event_search/special_nighttime_viewing_in_autumn.html',
    commentReserver: 'Illumination nocturne d\'automne du jardin (2025 : 28 nov-9 déc, 18h-20h30, dernière entrée 19h30). Billet à créneau : en ligne à l\'avance via la plateforme Asoview (asoview.com) au tarif réduit 1 000 ¥ (file prioritaire, quotas limités par soir), ou au guichet le jour même 1 200 ¥ ; l\'achat en ligne se fait au plus tard la veille. Le portail de vente ouvre fin octobre. Dates 2026 pas encore publiées ; le 1er déc tombe dans la fenêtre habituelle. La page officielle du Tokyo Metropolitan Park Association renvoie vers Asoview à l\'ouverture des ventes.',
    check: true,
    spotId: 'spot-rikugi-en',
    title: 'Illumination de Rikugi-en',
    what: "Le jardin ferme à 17h puis rouvre pour l'illumination, avec un billet séparé et, ces dernières années, un créneau horaire à réserver en ligne. Modalités 2026 à vérifier.",
    deadline: '2026-11-15',
    forDate: '2026-12-01',
    check: true,
  },
]);
