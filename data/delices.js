// Les spécialités à ne pas rater, étape par étape. Cochées côté navigateur (localStorage).
// Photos : Wikimedia Commons (licences libres), vérifiées une à une.
export const DELICES = Object.freeze([
  { cityId: 'tokyo', items: [
    { id: 'sushi-tsukiji', img: 'img/sushi-platter-a2e4caf6.webp', e: '🍣', n: 'Sushi du matin à Tsukiji', jp: '鮨', d: 'Comptoirs dès 6h au marché extérieur — viser la file de locaux, pas les rabatteurs.' },
    { id: 'tsukemen', img: 'img/tsukemen-at-a-tokyo-restaurant-58cd1e45.webp', e: '🍜', n: 'Tsukemen', jp: 'つけ麺', d: 'Nouilles à tremper dans un bouillon dense — le spot : Fuunji, à Shinjuku.' },
    { id: 'monja', img: 'img/monjayaki-before-d1e1117e.webp', e: '🍲', n: 'Monjayaki à Tsukishima', jp: 'もんじゃ焼き', d: 'Crème gratinée qu\'on racle à la petite spatule ; la rue principale de l\'île en aligne cinquante comptoirs.' },
    { id: 'melonpan', img: 'img/melonpan-on-the-plastic-bag-4bf3d90b.webp', e: '🍞', n: 'Melonpan chaud', jp: 'メロンパン', d: 'Chez Kagetsudo, à la sortie du Sensō-ji — encore tiède, croûte craquante.' },
    { id: 'onigiri', img: 'img/photo-13fa3031.webp', e: '🍙', n: 'Onigiri d\'artisan', jp: 'おにぎり', d: 'Bongo (Otsuka) ou Yadoroku (Asakusa), la plus vieille boutique d\'onigiri de Tokyo.' },
    { id: 'dorayaki', img: 'img/dorayaki-001-3-aeb57ce4.webp', e: '🍡', n: 'Dorayaki d\'Ueno', jp: 'どら焼き', d: 'Sa forme moderne est née à Ueno — chez Usagiya, il se mange tiède à cœur.' },
    { id: 'tempura', img: 'img/tempura-01-1ddf4208.webp', e: '🍤', n: 'Tempura Edo-mae', jp: '天ぷら', d: 'Daikokuya à Asakusa pour la version centenaire ; Karakusa ou Inamura pour la gastronomique.' },
    { id: 'yuba', img: 'img/tofu-skin-a3cfed1e.webp', e: '🥢', n: 'Yuba de Nikko', jp: '湯波', d: 'La peau de lait de soja des temples — à goûter sur place le 12 novembre.' },
    { id: 'nikuman', img: 'img/baozi-chengdu-dc3730f3.webp', e: '🥟', n: 'Nikuman de Chinatown (Yokohama)', jp: '肉まん', d: 'Brioches vapeur géantes du plus grand Chinatown du Japon — votre 28 novembre.' },
    { id: 'shirasu', img: 'img/whitebait-rice-bowl-at-enoshima-b97d1f52.webp', e: '🐟', n: 'Shirasu-don (Kamakura)', jp: 'しらす丼', d: 'Le bol de blanchaille de la baie de Sagami, cru si la pêche du matin l\'a permis — votre 29 novembre.' },
  ]},
  { cityId: 'kanazawa', items: [
    { id: 'kaisendon', img: 'img/20231125-p1033778-e2cf0824.webp', e: '🍚', n: 'Kaisen-don aux amaebi', jp: '海鮮丼', d: 'Le bol du marché Ōmichō, couronné de crevettes douces crues de la mer du Japon.' },
    { id: 'kobako', img: 'img/chionoecetes-opilio-31353551-15fd0463.webp', e: '🦀', n: 'Crabe des neiges · kōbako-gani', jp: '加能ガニ', d: 'La saison ouvre le 6 novembre — vous arrivez la première semaine. La femelle kōbako, servie avec ses œufs, ne se mange que quelques semaines.' },
    { id: 'nodoguro', img: 'img/nodoguro-grilled-with-salt-kappo-uosen-n-f55d8b6f.webp', e: '🐟', n: 'Nodoguro', jp: 'のどぐろ', d: 'Le poisson-roi de la mer du Japon, gras et fondant — grillé ou en sushi.' },
    { id: 'jibuni', img: 'img/jibuni-01-65efb05f.webp', e: '🍲', n: 'Jibu-ni', jp: '治部煮', d: 'Canard fariné mijoté dans un bouillon épaissi relevé de wasabi — le plat de banquet de Kaga, en bol laqué.' },
    { id: 'kinpaku', img: 'img/gold-leaf-soft-serve-48e46822.webp', e: '🍦', n: 'Glace à la feuille d\'or', jp: '金箔ソフト', d: 'Kanazawa bat 99 % de la feuille d\'or du Japon — la glace se mange dans Higashi Chaya.' },
    { id: 'wagashi-kaga', img: 'img/choseiden-traditional-sweets-in-kanazawa-301778af.webp', e: '🍡', n: 'Wagashi de Kaga', jp: '加賀和菓子', d: 'Héritage du thé des seigneurs Maeda — troisième ville du Japon pour les pâtisseries traditionnelles.' },
  ]},
  { cityId: 'kyoto', items: [
    { id: 'kaiseki-midi', img: 'img/jisaku-kaiseki-ryori-01-afcb0d2f.webp', e: '🥢', n: 'Kaiseki au déjeuner', jp: '懐石', d: 'Le grand menu de saison servi le midi à une fraction du prix du soir.' },
    { id: 'obanzai', img: 'img/obanzai-yasai-ddb4244a.webp', e: '🍲', n: 'Obanzai', jp: 'おばんざい', d: 'Les petites assiettes familiales de Kyoto, mangées au comptoir.' },
    { id: 'yudofu', img: 'img/yudofu-001-e5d00cdc.webp', e: '♨️', n: 'Yudōfu', jp: '湯豆腐', d: 'Le tofu mijoté des temples zen — parfait un midi frais de novembre, autour de Nanzen-ji ou à Arashiyama.' },
    { id: 'matcha-uji', img: 'img/matcha-scoop-2f95f9e8.webp', e: '🍵', n: 'Matcha d\'Uji', jp: '宇治抹茶', d: 'La capitale du thé — Nakamura Tokichi est déjà calé le 18 novembre.' },
    { id: 'nishin-soba', img: 'img/esashi-nishin-soba-d9a02b45.webp', e: '🍜', n: 'Nishin soba', jp: 'にしんそば', d: 'Soba coiffé d\'un hareng laqué — l\'hiver kyotoïte dans un bol.' },
    { id: 'yatsuhashi', img: 'img/yatsuhashi-002-46ace86d.webp', e: '🍡', n: 'Yatsuhashi nama', jp: '生八ツ橋', d: 'La douceur cannelle-riz, crue de préférence, chez les confiseurs de Kiyomizu-zaka.' },
  ]},
  { cityId: 'osaka', items: [
    { id: 'takoyaki', img: 'img/photo-9eb26c6e.webp', e: '🐙', n: 'Takoyaki', jp: 'たこ焼き', d: 'Les boules de poulpe brûlantes, debout dans la rue — Dotonbori ou Wanaka.' },
    { id: 'okonomiyaki', img: 'img/okonomiyaki-001-580af3a0.webp', e: '🍳', n: 'Okonomiyaki', jp: 'お好み焼き', d: 'La crêpe-plancha d\'Osaka, servie à la spatule, jamais coupée au couteau.' },
    { id: 'kushikatsu', img: 'img/kushikatsudaruma01-2803ccd5.webp', e: '🍢', n: 'Kushikatsu de Shinsekai', jp: '串カツ', d: 'Brochettes panées ; règle sacrée du quartier : on ne retrempe JAMAIS deux fois dans la sauce.' },
    { id: 'butaman', img: 'img/hourai-butaman-8d875212.webp', e: '🥟', n: 'Butaman de 551 Horai', jp: '豚まん', d: 'La brioche vapeur au porc culte d\'Osaka — l\'odeur de tous les trains de retour.' },
    { id: 'kitsune', img: 'img/photo-315d1531.webp', e: '🦊', n: 'Kitsune udon', jp: 'きつねうどん', d: 'Né à Osaka : udon coiffé d\'une poche de tofu frit sucrée.' },
    { id: 'nakatanidou', img: 'img/yomogi-dango-001-23e9cc96.webp', e: '🍡', n: 'Mochi pilé de Nakatanidou (Nara)', jp: 'よもぎ餅', d: 'Le mochi à l\'armoise pilé à la vitesse de l\'éclair — spectacle et goûter de votre 24 novembre.' },
  ]},
  { cityId: 'hakone', items: [
    { id: 'kurotamago', img: 'img/black-egg-owakudani-hakone-10621176696-70307239.webp', e: '🥚', n: 'Œufs noirs d\'Ōwakudani', jp: '黒たまご', d: 'Cuits dans les sources sulfureuses de la vallée — la légende offre sept ans de vie par œuf.' },
    { id: 'amazake', img: 'img/amazake-by-emily-harbour-in-july-1374059a.webp', e: '🍶', n: 'Amazake de la maison de thé', jp: '甘酒茶屋', d: 'Sur l\'ancien Tōkaidō au-dessus de Moto-Hakone : 400 ans de saké doux sans alcool, près du feu — à 20 min à pied du ryokan.' },
    { id: 'kaiseki-fukuya', img: 'img/jisaku-kaiseki-ryori-01-afcb0d2f.webp', e: '♨️', n: 'Kaiseki du Fukuya', jp: '会席', d: 'Votre dîner du 25 novembre, une dizaine de plats — déjà réservé, ventre vide exigé.' },
  ]},
].map(Object.freeze));
