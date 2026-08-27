// Quartiers, villes d'excursion et repères -> la base où l'on dort quand on y va.
// Sert à donner un cityId fiable aux 236 spots du guide, dont les intitulés
// de section ne nomment pas toujours une ville (Shopping groupe par type d'objet,
// Day trips par point de départ).

export const AREA_TO_CITY = {
  // --- Tokyo -------------------------------------------------------------
  tokyo: 'tokyo',
  asakusa: 'tokyo', 'nishi-asakusa': 'tokyo', kappabashi: 'tokyo', 'nakamise-dori': 'tokyo',
  shibuya: 'tokyo', shinjuku: 'tokyo', harajuku: 'tokyo', ginza: 'tokyo', ikebukuro: 'tokyo',
  akihabara: 'tokyo', ueno: 'tokyo', yanaka: 'tokyo', nihonbashi: 'tokyo', ningyocho: 'tokyo',
  shimokitazawa: 'tokyo', koenji: 'tokyo', tsukiji: 'tokyo', tsukishima: 'tokyo',
  kanamecho: 'tokyo', otsuka: 'tokyo', azabudai: 'tokyo', shimbashi: 'tokyo', roppongi: 'tokyo',
  marunouchi: 'tokyo', kanda: 'tokyo', sumida: 'tokyo', toyosu: 'tokyo', odaiba: 'tokyo',
  setagaya: 'tokyo', nakameguro: 'tokyo', daikanyama: 'tokyo', takao: 'tokyo',
  'minami-aoyama': 'tokyo', 'tokyo station': 'tokyo', 'sunshine city': 'tokyo',
  aoyama: 'tokyo', omotesando: 'tokyo', 'nakano': 'tokyo',
  'takaosanguchi': 'tokyo', gotokuji: 'tokyo', 'gotoku-ji': 'tokyo', kameido: 'tokyo',
  // excursions depuis Tokyo
  nikko: 'tokyo', chuzenji: 'tokyo', kegon: 'tokyo', toshogu: 'tokyo',
  yokohama: 'tokyo', minatomirai: 'tokyo',
  kamakura: 'tokyo', enoshima: 'tokyo', yuigahama: 'tokyo', kamakurakokomae: 'tokyo',
  hase: 'tokyo', 'hokoku-ji': 'tokyo',
  kawaguchiko: 'tokyo', chureito: 'tokyo', fuji: 'tokyo',

  // --- Kanazawa ----------------------------------------------------------
  kanazawa: 'kanazawa',
  katamachi: 'kanazawa', nagamachi: 'kanazawa', omicho: 'kanazawa', hirosaka: 'kanazawa',
  'kutani-yaki': 'kanazawa', kutani: 'kanazawa', 'higashi chaya': 'kanazawa',
  'kazue-machi': 'kanazawa', 'kenroku-en': 'kanazawa', saigawa: 'kanazawa',

  // --- Kyoto -------------------------------------------------------------
  kyoto: 'kyoto',
  gion: 'kyoto', arashiyama: 'kyoto', fushimi: 'kyoto', higashiyama: 'kyoto',
  pontocho: 'kyoto', nishiki: 'kyoto', teramachi: 'kyoto', sannenzaka: 'kyoto',
  kibune: 'kyoto', kurama: 'kyoto', yase: 'kyoto', demachiyanagi: 'kyoto',
  'to-ji': 'kyoto', 'kinkaku-ji': 'kyoto', 'hokan-ji': 'kyoto', 'ryoan-ji': 'kyoto',
  'nanzen-ji': 'kyoto', 'tofuku-ji': 'kyoto', 'eikan-do': 'kyoto', 'ginkaku-ji': 'kyoto',
  'kiyomizu-dera': 'kyoto', nijo: 'kyoto', 'nijō': 'kyoto', rurikoin: 'kyoto',
  'rurikō-in': 'kyoto', nishinokyo: 'kyoto',
  // excursions depuis Kyoto
  uji: 'kyoto', 'byodo-in': 'kyoto',

  // --- Osaka -------------------------------------------------------------
  osaka: 'osaka',
  namba: 'osaka', dotonbori: 'osaka', shinsekai: 'osaka', umeda: 'osaka',
  nakazakicho: 'osaka', amerikamura: 'osaka', shinsaibashi: 'osaka', denden: 'osaka',
  kuromon: 'osaka', doguyasuji: 'osaka', sumiyoshi: 'osaka', nagai: 'osaka',
  tennoji: 'osaka', nipponbashi: 'osaka', tsutenkaku: 'osaka', 'ura-namba': 'osaka',
  // excursions depuis Osaka
  nara: 'osaka', 'todai-ji': 'osaka', 'kasuga': 'osaka', 'nigatsu-do': 'osaka',
  nakatanidou: 'osaka', himeji: 'osaka', kobe: 'osaka',

  // --- Hakone ------------------------------------------------------------
  hakone: 'hakone',
  gora: 'hakone', owakudani: 'hakone', togendai: 'hakone', 'hakone-yumoto': 'hakone',
  hatajuku: 'hakone', 'moto-hakone': 'hakone', odawara: 'hakone', 'd’odawara': 'hakone',
  ashi: 'hakone', tenzan: 'hakone', pola: 'hakone', yosegi: 'hakone',
};

// Enseignes et catégories qu'on trouve dans tout le pays : pas de ville.
export const NATIONWIDE = new Set([
  'Skincare Matsukiyo',   // pharmacies Matsumoto Kiyoshi, partout
  'Depachika',            // les sous-sols de tous les grands magasins
  'KitKat japonais',      // konbini et boutiques d'aéroport
]);

// Intitulés de section du guide -> ville, quand la section en nomme une.
export const HEADING_TO_CITY = {
  'tokyo': 'tokyo', 'depuis tokyo': 'tokyo', 'les adresses — tokyo': 'tokyo',
  'kanazawa': 'kanazawa', 'les adresses — kanazawa & nara': 'kanazawa',
  'kyoto': 'kyoto', 'depuis kyoto': 'kyoto', 'les adresses — kyoto': 'kyoto',
  'osaka': 'osaka', 'depuis osaka': 'osaka', 'les adresses — osaka': 'osaka',
  'hakone': 'hakone', 'hakone & nikko': 'hakone',
  'nara': 'osaka', 'yokohama': 'tokyo', 'kamakura & enoshima': 'tokyo',
  'hakone, nara & osaka': 'hakone', 'en chemin': 'kanazawa',
};

/**
 * Devine la ville d'un spot. Renvoie { cityId, area, via } ou null si indécidable.
 * `cityId: null` avec `via: 'partout'` est un résultat valide, pas un échec : ce sont
 * les enseignes nationales (Don Quijote, 2nd Street, KitKat) qu'on trouve n'importe où.
 * `via` dit d'où vient la décision, pour pouvoir auditer le résultat.
 */
export function resolveCity({ mapsQuery, name, heading, blurb }) {
  // 0) enseignes nationales : leur donner une ville serait une fausse information.
  if (/\bpartout\b/i.test(blurb || '') || NATIONWIDE.has((name || '').trim())) {
    return { cityId: null, area: null, via: 'partout' };
  }

  const hay = `${mapsQuery || ''} ${name || ''} ${blurb || ''}`.toLowerCase();

  // 1) un quartier ou une ville nommé quelque part dans la requête Maps ou le nom.
  //    On teste les clés les plus longues d'abord : « higashi chaya » avant « chaya ».
  const keys = Object.keys(AREA_TO_CITY).sort((a, b) => b.length - a.length);
  for (const k of keys) {
    const re = new RegExp(`(^|[^a-zà-ÿ-])${escapeRe(k)}([^a-zà-ÿ-]|$)`, 'i');
    if (re.test(hay)) return { cityId: AREA_TO_CITY[k], area: k, via: 'gazetteer' };
  }

  // 2) repli : l'intitulé de la section, quand il nomme une ville.
  const h = normalizeHeading(heading);
  if (HEADING_TO_CITY[h]) return { cityId: HEADING_TO_CITY[h], area: null, via: 'heading' };

  return null;
}

export function normalizeHeading(heading = '') {
  return heading
    .replace(/<small>[\s\S]*?<\/small>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
    .trim()
    .toLowerCase();
}

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
