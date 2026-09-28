// Les spécialités à ne pas rater, étape par étape. Cochées côté navigateur (localStorage).
export const DELICES = Object.freeze([
  { cityId: 'tokyo', items: [
    { id: 'sushi-tsukiji', e: '🍣', n: 'Sushi du matin à Tsukiji', jp: '鮨', d: 'Comptoirs dès 6h au marché extérieur — viser la file de locaux, pas les rabatteurs.' },
    { id: 'tsukemen', e: '🍜', n: 'Tsukemen', jp: 'つけ麺', d: 'Nouilles à tremper dans un bouillon dense — le spot : Fuunji, à Shinjuku.' },
    { id: 'monja', e: '🍲', n: 'Monjayaki à Tsukishima', jp: 'もんじゃ焼き', d: 'Crème gratinée qu\'on racle à la petite spatule ; la rue principale de l\'île en aligne cinquante comptoirs.' },
    { id: 'melonpan', e: '🍞', n: 'Melonpan chaud', jp: 'メロンパン', d: 'Chez Kagetsudo, à la sortie du Sensō-ji — encore tiède, croûte craquante.' },
    { id: 'onigiri', e: '🍙', n: 'Onigiri d\'artisan', jp: 'おにぎり', d: 'Bongo (Otsuka) ou Yadoroku (Asakusa), la plus vieille boutique d\'onigiri de Tokyo.' },
    { id: 'dorayaki', e: '🍡', n: 'Dorayaki d\'Ueno', jp: 'どら焼き', d: 'Sa forme moderne est née à Ueno — chez Usagiya, il se mange tiède à cœur.' },
    { id: 'tempura', e: '🍤', n: 'Tempura Edo-mae', jp: '天ぷら', d: 'Daikokuya à Asakusa pour la version centenaire ; Karakusa ou Inamura pour la gastronomique.' },
    { id: 'yuba', e: '🥢', n: 'Yuba de Nikko', jp: '湯波', d: 'La peau de lait de soja des temples — à goûter sur place le 12 novembre.' },
    { id: 'nikuman', e: '🥟', n: 'Nikuman de Chinatown (Yokohama)', jp: '肉まん', d: 'Brioches vapeur géantes du plus grand Chinatown du Japon — votre 28 novembre.' },
    { id: 'shirasu', e: '🐟', n: 'Shirasu-don (Kamakura)', jp: 'しらす丼', d: 'Le bol de blanchaille de la baie de Sagami, cru si la pêche du matin l\'a permis — votre 29 novembre.' },
  ]},
  { cityId: 'kanazawa', items: [
    { id: 'kaisendon', e: '🍚', n: 'Kaisen-don aux amaebi', jp: '海鮮丼', d: 'Le bol du marché Ōmichō, couronné de crevettes douces crues de la mer du Japon.' },
    { id: 'kobako', e: '🦀', n: 'Crabe des neiges · kōbako-gani', jp: '加能ガニ', d: 'La saison ouvre le 6 novembre — vous arrivez la première semaine. La femelle kōbako, servie avec ses œufs, ne se mange que quelques semaines.' },
    { id: 'nodoguro', e: '🐟', n: 'Nodoguro', jp: 'のどぐろ', d: 'Le poisson-roi de la mer du Japon, gras et fondant — grillé ou en sushi.' },
    { id: 'jibuni', e: '🍲', n: 'Jibu-ni', jp: '治部煮', d: 'Canard fariné mijoté dans un bouillon épaissi relevé de wasabi — le plat de banquet de Kaga, en bol laqué.' },
    { id: 'kinpaku', e: '🍦', n: 'Glace à la feuille d\'or', jp: '金箔ソフト', d: 'Kanazawa bat 99 % de la feuille d\'or du Japon — la glace se mange dans Higashi Chaya.' },
    { id: 'wagashi-kaga', e: '🍡', n: 'Wagashi de Kaga', jp: '加賀和菓子', d: 'Héritage du thé des seigneurs Maeda — troisième ville du Japon pour les pâtisseries traditionnelles.' },
  ]},
  { cityId: 'kyoto', items: [
    { id: 'kaiseki-midi', e: '🥢', n: 'Kaiseki au déjeuner', jp: '懐石', d: 'Le grand menu de saison servi le midi à une fraction du prix du soir.' },
    { id: 'obanzai', e: '🍲', n: 'Obanzai', jp: 'おばんざい', d: 'Les petites assiettes familiales de Kyoto, mangées au comptoir.' },
    { id: 'yudofu', e: '♨️', n: 'Yudōfu', jp: '湯豆腐', d: 'Le tofu mijoté des temples zen — parfait un midi frais de novembre, autour de Nanzen-ji ou à Arashiyama.' },
    { id: 'matcha-uji', e: '🍵', n: 'Matcha d\'Uji', jp: '宇治抹茶', d: 'La capitale du thé — Nakamura Tokichi est déjà calé le 18 novembre.' },
    { id: 'nishin-soba', e: '🍜', n: 'Nishin soba', jp: 'にしんそば', d: 'Soba coiffé d\'un hareng laqué — l\'hiver kyotoïte dans un bol.' },
    { id: 'yatsuhashi', e: '🍡', n: 'Yatsuhashi nama', jp: '生八ツ橋', d: 'La douceur cannelle-riz, crue de préférence, chez les confiseurs de Kiyomizu-zaka.' },
  ]},
  { cityId: 'osaka', items: [
    { id: 'takoyaki', e: '🐙', n: 'Takoyaki', jp: 'たこ焼き', d: 'Les boules de poulpe brûlantes, debout dans la rue — Dotonbori ou Wanaka.' },
    { id: 'okonomiyaki', e: '🍳', n: 'Okonomiyaki', jp: 'お好み焼き', d: 'La crêpe-plancha d\'Osaka, servie à la spatule, jamais coupée au couteau.' },
    { id: 'kushikatsu', e: '🍢', n: 'Kushikatsu de Shinsekai', jp: '串カツ', d: 'Brochettes panées ; règle sacrée du quartier : on ne retrempe JAMAIS deux fois dans la sauce.' },
    { id: 'butaman', e: '🥟', n: 'Butaman de 551 Horai', jp: '豚まん', d: 'La brioche vapeur au porc culte d\'Osaka — l\'odeur de tous les trains de retour.' },
    { id: 'kitsune', e: '🦊', n: 'Kitsune udon', jp: 'きつねうどん', d: 'Né à Osaka : udon coiffé d\'une poche de tofu frit sucrée.' },
    { id: 'nakatanidou', e: '🍡', n: 'Mochi pilé de Nakatanidou (Nara)', jp: 'よもぎ餅', d: 'Le mochi à l\'armoise pilé à la vitesse de l\'éclair — spectacle et goûter de votre 24 novembre.' },
  ]},
  { cityId: 'hakone', items: [
    { id: 'kurotamago', e: '🥚', n: 'Œufs noirs d\'Ōwakudani', jp: '黒たまご', d: 'Cuits dans les sources sulfureuses de la vallée — la légende offre sept ans de vie par œuf.' },
    { id: 'amazake', e: '🍶', n: 'Amazake de la maison de thé', jp: '甘酒茶屋', d: 'Sur l\'ancien Tōkaidō au-dessus de Moto-Hakone : 400 ans de saké doux sans alcool, près du feu — à 20 min à pied du ryokan.' },
    { id: 'kaiseki-fukuya', e: '♨️', n: 'Kaiseki du Fukuya', jp: '会席', d: 'Votre dîner du 25 novembre, une dizaine de plats — déjà réservé, ventre vide exigé.' },
  ]},
].map(Object.freeze));
