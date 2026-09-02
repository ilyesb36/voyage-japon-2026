// Assertions d'intégrité sur data/*.js.
// Les nombres attendus viennent du site d'avant la refonte : toute divergence
// est une perte de données, pas un ajustement. `node tools/verify.mjs`.

import { TRIP, CITIES, STEPS, EXCURSIONS, SEGMENTS, HOTELS, FLIGHTS, BUDGET, RESERVATIONS } from '../data/trip.js';
import { DAYS, TEMPLATES } from '../data/days.js';
import { SPOTS, CATEGORIES, PRIORITIES } from '../data/spots.js';
import { AVANT, SURPLACE, RESERVER, METEO } from '../data/pratique.js';
import { LIEUX } from '../data/lieux.js';
import fs from 'node:fs';

const NOUVEAUX_NOMS = new Set(
  JSON.parse(fs.readFileSync(new URL('./lib/spots-nouveaux.json', import.meta.url), 'utf8')).map((x) => x.name),
);

let failures = 0, checks = 0, pending = 0;

function ok(label, actual, expected) {
  checks++;
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  if (!pass) { failures++; console.log(`  ✗ ${label}\n      attendu ${JSON.stringify(expected)}, obtenu ${JSON.stringify(actual)}`); }
  else console.log(`  ✓ ${label}`);
}

function assert(label, cond, detail = '') {
  checks++;
  if (!cond) { failures++; console.log(`  ✗ ${label}${detail ? `\n      ${detail}` : ''}`); }
  else console.log(`  ✓ ${label}`);
}

function todo(label, reason) {
  pending++;
  console.log(`  … ${label} — en attente (${reason})`);
}

// --- totaux de référence ------------------------------------------------------

console.log('\nTotaux de référence');
// La sélection d'origine ne doit jamais bouger : c'est elle qu'on vérifie.
// Les ajouts sont comptés à part, pour qu'une perte dans l'une ne puisse pas
// être masquée par un gain dans l'autre.
const originaux = SPOTS.filter((s) => s.source !== 'claude');
const ajouts = SPOTS.filter((s) => s.source === 'claude');
// 236 à l'origine, moins 16 retirés volontairement (voir guide-removals.mjs).
ok('220 spots d\'origine (236 − 16 retirés)', originaux.length, 220);
// Les conseils de l'amie guide sont intouchables : ce compte ne doit jamais bouger.
ok('22 conseils de l\'amie guide', originaux.filter((s) => s.source === 'guide').length, 22);
// 57 au premier lot, 16 au second (cafés de spécialité, bars, disquaires,
// ouvertures 2025-2026) — voir tools/lib/spots-nouveaux.json.
ok('73 idées ajoutées', ajouts.length, 73);
// Le premier lot venait de Commons, qui couvre bien les temples et les jardins.
// Le second lot est fait de cafés de spécialité, de bars et de disquaires : ils
// ne sont pas sur Commons, et un garde-fou anti-homonyme refuse d'illustrer
// « SG Club » avec le Singapore Recreation Club. Une fiche sans photo est
// acceptable ; une fiche avec la photo d'un autre lieu ne l'est pas.
const sansPhoto = ajouts.filter((s) => !s.img);
assert(`au moins 55 ajouts illustrés (${ajouts.length - sansPhoto.length} sur ${ajouts.length})`,
  ajouts.length - sansPhoto.length >= 55, sansPhoto.map((s) => s.name).join(', '));
assert('les ajouts sans photo sont tous du second lot',
  sansPhoto.every((s) => NOUVEAUX_NOMS.has(s.name)),
  sansPhoto.filter((s) => !NOUVEAUX_NOMS.has(s.name)).map((s) => s.name).join(', '));

ok('25 jours', DAYS.length, 25);
ok('30 journées type', TEMPLATES.length, 30);
ok('6 hôtels', HOTELS.length, 6);
ok('6 étapes', STEPS.length, 6);
ok('4 excursions', EXCURSIONS.length, 4);
ok('5 segments de trajet', SEGMENTS.length, 5);
ok('2 vols', FLIGHTS.length, 2);
assert('chaque vol a ses 2 segments et son escale',
  FLIGHTS.every((f) => f.legs.length === 2 && f.layover && f.legs.every((l) => l.from && l.to && l.depart && l.flight)),
  'un vol est incomplet');
ok('23 nuits', STEPS.reduce((n, s) => n + s.nights, 0), 23);
ok('TRIP.nights cohérent', TRIP.nights, 23);

// --- argent -------------------------------------------------------------------

console.log('\nBudget');
// 3 259 € et non 3 274 € : les montants saisis dans l'ancien site étaient
// arrondis au-dessus sur les six lignes. Ceux-ci viennent des confirmations
// Booking du 27/08/2026 — voir tools/lib/bookings.mjs.
const hebergement = HOTELS.reduce((s, h) => s + h.price, 0);
ok('total hébergement calculé = 3 259 €', hebergement, 3259);

// Le total se calcule comme la page le calcule : en balayant TOUTES les
// catégories. La version précédente additionnait une liste écrite à la main,
// si bien qu'une nouvelle catégorie passait sous le radar — l'assertion
// restait verte pendant que la page affichait autre chose.
const MULT = { vol: 2, train: 2, food: 24 * 2, act: 24 * 2 };
const ligne = (i) => {
  if (i.fromHotel) return HOTELS.find((h) => h.id === i.fromHotel).price;
  if (i.fix != null) return i.fix;
  return (BUDGET.defaults[i.dyn] || 0) * MULT[i.dyn];
};
const total = BUDGET.categories.reduce((s, c) => s + c.items.reduce((t, i) => t + ligne(i), 0), 0);

const sansMultiplicateur = BUDGET.categories
  .flatMap((c) => c.items)
  .filter((i) => i.dyn && !MULT[i.dyn]).map((i) => i.key);
assert('chaque ligne dynamique a un multiplicateur connu',
  sansMultiplicateur.length === 0, sansMultiplicateur.join(', '));

// 7 321 € avant l'achat du billet Nintendo, 7 359 € après.
ok('total du voyage = 7 359 €', total, 7359);
ok('par personne = 3 679,50 €', total / 2, 3679.5);

assert(
  'le poste hébergement est calculé, pas saisi',
  BUDGET.categories.find((c) => c.id === 'heb').items.every((i) => i.fromHotel && i.fix == null),
  'un item du poste hébergement porte encore un montant en dur'
);

// --- réservations -------------------------------------------------------------

console.log('\nRéservations');
const HOTEL_FIELDS = ['room', 'capacity', 'address', 'checkIn', 'checkOut', 'bath', 'amenities', 'price', 'perNight'];
for (const f of HOTEL_FIELDS) {
  const missing = HOTELS.filter((h) => h[f] == null).map((h) => h.name);
  assert(`les 6 hôtels ont « ${f} »`, missing.length === 0, missing.join(', '));
}

const AMENITY_KEYS = ['kitchen', 'washer', 'dryer', 'fridge', 'microwave', 'balcony', 'ac'];
assert('les 6 hôtels déclarent les mêmes équipements',
  HOTELS.every((h) => AMENITY_KEYS.every((k) => typeof h.amenities[k] === 'boolean')),
  'un équipement est indéfini quelque part — il doit valoir true ou false, jamais manquer');

const paid = HOTELS.filter((h) => h.paid).reduce((s, h) => s + h.price, 0);
ok('déjà réglé = 1 161 € (Hop Inn + Matatabi)', paid, 1161);
ok('reste à régler sur l\'hébergement = 2 098 €', hebergement - paid, 2098);

// Ce que la page Paiements coche d'office : hôtels prépayés + billets datés
// déjà payés. C'est un fait, pas une case à cocher par l'utilisateur.
const regle = BUDGET.categories.flatMap((c) => c.items)
  .filter((i) => i.settled || (i.fromHotel && HOTELS.find((h) => h.id === i.fromHotel).paid))
  .reduce((s, i) => s + ligne(i), 0);
ok('déjà réglé au total = 1 199 € (2 hôtels + Nintendo)', regle, 1199);

assert('la date limite d\'annulation du ryokan est connue',
  HOTELS.find((h) => h.id.includes('fukuya')).cancelBefore === '2026-10-27');

// --- intégrité référentielle --------------------------------------------------

console.log('\nIntégrité référentielle');
const cityIds = new Set(Object.keys(CITIES));
const hotelIds = new Set(HOTELS.map((h) => h.id));
const stepIds = new Set(STEPS.map((s) => s.id));

assert('chaque étape référence un hôtel existant',
  STEPS.every((s) => hotelIds.has(s.hotelId)),
  STEPS.filter((s) => !hotelIds.has(s.hotelId)).map((s) => s.id).join(', '));

assert('chaque étape a une ville connue',
  STEPS.every((s) => cityIds.has(s.cityId)));

assert('chaque hôtel référence une étape existante',
  HOTELS.every((h) => stepIds.has(h.stepId)));

assert('chaque excursion part d\'une étape existante',
  EXCURSIONS.every((e) => stepIds.has(e.fromStepId)));

assert('chaque segment relie deux étapes existantes',
  SEGMENTS.every((g) => stepIds.has(g.fromStepId) && stepIds.has(g.toStepId)));

const badSpots = SPOTS.filter((s) => s.cityId !== null && !cityIds.has(s.cityId));
assert('chaque spot a une ville connue (ou null = partout)',
  badSpots.length === 0,
  badSpots.map((s) => `${s.name} -> ${s.cityId}`).join(', '));

const badDays = DAYS.filter((d) => d.cityId && !cityIds.has(d.cityId));
assert('chaque jour a une ville connue', badDays.length === 0,
  badDays.map((d) => `${d.label} -> ${d.cityId}`).join(', '));

const catIds = new Set(CATEGORIES.map((c) => c.id));
const prioIds = new Set(PRIORITIES.map((p) => p.id));
assert('chaque spot a une catégorie connue', SPOTS.every((s) => catIds.has(s.category)));
assert('chaque spot a une priorité connue', SPOTS.every((s) => prioIds.has(s.priority)));

// Les 265 fiches doivent porter les mêmes lignes : sans ça, la fiche de
// détail affiche des trous d'une adresse à l'autre.
for (const f of ['duration', 'budget', 'when']) {
  const missing = SPOTS.filter((s) => !s[f]).map((s) => s.name);
  assert(`chaque spot a « ${f} »`, missing.length === 0,
    `${missing.length} sans : ${missing.slice(0, 5).join(', ')}`);
}

// --- notices historiques ------------------------------------------------------

console.log('\nNotices');
const avecLore = SPOTS.filter((s) => s.lore);
assert(`au moins 145 lieux ont une notice (${SPOTS.filter((s) => s.lore).length})`,
  SPOTS.filter((s) => s.lore).length >= 145);

// Le vrai critère n'est pas un total mais une couverture : un monument sans
// notice est un trou, une boutique sans notice n'en est pas un — il n'y a
// souvent rien d'historique à dire d'un Uniqlo.
const monumentsNus = SPOTS.filter((s) => s.category === 't0' && !s.lore).map((s) => s.name);
assert('aucun monument sans notice', monumentsNus.length === 0, monumentsNus.join(' | '));
assert('chaque ville a des notices',
  ['tokyo', 'kanazawa', 'kyoto', 'osaka', 'hakone']
    .every((c) => SPOTS.some((s) => s.cityId === c && s.lore)),
  ['tokyo', 'kanazawa', 'kyoto', 'osaka', 'hakone']
    .filter((c) => !SPOTS.some((s) => s.cityId === c && s.lore)).join(', '));
assert('chaque notice fait entre 120 et 500 signes',
  avecLore.every((s) => s.lore.length >= 120 && s.lore.length <= 500),
  avecLore.filter((s) => s.lore.length < 120 || s.lore.length > 500).map((s) => `${s.name} (${s.lore.length})`).join(', '));
assert('les incontournables de Kyoto ont une notice',
  ['Fushimi Inari', 'Kinkaku-ji', 'Kiyomizu-dera', 'Tofuku-ji'].every((n) => SPOTS.find((s) => s.name === n)?.lore));

// --- tarifs vérifiés ----------------------------------------------------------

console.log('\nTarifs vérifiés');
const byName = new Map(SPOTS.map((s) => [s.name, s]));
for (const [name, expected] of [
  ['Château d’Osaka', '1 200 ¥'],
  ['Eikan-do', '1 500 ¥ (automne) · 1 000 ¥ la nuit'],
  ['Enko-ji', '1 500 ¥ en automne · résa obligatoire'],
  ['Shibuya Sky', '2 700–3 400 ¥ en ligne'],
]) {
  ok(`${name} — tarif corrigé`, byName.get(name)?.budget, expected);
}
assert('teamLab Botanical Garden est bien rangé à Osaka',
  byName.get('teamLab Botanical Garden')?.cityId === 'osaka',
  "l'ancien site le plaçait à Tokyo : il est à Nagai, Osaka");

// --- unicité ------------------------------------------------------------------

console.log('\nUnicité');
for (const [label, list] of [['spots', SPOTS], ['hôtels', HOTELS], ['étapes', STEPS], ['journées type', TEMPLATES], ['excursions', EXCURSIONS]]) {
  const ids = list.map((x) => x.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  assert(`identifiants uniques — ${label}`, dupes.length === 0, [...new Set(dupes)].join(', '));
}

// --- jours --------------------------------------------------------------------

console.log('\nJours');
const dates = DAYS.map((d) => d.date);
assert('les dates sont strictement croissantes',
  dates.every((d, i) => i === 0 || d > dates[i - 1]),
  dates.filter((d, i) => i > 0 && d <= dates[i - 1]).join(', '));
ok('premier jour = 8 novembre', DAYS[0].date, '2026-11-08');
ok('dernier jour = 2 décembre', DAYS[DAYS.length - 1].date, '2026-12-02');
assert('chaque jour a au moins une ligne de programme', DAYS.every((d) => d.items.length > 0));

// Les journées enrichies : hors vols, un jour doit tenir la journée.
const courts = DAYS.filter((d) => d.kind !== 'vol' && d.items.length < 5).map((d) => `${d.label} (${d.items.length})`);
assert('chaque jour hors vol a au moins 5 lignes', courts.length === 0, courts.join(', '));
// Un plancher, pas un compte exact : ce qu'on surveille est la PERTE. Le
// chiffre exact cassait à chaque ligne ajoutée à raison, ce qui apprenait à
// relever le nombre sans réfléchir — exactement ce qu'une assertion ne doit
// pas devenir. 155 est le total du site d'avant la refonte.
const lignes = DAYS.reduce((n, d) => n + d.items.length, 0);
assert(`au moins 155 lignes de programme (${lignes})`, lignes >= 155);
assert('les lignes du soir sont en fin de journée',
  DAYS.every((d) => d.items.every((it, i, a) => !it.evening || a.slice(i).every((x) => x.evening))));

// --- contenu ------------------------------------------------------------------

console.log('\nContenu');
assert('aucun nom vide', [...SPOTS, ...HOTELS, ...TEMPLATES].every((x) => x.name || x.title));
assert('les caractères japonais ont survécu',
  HOTELS.some((h) => /[　-鿿]/.test(h.name)),
  'aucun hôtel ne contient de kanji — 川HOUSE Kuromon a dû être mal décodé');
assert('les apostrophes typographiques ont survécu',
  SPOTS.some((s) => s.blurb.includes('’')),
  'aucune apostrophe ’ trouvée — probable double décodage');
assert('aucune entité HTML résiduelle',
  ![...SPOTS, ...HOTELS].some((x) => /&(amp|lt|gt|quot|#39|nbsp);/.test(JSON.stringify(x))));

// --- réservations datées ------------------------------------------------------
// Un billet daté est la seule chose du voyage qu'on ne peut pas rattraper :
// ces valeurs sont recopiées du billet, elles ne doivent jamais dériver.

console.log('\nBillets datés');
const nintendo = RESERVATIONS.find((r) => r.id === 'resa-nintendo');
assert('le billet Nintendo Museum est présent', !!nintendo);
ok('  daté du 18 novembre 2026', nintendo?.date, '2026-11-18');
ok('  créneau 14:00 – 14:30', nintendo?.slot, '14:00 – 14:30');
ok('  2 personnes, payé', [nintendo?.people, nintendo?.status], [2, 'payé']);
assert('chaque billet daté tombe sur un jour du voyage',
  RESERVATIONS.every((r) => DAYS.some((d) => d.date === r.date)),
  RESERVATIONS.filter((r) => !DAYS.some((d) => d.date === r.date)).map((r) => r.date).join(', '));

// Le musée est à Ogura (Uji), au sud-est ; Arashiyama est à l'ouest. Les deux
// le même jour, c'est 1h15 de train en plein après-midi : la journée du 18 ne
// doit plus jamais repasser par Arashiyama.
const j18 = DAYS.find((d) => d.date === '2026-11-18');
assert('le 18 novembre ne repart pas à Arashiyama',
  !/arashiyama|bambouseraie|togetsukyo|tenryu/i.test(JSON.stringify(j18?.items)));
assert('Arashiyama a bien une journée à lui',
  DAYS.some((d) => /Arashiyama/i.test(d.title || '')));
assert('chaque spot cité par une réservation existe',
  RESERVATIONS.every((r) => !r.spotId || SPOTS.some((s) => s.id === r.spotId)),
  RESERVATIONS.filter((r) => r.spotId && !SPOTS.some((s) => s.id === r.spotId)).map((r) => r.spotId).join(', '));

// --- à réserver ---------------------------------------------------------------
// Une échéance dans le passé, ou après le départ, ne sert à rien. Et une
// échéance qui tombe après la journée concernée est une erreur de saisie.

console.log('\nÀ réserver');
// Ce qui n'est rattaché à aucune journée (papiers, pass) doit être bouclé
// avant de partir. Ce qui vise une journée peut se réserver depuis le Japon —
// l'illumination de Rikugi-en, par exemple, est pour le 1er décembre.
assert('les démarches sans date de visite sont bouclées avant le départ',
  RESERVER.every((r) => r.forDate || r.deadline < TRIP.start),
  RESERVER.filter((r) => !r.forDate && r.deadline >= TRIP.start).map((r) => r.id).join(', '));
assert('aucune échéance après la fin du voyage',
  RESERVER.every((r) => r.deadline <= TRIP.end));
assert('chaque échéance précède la journée concernée',
  RESERVER.every((r) => !r.forDate || r.deadline < r.forDate),
  RESERVER.filter((r) => r.forDate && r.deadline >= r.forDate).map((r) => r.id).join(', '));
assert('chaque journée concernée est un jour du voyage',
  RESERVER.every((r) => !r.forDate || DAYS.some((d) => d.date === r.forDate)),
  RESERVER.filter((r) => r.forDate && !DAYS.some((d) => d.date === r.forDate)).map((r) => r.id).join(', '));
// Le dîner kaiseki est confirmé auprès du ryokan (18:30 les deux soirs) : il a
// quitté la liste « à réserver ». Ce qui reste vérifié, c'est que la fiche du
// ryokan ne dise plus « à confirmer » — les deux ne peuvent pas coexister.
const fukuya = HOTELS.find((h) => h.cityId === 'hakone');
assert('le ryokan n\'annonce plus un dîner « à confirmer »',
  !/à confirmer/i.test(fukuya?.meals || ''), fukuya?.meals);
assert('le protocole d\'arrivée du ryokan est renseigné', !!fukuya?.arrivee);
assert('le kaiseki ne figure plus dans les choses à réserver',
  !RESERVER.some((r) => r.id === 'kaiseki-fukuya'));
// AVANT et RESERVER partagent l'espace des identifiants : « pass » existait
// dans les deux, et une injection de lien a atterri dans le mauvais des deux.
// Les listes disaient d'ailleurs la même chose deux fois.
const collisions = AVANT.filter((a) => RESERVER.some((r) => r.id === a.id)).map((a) => a.id);
assert('aucun identifiant partagé entre « à faire » et « à réserver »',
  collisions.length === 0, collisions.join(', '));

// Un lien mort est pire que pas de lien : on cliquerait en croyant réserver.
const liensDouteux = [...AVANT, ...RESERVER]
  .filter((x) => x.url && !/^https:\/\//.test(x.url)).map((x) => x.id);
assert('chaque lien est en https', liensDouteux.length === 0, liensDouteux.join(', '));

// Ce qui ne se réserve pas n'a rien à faire dans une liste « à réserver » :
// Eikan-do et Kodai-ji vendent leur billet de nuit sur place, ils en sont
// sortis. Toute entrée qui reste doit dire par quel canal on s'y prend.
const sansCanal = RESERVER.filter((r) => !r.canal).map((r) => r.id);
assert('chaque réservation dit par quel canal on la fait',
  sansCanal.length === 0, sansCanal.join(', '));

assert('identifiants uniques — à réserver',
  new Set(RESERVER.map((r) => r.id)).size === RESERVER.length);

// « résa conseillée » était le défaut de toute la catégorie Expériences : porté
// par 29 lieux qui ne se réservent pas, il ne voulait plus rien dire.
const resaBruit = SPOTS.filter((s) => s.when === 'résa conseillée').map((s) => s.name);
assert('« résa conseillée » n\'est plus un défaut de catégorie',
  resaBruit.length === 0, resaBruit.join(', '));

// --- les lieux du programme ---------------------------------------------------
// Une coordonnée fausse envoie marcher au mauvais endroit : c'est pire que pas
// de coordonnée. Le piège principal est l'homonyme — plusieurs temples portent
// le même nom dans des préfectures différentes.

console.log('\nLieux du programme');
const CENTRES = {
  tokyo: [35.68, 139.75], kanazawa: [36.56, 136.66], kyoto: [35.01, 135.77],
  osaka: [34.69, 135.50], hakone: [35.20, 139.03],
};
const km = (a, b, c, d) => {
  const R = 6371, r = (x) => (x * Math.PI) / 180;
  const dl = r(c - a), dg = r(d - b);
  const h = Math.sin(dl / 2) ** 2 + Math.cos(r(a)) * Math.cos(r(c)) * Math.sin(dg / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

const lieux = Object.entries(LIEUX);
assert(`au moins 140 lieux géolocalisés (${lieux.length})`, lieux.length >= 140);
assert('chaque lieu est au Japon',
  lieux.every(([, l]) => l.lat > 30 && l.lat < 46 && l.lng > 128 && l.lng < 146),
  lieux.filter(([, l]) => !(l.lat > 30 && l.lat < 46 && l.lng > 128 && l.lng < 146)).map(([k]) => k).join(', '));
assert('chaque lieu a une ville connue',
  lieux.every(([, l]) => CENTRES[l.cityId]),
  lieux.filter(([, l]) => !CENTRES[l.cityId]).map(([k]) => k).join(', '));

// Nikko est à 120 km de Tokyo et s'y rattache : c'est une excursion, pas une
// erreur. Au-delà de 150 km, c'est un homonyme.
const egares = lieux.filter(([, l]) => {
  const c = CENTRES[l.cityId];
  return c && km(c[0], c[1], l.lat, l.lng) > 150;
}).map(([k, l]) => `${k} (${l.cityId})`);
assert('aucun lieu à plus de 150 km de sa ville', egares.length === 0, egares.join(', '));

// Le lieu fermé ne doit plus être une destination.
assert('Honke Owariya, fermé, ne figure plus dans les lieux', !LIEUX['honke-owariya']);

// Chaque ligne de programme qui porte des lieux doit les porter tous.
const lignesSituees = DAYS.flatMap((d) => d.items).filter((i) => i.lieux);
assert(`au moins 120 lignes de programme situées (${lignesSituees.length})`, lignesSituees.length >= 120);
assert('chaque lieu cité par une journée existe',
  lignesSituees.every((i) => i.lieux.every((id) => LIEUX[id])),
  lignesSituees.flatMap((i) => i.lieux).filter((id) => !LIEUX[id]).join(', '));

// Un jour de visite sans aucun lieu situé serait une page vide.
const joursVides = DAYS.filter((d) => d.kind === 'etape' && !d.items.some((i) => i.lieux)).map((d) => d.date);
assert('chaque journée de visite a au moins un lieu situé', joursVides.length === 0, joursVides.join(', '));

// --- structure des pages ------------------------------------------------------
// Un <div class="wrap"> laissé ouvert sur l'accueil en enfermait un second :
// le navigateur refermait tout seul à </main>, si bien que rien ne cassait —
// mais toute la moitié basse de la page prenait un rembourrage double et se
// retrouvait plus étroite que le haut. Personne ne voit ça sans mesurer.

const pages = ['index.html', 'itineraire.html', 'guide.html', 'pratique.html', 'aujourdhui.html', 'jour.html'];

console.log('\nStructure');
for (const page of pages) {
  const src = fs.readFileSync(new URL(`../${page}`, import.meta.url), 'utf8')
    .split('<script type="module">')[0];
  const ouverts = (src.match(/<div\b/g) || []).length;
  const fermes = (src.match(/<\/div>/g) || []).length;
  assert(`${page} — balises div équilibrées`, ouverts === fermes, `${ouverts} ouvertes, ${fermes} fermées`);
}

// .wrap pose max-width ET padding : en emboîter deux rétrécit deux fois.
for (const page of pages) {
  const src = fs.readFileSync(new URL(`../${page}`, import.meta.url), 'utf8')
    .split('<script type="module">')[0];
  let prof = 0; const pile = []; let imbrique = 0;
  for (const m of src.matchAll(/<(\/?)(\w+)([^>]*)>/g)) {
    const [, fermeture, tag, attrs] = m;
    if (['meta', 'link', 'img', 'br', 'input', 'hr', 'path', 'circle'].includes(tag)) continue;
    if (fermeture) { if (pile.length && pile[pile.length - 1] === prof - 1) pile.pop(); prof--; }
    else {
      const cls = attrs.match(/class="([^"]*)"/);
      if (cls && cls[1].split(/\s+/).includes('wrap')) { if (pile.length) imbrique++; pile.push(prof); }
      prof++;
    }
  }
  assert(`${page} — aucun .wrap dans un .wrap`, imbrique === 0, `${imbrique} imbrication(s)`);
}

// --- coque hors-ligne ---------------------------------------------------------
// app/resa.js avait été ajouté aux pages sans être ajouté à la liste du
// service worker : hors-ligne, deux pages restaient blanches. Ça ne se voit
// qu'avec le réseau coupé, donc jamais. Cette assertion le voit tout de suite.

console.log('\nHors-ligne');
const swSrc = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const shellDeclare = new Set([...swSrc.matchAll(/'([^']+\.(?:html|css|js|webmanifest|png))'/g)].map((m) => m[1]));

const requis = new Set();
for (const page of pages) {
  const src = fs.readFileSync(new URL(`../${page}`, import.meta.url), 'utf8');
  for (const m of src.matchAll(/from '\.\/([^']+\.js)'/g)) requis.add(m[1]);
  for (const m of src.matchAll(/<script src="([^"]+\.js)"/g)) requis.add(m[1]);
  for (const m of src.matchAll(/<link[^>]+href="([^"]+\.css)"/g)) requis.add(m[1]);
}
// et les modules que les modules importent entre eux
for (const f of fs.readdirSync(new URL('../app', import.meta.url))) {
  const src = fs.readFileSync(new URL(`../app/${f}`, import.meta.url), 'utf8');
  for (const m of src.matchAll(/from '\.\/([^']+\.js)'/g)) requis.add(`app/${m[1]}`);
  for (const m of src.matchAll(/from '\.\.\/([^']+\.js)'/g)) requis.add(m[1]);
}
const oublies = [...requis].filter((f) => !shellDeclare.has(f));
assert('chaque fichier chargé par une page est dans la coque du service worker',
  oublies.length === 0, `absents de sw.js : ${oublies.join(', ')}`);

// L'inverse : un fichier listé mais disparu ferait échouer la mise en cache.
const fantomes = [...shellDeclare].filter((f) => f !== './' && !fs.existsSync(new URL(`../${f}`, import.meta.url)));
assert('aucun fichier fantôme dans la coque', fantomes.length === 0, fantomes.join(', '));

// --- images -------------------------------------------------------------------

console.log('\nImages');
const remote = [
  ...SPOTS.filter((s) => s.img && /^https?:/.test(s.img)).map((s) => s.name),
  ...HOTELS.filter((h) => h.images.some((i) => /^https?:/.test(i))).map((h) => h.name),
  ...TEMPLATES.filter((t) => t.img && /^https?:/.test(t.img)).map((t) => t.title),
  ...TEMPLATES.flatMap((t) => t.steps)
    .filter((s) => s.img && /^https?:/.test(s.img)).map((s) => s.text.slice(0, 30)),
];
if (remote.length) todo(`${remote.length} images encore distantes`, 'Task 2 — rapatriement');
else assert('toutes les images sont locales', true);

// Référencée mais absente du disque : image cassée en ligne ET hors-ligne.
// Présente mais référencée par personne : du poids mort qui s'accumule à
// chaque lieu retiré du guide.
const referencees = new Set();
const ajoute = (u) => { if (u && u.startsWith('img/')) referencees.add(u); };
SPOTS.forEach((s) => ajoute(s.img));
HOTELS.forEach((h) => h.images.forEach(ajoute));
TEMPLATES.forEach((t) => { ajoute(t.img); t.steps.forEach((e) => ajoute(e.img)); });
for (const page of pages) {
  const src = fs.readFileSync(new URL(`../${page}`, import.meta.url), 'utf8');
  for (const m of src.matchAll(/img\/[^"')]+\.(?:webp|png|jpg)/g)) referencees.add(m[0]);
}
const absentes = [...referencees].filter((u) => !fs.existsSync(new URL(`../${u}`, import.meta.url)));
assert('chaque image référencée existe sur le disque', absentes.length === 0, absentes.join(', '));

const surDisque = fs.readdirSync(new URL('../img', import.meta.url))
  .filter((f) => /\.(webp|png|jpg)$/.test(f));
const orphelines = surDisque.filter((f) => !referencees.has(`img/${f}`));
assert(`aucune image orpheline dans img/ (${surDisque.length} fichiers)`,
  orphelines.length === 0, orphelines.join(', '));

// --- verdict ------------------------------------------------------------------

console.log(`\n${failures ? '✗' : '✓'} ${checks - failures}/${checks} vérifications passées${pending ? `, ${pending} en attente` : ''}`);
process.exit(failures ? 1 : 0);
