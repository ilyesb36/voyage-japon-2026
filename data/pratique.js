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
    commentReserver: "HAKONE FREEPASS, version « depuis Odawara », 3 jours (25 → 27 nov.) : 6 400 ¥ par adulte (tarif depuis le 1er octobre 2025). Illimité sur le train de montagne Tozan, le funiculaire, le téléphérique, le bateau pirate et les bus Hakone Tozan, Odakyu et Tokai — dont le bus Odawara ↔ Moto-Hakone des 25 et 27. Pas compris : le supplément Romancecar et les bus Izu-Hakone (une autre compagnie : regarder le nom sur le bus). Achat : en ligne sur EMot Online Tickets, jusqu'à un mois avant (billet numérique sur le téléphone, rien à échanger), au 7-Eleven, ou au guichet Odakyu de la gare d'Odawara en arrivant le 25. NIKKO PASS WORLD HERITAGE AREA : 2 jours, 3 000 ¥ par adulte, réservé aux voyageurs étrangers (passeport). Compris : l'aller-retour Asakusa ↔ Nikko en train Tobu et les bus Tobu entre la gare et les sanctuaires. Pas compris : le supplément des trains express (≈1 650 ¥, 1 940 ¥ en SPACIA X, par personne et par trajet ; places réservées, +200 ¥ si acheté à bord), le bus du lac Chuzenji (≈1 200 ¥ le trajet), les entrées. Achat sur le site de Tobu (https://www.tobu.co.jp/en/ticket/nikko/city.html) : billet numérique, ou bon papier à retirer au centre d'information Tobu d'Asakusa, à deux pas de l'hôtel. Le supplément express se réserve sur Tobuchike (トブチケ), le site de billets de Tobu, dès un mois avant.",
    title: 'Hakone Freepass et Nikko Pass',
    what: "Le Freepass de Hakone (3 jours depuis Odawara) couvre les transports de Hakone du 25 au 27 : bus, train de montagne, funiculaire, téléphérique, bateau pirate. Le Nikko Pass couvre le train Tokyo ↔ Nikko (supplément express en plus) et les bus des sanctuaires, pas celui du lac Chuzenji. Pas de JR Pass : sur cet itinéraire, les billets à l'unité reviennent moins cher.",
    when: 'Avant de partir, ou sur place',
    tag: null,
  },
  {
    id: 'medicaments',
    deadline: '2026-10-15',
    title: 'Médicaments : la douane est stricte',
    what: "Le Japon interdit à l'importation la pseudoéphédrine (beaucoup de traitements du rhume) et la codéine. Au-delà d'un mois de traitement, ou pour tout produit sensible, il faut un certificat « Yakkan Shoumei », à demander en ligne sur le portail du ministère, au moins une à deux semaines avant. Vérifier chaque boîte de la trousse.",
    when: 'Mi-octobre au plus tard',
    url: 'https://impconf.mhlw.go.jp/',
    tel: '+81-48-740-0800',
    commentReserver: "Demande en ligne sur le portail impconf.mhlw.go.jp (la voie par défaut depuis juillet 2025), bureau Kanto-Shinetsu pour une arrivée à Haneda. Téléphone : lun.–ven., 10:00 – 12:00 et 13:00 – 16:00 heure du Japon. Compter une à deux semaines.",
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
    id: 'precheckin-osaka',
    deadline: '2026-11-06',
    title: 'Pré-enregistrement de l’appartement d’Osaka',
    what: "Obligatoire pour vous deux, avec le passeport : sans lui, la porte ne s'ouvre pas. Le lien est dans la messagerie Booking de 川HOUSE黒門 (message du 17 août). Les autres hébergements envoient leur enregistrement en ligne quelques jours avant ou le jour même — surveiller la messagerie Booking.",
    when: 'Dès maintenant',
    url: 'https://secure.booking.com/inbox.fr.html',
    hard: true,
    tag: 'Pas d’accès sinon',
  },
  {
    id: 'fiche-secours',
    cat: 'papiers',
    deadline: '2026-11-07',
    title: 'Imprimer la fiche de secours',
    what: "Une page avec les six adresses en japonais, les téléphones, les vols, les urgences et les phrases à montrer. Une copie papier dans le portefeuille de chacun, et une capture d'écran dans les photos : elle sert même téléphone éteint.",
    when: 'La veille du départ',
    url: 'secours.html',
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
  {"id":"shinkansen-kanazawa","deadline":"2026-11-07","title":"Sièges shinkansen Tokyo → Kanazawa (sam 14 nov)","what":"Le Kagayaki du samedi 14 novembre n'a que des places réservées, et le Hokuriku shinkansen se remplit le week-end. La vente ouvre un mois avant sur Eki-Net (le 14 octobre pour le 14 novembre) : réserver avant de partir, billets à retirer à la gare de Tokyo. Prévenir Center Point si l'arrivée à Kanazawa passe 19h.","when":"Avant de partir — la vente est ouverte","tag":null,"commentReserver":""},
]);

export const SURPLACE = Object.freeze([
  // En tête : c'est ce qu'on cherche quand ça va mal. `tels` devient des
  // boutons d'appel, pour ne rien avoir à recopier.
  {
    title: 'Urgences',
    what: "Gratuit depuis n'importe quel téléphone. Pour un souci médical, un vol, une galère administrative, la hotline touristes du JNTO répond 24h/24 en anglais. Perdu : la page du jour mène à l'hôtel du soir en un geste.",
    tels: [
      { label: 'Police', n: '110' },
      { label: 'Pompiers, ambulance', n: '119' },
      { label: 'Hotline touristes', n: '050-3816-2787' },
    ],
  },
  {
    title: 'Détaxe : tout change le 1er novembre',
    what: "On paie désormais le prix TTC en magasin (10 % de plus qu'avant), et on se fait rembourser à l'aéroport avant le vol. Passeport sur soi, seuil inchangé : 5 000 ¥ par magasin et par jour.",
    warn: "Le voyage entier tombe sous le nouveau régime. Concrètement : garder les tickets ET les articles achetés — ils peuvent être contrôlés au comptoir de remboursement de Haneda le 2 décembre. Prévoir de la marge avant l'enregistrement du vol de 20:15.",
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
    what: "Le takkyubin (宅急便) fait suivre les deux valises d'un logement au suivant, livrées le lendemain — précieux quand un appartement n'ouvre que l'après-midi. Mais deux logements ne reçoivent aucun colis (Matatabi à Kyoto, La Vita à Tokyo), Hakone a sa propre consigne, et les courtes étapes se font plus simplement valises en main. Chaque changement de ville a ses règles, son option conseillée et son coût.",
    page: 'valises.html',
    pageLabel: 'Les valises, trajet par trajet',
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
    commentReserver: "Billetterie officielle en ligne, date et créneau horodatés. Tarifs 2026 en ligne : 2 700 ¥ avant 15:00, 3 400 ¥ à partir de 15:00 — le couchant est donc au tarif haut (guichet : 3 000 / 3 700 ¥). La vente ouvre environ deux semaines avant, à minuit heure du Japon — 16:00 à Paris, l'heure d'hiver arrivant le 25 octobre : pour le 11 novembre, vers le 28 octobre. Regarder dès maintenant au cas où ce serait plus tôt. Le créneau du couchant (vers 16:00) part en quelques minutes. Revérifié le 14 octobre 2026.",
    check: true,
    spotId: 'spot-shibuya-sky',
    title: 'Shibuya Sky, créneau coucher de soleil',
    what: "Les créneaux du couchant partent des semaines à l'avance, et c'est la tranche la plus chère. Coucher de soleil vers 16h35 à la mi-novembre.",
    deadline: '2026-10-28',
    forDate: '2026-11-11',
  },
  {
    id: 'teamlab',
    canal: 'en ligne',
    url: 'https://teamlabplanets.dmm.com/en/ticket',
    commentReserver: "Billetterie officielle (boutique DMM), billet horodaté obligatoire, 3 600 à 3 800 ¥ selon la date (tarif variable). Ouvert jusqu'à fin 2027. Les dates sortent trois à quatre semaines avant : le 13 novembre doit apparaître au calendrier ces jours-ci. Réserver dès qu'il y est. Revérifié le 14 octobre 2026.",
    check: true,
    spotId: 'spot-teamlab-planets',
    title: 'teamLab Planets, Toyosu',
    what: "Entrée par créneau horaire, aucun guichet sur place : sans billet, on ne rentre pas. Viser un créneau vers 18h30, après le coucher du soleil à Yanaka.",
    deadline: '2026-10-20',
    forDate: '2026-11-13',
  },
  {
    id: 'rikugien',
    canal: 'en ligne',
    url: 'https://www.tokyo-park.or.jp/event_search/special_nighttime_viewing_in_autumn.html',
    commentReserver: "Illumination 2026 confirmée du 25 novembre au 6 décembre, 18:00 – 20:30, dernière entrée 19:30 (annonce du 3 septembre). En ligne via Asoview, 1 000 ¥, au plus tard la veille ; au guichet 1 200 ¥. La vente en ligne ouvre habituellement fin octobre. La page officielle montre encore l'édition 2024 : ne pas s'y fier pour les dates.",
    check: true,
    spotId: 'spot-rikugi-en',
    title: 'Illumination de Rikugi-en',
    what: "Le jardin ferme à 17h puis rouvre pour l'illumination, du 25 novembre au 6 décembre, avec un billet séparé — moins cher en ligne.",
    deadline: '2026-11-15',
    forDate: '2026-12-01',
    check: true,
  },
  {"id":"the-sky","canal":"en ligne","url":"https://www.tablecheck.com/en/newotani-tokyo-restaurant-sky","commentReserver":"Réservation TableCheck. Le déjeuner en semaine (5 500 ¥) est le bon plan. Annulation après 17h la veille facturée à 100 %.","spotId":"spot-view-dining-the-sky","title":"VIEW & DINING THE SKY, déjeuner","what":"Le buffet tournant du 17e étage du New Otani : un tour complet de Tokyo pendant le repas.","deadline":"2026-10-30","forDate":"2026-11-30"},
  {"id":"tokyo-ten","canal":"en ligne","url":"https://www.google.com/maps/search/?api=1&query=Sushi%20Tokyo%20Ten%20Shinjuku","commentReserver":"Réservation en ligne depuis la fiche de l’établissement ; les créneaux du soir partent vite.","spotId":"spot-sushi-tokyo-ten","title":"Sushi Tokyo Ten, omakase du soir","what":"Une vingtaine de pièces au comptoir pour ~9 000 ¥ : l’omakase fancy du budget.","deadline":"2026-10-30","forDate":"2026-11-30"},
  {"id":"tomohiro","canal":"en ligne","url":"https://www.tablecheck.com/shops/sushi-tomohiro/reserve","commentReserver":"TableCheck, en ligne et simple.","spotId":"spot-sushi-tomohiro","title":"Sushi Tomohiro, Ikebukuro","what":"L’omakase spectacle à 4 400 ¥, à côté de l’hôtel de fin de séjour.","deadline":"2026-10-27","forDate":"2026-11-27"},
  {"id":"takano","canal":"en ligne","url":"https://tabelog.com/tokyo/A1313/A131301/13285143/","commentReserver":"Via Tabelog. Le mardi est son seul midi de la semaine.","spotId":"spot-takano","title":"Takano, déjeuner du mardi (Tsukiji)","what":"Deux heures de gastronomie intimiste ; le 1er décembre tombe un mardi.","deadline":"2026-11-03","forDate":"2026-12-01"},
  {"id":"junsei","canal":"en ligne","url":"https://www.klook.com/activity/5198-nanzenji-junsei-restaurant-kyoto/","commentReserver":"En ligne via Klook (anglais), confirmation sous 24 h, ou par téléphone. Demander la salle côté jardin. Menu du midi ~4 500 ¥.","spotId":"spot-nanzenji-junsei","title":"Nanzenji Junsei, déjeuner du 20 nov","what":"Le tofu des temples dans un jardin de Nanzen-ji. En pleine saison des érables, pas de table sans réservation.","deadline":"2026-10-21","forDate":"2026-11-20","tel":"+81-75-761-2311"},
  {"id":"mitsukawa","canal":"en ligne","url":"https://www.tablecheck.com/en/sushi-mitsukawa-kanazawa","commentReserver":"TableCheck, interface en anglais. Demander le menu nigiri à 8 800 ¥ (l'omakase monte à 16 500 ¥). Ōtomorō se réserve par téléphone au 076-221-0305 (menu Kaga du midi dès 8 580 ¥, fermé le mercredi et parfois sans prévenir).","spotId":"spot-mitsukawa","title":"Sushi Mitsukawa, déjeuner du 15 nov (Kanazawa)","what":"Huit places au comptoir à Higashi Chaya, les poissons de la mer du Japon. À la place, ou en plus : Ōtomorō, ryotei de 1830, pour le jibu-ni.","deadline":"2026-10-21","forDate":"2026-11-15","tel":"+81-76-253-5005"},
  {"id":"yoshikawa","canal":"en ligne","url":"https://www.kyoto-yoshikawa.co.jp/en/contact-en/","commentReserver":"Formulaire en anglais sur le site, ou téléphone. Préciser le comptoir. Déjeuner ~6 000 ¥.","spotId":"spot-tempura-yoshikawa","title":"Tempura Yoshikawa, comptoir du 16 nov","what":"La tempura frite devant vous, au comptoir d'une maison de ryokan, le midi de l'arrivée à Kyoto.","deadline":"2026-11-02","forDate":"2026-11-16","tel":"+81-75-221-5544"},
  {"id":"tategami","canal":"en ligne","url":"https://savorjapan.com/0006022979/","commentReserver":"Formulaire web en anglais, ou téléphone. Annulation gratuite jusqu'à J-7. Dîner ~8 000 ¥.","spotId":"spot-kyoryori-tategami","title":"Tategami, dîner kaiseki du 18 nov","what":"Un kaiseki près de l'appartement, le soir de Nintendo : la belle table sans traverser la ville.","deadline":"2026-11-04","forDate":"2026-11-18","tel":"+81-75-256-8733"},
  {"id":"sublime","canal":"en ligne","url":"https://japan-food.guide/restaurants/1882","commentReserver":"Gurunavi, Tableall, ou par téléphone (anglais possible via byFood). Carte bancaire uniquement ; plus de 15 min de retard = table annulée.","spotId":"spot-sublime","title":"Teppanyaki Sublime, déjeuner A5 à Namba","what":"Le bœuf A5 grillé devant vous pour ~5 200 ¥ le midi, à dix minutes de l'appartement d'Osaka.","deadline":"2026-11-08","forDate":"2026-11-22","tel":"+81-6-6556-6896"},
  {"id":"saiko-shinkan","canal":"téléphone","url":"https://r.gnavi.co.jp/g370002/","commentReserver":"Par téléphone (050-3196-2794) ou via la page Gurunavi. Déjeuner ~3 800 ¥.","spotId":"spot-saiko-shinkan","title":"Saikō Shinkan, dim sum du 28 nov (Yokohama)","what":"Le dim sum de Chinatown un samedi midi : sans réservation, on attend ou on repart.","deadline":"2026-11-14","forDate":"2026-11-28","tel":"+81-50-3196-2794"},
]);
