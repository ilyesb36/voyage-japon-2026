// La sélection : le tri fait à la main, étape par étape, comme un carnet.
// Les 414 adresses restent dans la bibliothèque ; ici, seulement ce qui compte.
// Chaque choix renvoie à une fiche du guide (spot-…) et dit pourquoi y aller.
export const SELECTION = Object.freeze([
 {
  "step": 1,
  "cityId": "tokyo",
  "title": "Tokyo · Asakusa",
  "dates": "9 → 14 nov",
  "intro": "Cinq nuits dans le vieux Tokyo, avec Nikko en excursion le 12. L'étape sert à prendre ses marques : les grands classiques, l'aube au temple devant l'hôtel, et un seul coucher de soleil vu d'en haut.",
  "arbitrage": "Les ginkgos de Jingu Gaien et les érables de Tokyo ne seront pas encore prêts : ils sont gardés pour la fin du séjour, quand ils seront au sommet.",
  "picks": [
   {
    "id": "spot-senso-ji",
    "why": "À 7h le temple est à vous, à 10h c'est la cohue. Il est à dix minutes de l'hôtel : c'est le premier matin idéal, décalage horaire aidant."
   },
   {
    "id": "spot-yanaka",
    "why": "Le Tokyo d'avant-guerre, épargné par les bombes : ruelles, temples de quartier, chats. À une station de chez vous, une après-midi suffit."
   },
   {
    "id": "spot-meiji-jingu",
    "why": "La forêt sacrée au milieu de Harajuku. Y aller tôt, puis descendre à pied vers Shibuya."
   },
   {
    "id": "spot-le-croisement-de-shibuya",
    "why": "Le croisement vu d'en bas, en plein flux, puis de l'étage du Starbucks — c'est la carte postale du voyage."
   },
   {
    "id": "spot-shibuya-sky",
    "why": "Le même quartier du 47e étage au coucher du soleil. Billet daté à prendre dès l'ouverture de la vente, vers le 14 octobre."
   },
   {
    "id": "spot-teamlab-planets",
    "why": "L'expérience immersive les pieds dans l'eau. Créneau horodaté, réservé à l'avance pour le 13 novembre."
   },
   {
    "id": "spot-sushi-a-tsukiji",
    "why": "Le petit-déjeuner au marché extérieur, au comptoir, avant le train pour Kanazawa le 14."
   },
   {
    "id": "spot-nikko",
    "why": "Le 12 : sanctuaires laqués dans la montagne, où les érables sont déjà en couleur grâce à l'altitude. Départ tôt depuis Asakusa, la gare Tobu est juste là."
   },
   {
    "id": "spot-omoide-yokocho",
    "why": "Un soir : yakitori dans les ruelles enfumées de Shinjuku, ambiance Shōwa. Y aller avant 19h pour avoir de la place."
   }
  ]
 },
 {
  "step": 2,
  "cityId": "kanazawa",
  "title": "Kanazawa",
  "dates": "14 → 16 nov",
  "intro": "Deux nuits dans la ville d'Edo qui n'a jamais été bombardée. Petite, elle se fait à pied, et vous tombez pile sur les deux soirs d'illumination gratuite du jardin.",
  "arbitrage": "Shirakawa-gō est magnifique mais demande une journée entière : avec deux nuits seulement, elle est laissée de côté au profit de la ville elle-même.",
  "picks": [
   {
    "id": "spot-kenroku-en",
    "why": "L'un des trois plus beaux jardins du Japon, avec ses pins déjà harnachés de yukitsuri. À l'ouverture, avant les cars."
   },
   {
    "id": "spot-ev-kenrokuen-lightup",
    "why": "Les 14 et 15, de 18h à 21h, le jardin et le château sont illuminés et l'entrée est gratuite : vos deux soirs sur place."
   },
   {
    "id": "spot-higashi-chaya",
    "why": "Le quartier des maisons de thé, à voir au crépuscule quand les lanternes s'allument."
   },
   {
    "id": "spot-atelier-feuille-d-or",
    "why": "Kanazawa produit presque toute la feuille d'or du Japon : on en pose soi-même sur un objet, en une heure, à Higashi Chaya."
   },
   {
    "id": "spot-nagamachi",
    "why": "Les ruelles des samouraïs, murs de terre et canaux. La maison Nomura se visite, avec son petit jardin intérieur."
   },
   {
    "id": "spot-kaisendon-d-omicho",
    "why": "Le déjeuner au marché d'Ōmichō : bol de poisson cru et crabe des neiges, dont la saison vient d'ouvrir le 6 novembre."
   },
   {
    "id": "spot-temple-ninja-myoryu-ji",
    "why": "Trappes, escaliers cachés, faux plafonds. Visite guidée sur réservation par téléphone uniquement, à faire avant le 15 octobre."
   }
  ]
 },
 {
  "step": 3,
  "cityId": "kyoto",
  "title": "Kyoto",
  "dates": "16 → 22 nov",
  "intro": "Six nuits, la plus longue étape. Les érables seront en train de virer plutôt qu'au sommet (pic officiel annoncé le 11 décembre) : on joue donc les lieux en hauteur, les jardins frais et les illuminations du soir.",
  "arbitrage": "Le Nintendo Museum du 18 est déjà payé : Uji le matin, le musée l'après-midi, sur la même ligne. Arashiyama glisse au 21, jour du marché du Tō-ji.",
  "picks": [
   {
    "id": "spot-fushimi-inari",
    "why": "Les milliers de torii, à monter à l'aube : au-delà de la première demi-heure de marche, la foule disparaît."
   },
   {
    "id": "spot-kiyomizu-dera",
    "why": "La terrasse sur pilotis au-dessus des érables. En journée pour la vue, et de nuit à partir du 21 pour l'illumination."
   },
   {
    "id": "spot-eikan-do",
    "why": "L'illumination d'automne la plus réputée de Kyoto ouvre le 20 novembre, pile pour vos trois derniers soirs."
   },
   {
    "id": "spot-arashiyama",
    "why": "La bambouseraie à 7h30, puis Tenryū-ji, le pont et les collines. Les pentes rougissent avant la ville."
   },
   {
    "id": "spot-kinkaku-ji",
    "why": "Le pavillon d'or sur son étang. Une demi-heure suffit, à coupler avec Ryōan-ji tout proche."
   },
   {
    "id": "spot-uji",
    "why": "Le 18 au matin : le pavillon du Phénix et le matcha chez Nakamura Tokichi, avant le Nintendo Museum."
   },
   {
    "id": "spot-nintendo-museum-uji",
    "why": "Billets payés, mercredi 18 novembre à 14h. Arriver un peu avant le créneau."
   },
   {
    "id": "spot-marche-kobo-san-au-to-ji",
    "why": "Le 21 de chaque mois, 1 200 stands de brocante sous la pagode du Tō-ji. Votre 21 tombe un samedi : y être à l'ouverture."
   },
   {
    "id": "spot-ohara-sanzen-in",
    "why": "Au nord, plus frais et plus haut : c'est là que les couleurs seront les plus avancées pendant votre semaine."
   }
  ]
 },
 {
  "step": 4,
  "cityId": "osaka",
  "title": "Osaka · Nara",
  "dates": "22 → 25 nov",
  "intro": "Trois nuits à Namba, la cuisine du Japon. On y vient pour manger dans la rue et sortir le soir, avec Nara le 24.",
  "arbitrage": "Le château d'Osaka se regarde de l'extérieur, ses douves et ses ginkgos : l'intérieur est un musée en béton, sans intérêt.",
  "picks": [
   {
    "id": "spot-dotonbori-by-night",
    "why": "Les néons, le Glico Man, les takoyaki brûlants mangés debout. Le premier soir, en descendant de l'hôtel."
   },
   {
    "id": "spot-marche-kuromon",
    "why": "Le marché couvert juste en bas de chez vous, à grignoter en marchant. Plutôt en matinée."
   },
   {
    "id": "spot-kushikatsu",
    "why": "Brochettes panées à Shinsekai, au pied de la tour Tsūtenkaku. Règle du quartier : on ne trempe jamais deux fois dans la sauce."
   },
   {
    "id": "spot-ev-midosuji",
    "why": "L'avenue principale illuminée sur 4 km, tous les soirs de votre séjour. À faire en remontant vers Umeda."
   },
   {
    "id": "spot-chateau-d-osaka",
    "why": "Le parc et les douves bordés de ginkgos dorés : le 23, jour férié, pour la balade."
   },
   {
    "id": "spot-nara",
    "why": "Le 24 : le Grand Bouddha du Tōdai-ji et les daims du parc. Y être avant 10h, avant les groupes."
   },
   {
    "id": "spot-mochi-de-nakatanidou",
    "why": "À Nara, le mochi pilé à toute vitesse devant la boutique : un spectacle et un goûter."
   },
   {
    "id": "spot-coucher-de-soleil-au-nigatsu-do",
    "why": "La terrasse du Nigatsu-dō, au-dessus du Tōdai-ji, pour finir la journée à Nara."
   }
  ]
 },
 {
  "step": 5,
  "cityId": "hakone",
  "title": "Hakone",
  "dates": "25 → 27 nov",
  "intro": "Deux nuits au ryokan Fukuya, au bord du lac Ashi. C'est la pause du voyage : le bain, le dîner et le Fuji s'il se montre.",
  "arbitrage": "En altitude, Hakone est en fin de saison des couleurs. Le circuit complet en téléphérique et bateau est prévu, mais c'est le ryokan qui compte.",
  "picks": [
   {
    "id": "spot-onsen-prive-du-ryokan",
    "why": "Votre chambre a son bain en plein air avec vue sur le lac : à la nuit tombée, puis à l'aube quand la brume monte."
   },
   {
    "id": "spot-kaiseki-du-ryokan",
    "why": "Le dîner de saison en une dizaine de plats, réservé à 18h30. Arriver le ventre vide."
   },
   {
    "id": "spot-hakone-jinja",
    "why": "Le torii rouge planté dans le lac, à quelques minutes à pied du ryokan. Tôt le matin, sans file pour la photo."
   },
   {
    "id": "spot-bateau-pirate",
    "why": "La traversée du lac, avec le Fuji en face par temps clair. Inclus dans le Freepass."
   },
   {
    "id": "spot-owakudani",
    "why": "La vallée des fumerolles, en téléphérique, avec les œufs noirs cuits dans les sources."
   },
   {
    "id": "spot-musee-en-plein-air",
    "why": "Des sculptures en pleine nature et un bain de pieds chaud. À faire le 27 avant de redescendre sur Tokyo."
   },
   {
    "id": "spot-amazake-chaya",
    "why": "La maison de thé au toit de chaume sur l'ancienne route du Tōkaidō, à 20 minutes à pied du ryokan."
   }
  ]
 },
 {
  "step": 6,
  "cityId": "tokyo",
  "title": "Tokyo · Ikebukuro",
  "dates": "27 nov → 2 déc",
  "intro": "Le retour à Tokyo tombe au bon moment : les érables de la ville rougissent vers le 29 et les ginkgos dorent vers le 26. Yokohama le 28, Kamakura le 29.",
  "arbitrage": "La fin de séjour est aussi le moment des restos plus fancy, tous sous 100 € par personne.",
  "picks": [
   {
    "id": "spot-icho-namiki-jingu-gaien",
    "why": "L'avenue des 146 ginkgos au sommet de son or. Illuminée de 16h30 à 19h30 jusqu'au 1er décembre."
   },
   {
    "id": "spot-rikugi-en",
    "why": "Le jardin d'Edo, illuminé le soir fin novembre. À dix minutes de l'hôtel d'Ikebukuro."
   },
   {
    "id": "spot-kamakura",
    "why": "Le 29 : le Grand Bouddha, Hase-dera face à la baie, le shirasu-don sur Komachi-dōri."
   },
   {
    "id": "spot-hokoku-ji",
    "why": "La bambouseraie secrète de Kamakura. Acheter le billet matcha à l'entrée avant d'y pénétrer, vente jusqu'à 15h30."
   },
   {
    "id": "spot-yokohama",
    "why": "Le 28 : Chinatown, les entrepôts de brique et le port qui s'illumine au crépuscule."
   },
   {
    "id": "spot-ev-tori-no-ichi",
    "why": "La troisième foire aux râteaux porte-bonheur devrait tomber le mardi 1er décembre à Asakusa, jusqu'à tard le soir."
   },
   {
    "id": "spot-view-dining-the-sky",
    "why": "Le déjeuner tournant du 17e étage, 5 500 ¥ en semaine. À réserver sur TableCheck."
   },
   {
    "id": "spot-sushi-tomohiro",
    "why": "L'omakase spectacle à 4 400 ¥, à côté de l'hôtel. Réservation facile en ligne."
   },
   {
    "id": "spot-iko-inarido",
    "why": "Les torii et les chats d'une ruelle cachée d'Ikebukuro, à cinq minutes de l'hôtel. Une trouvaille des Secrets de Tokyo."
   }
  ]
 }
]);
