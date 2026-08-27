// Assertions d'intégrité sur data/*.js.
// Les nombres attendus viennent du site d'avant la refonte : toute divergence
// est une perte de données, pas un ajustement. `node tools/verify.mjs`.

import { TRIP, CITIES, STEPS, EXCURSIONS, SEGMENTS, HOTELS, FLIGHTS, BUDGET } from '../data/trip.js';
import { DAYS, TEMPLATES } from '../data/days.js';
import { SPOTS, CATEGORIES, PRIORITIES } from '../data/spots.js';

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
ok('236 spots', SPOTS.length, 236);
ok('25 jours', DAYS.length, 25);
ok('30 journées type', TEMPLATES.length, 30);
ok('6 hôtels', HOTELS.length, 6);
ok('6 étapes', STEPS.length, 6);
ok('4 excursions', EXCURSIONS.length, 4);
ok('5 segments de trajet', SEGMENTS.length, 5);
ok('2 vols', FLIGHTS.length, 2);
ok('23 nuits', STEPS.reduce((n, s) => n + s.nights, 0), 23);
ok('TRIP.nights cohérent', TRIP.nights, 23);

// --- argent -------------------------------------------------------------------

console.log('\nBudget');
// 3 259 € et non 3 274 € : les montants saisis dans l'ancien site étaient
// arrondis au-dessus sur les six lignes. Ceux-ci viennent des confirmations
// Booking du 27/08/2026 — voir tools/lib/bookings.mjs.
const hebergement = HOTELS.reduce((s, h) => s + h.price, 0);
ok('total hébergement calculé = 3 259 €', hebergement, 3259);

const d = BUDGET.defaults;
const vols = d.vol * 2;
const trains = d.train * 2;
const food = d.food * 24 * 2;
const act = d.act * 24 * 2;
const passes = BUDGET.categories
  .filter((c) => c.id === 'dep')
  .flatMap((c) => c.items)
  .reduce((s, i) => s + (i.fix || 0), 0);
const total = hebergement + vols + trains + food + act + passes;
ok('total du voyage = 7 321 €', total, 7321);
ok('par personne = 3 660,50 €', total / 2, 3660.5);

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

// --- images -------------------------------------------------------------------

console.log('\nImages');
const remote = [
  ...SPOTS.filter((s) => s.img && /^https?:/.test(s.img)).map((s) => s.name),
  ...HOTELS.filter((h) => h.images.some((i) => /^https?:/.test(i))).map((h) => h.name),
  ...TEMPLATES.filter((t) => t.img && /^https?:/.test(t.img)).map((t) => t.title),
];
if (remote.length) todo(`${remote.length} images encore distantes`, 'Task 2 — rapatriement');
else assert('toutes les images sont locales', true);

// --- verdict ------------------------------------------------------------------

console.log(`\n${failures ? '✗' : '✓'} ${checks - failures}/${checks} vérifications passées${pending ? `, ${pending} en attente` : ''}`);
process.exit(failures ? 1 : 0);
