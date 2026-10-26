// Assertions d'intégrité sur data/*.js.
// Les nombres attendus viennent du site d'avant la refonte : toute divergence
// est une perte de données, pas un ajustement. `node tools/verify.mjs`.

import { TRIP, CITIES, STEPS, EXCURSIONS, SEGMENTS, HOTELS, FLIGHTS, BUDGET, RESERVATIONS } from '../data/trip.js';
import { DAYS, TEMPLATES } from '../data/days.js';
import { SPOTS, CATEGORIES, PRIORITIES } from '../data/spots.js';
import { AVANT, SURPLACE, RESERVER, METEO } from '../data/pratique.js';
import { LIEUX } from '../data/lieux.js';
import { DELICES } from '../data/delices.js';
import { TRAJETS } from '../data/valises.js';
import { fermetureInfo } from '../app/quartiers.js';
import fs from 'node:fs';

// Les lots ajoutés après le site d'origine : ce sont les seuls qui ont le
// droit de ne pas avoir de photo, Commons ne couvrant ni les cafés de
// spécialité ni les carrières souterraines.
const NOUVEAUX_NOMS = new Set(
  fs.readdirSync(new URL('./lib', import.meta.url))
    .filter((f) => /^spots-.*\.json$/.test(f))
    .flatMap((f) => JSON.parse(fs.readFileSync(new URL(`./lib/${f}`, import.meta.url), 'utf8')))
    .map((x) => x.name),
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
// 236 à l'origine, moins 16 retirés volontairement (voir guide-removals.mjs),
// plus les 94 « Secrets de Tokyo » saisis à la main le 28 septembre (source 'secrets') ;
// le 15 octobre 2026, 24 fausses adresses retirées : 23 plats ou produits génériques
// rangés comme des adresses (leur plat vit dans data/delices.js) et « Faire suivre les
// valises », qui donnait un faux prix ; le 26 octobre, le Kabuki au Shochikuza (salle fermée
// le 26 mai 2026, avant démolition).
ok('289 spots d\'origine (236 − 16 retirés + 94 Secrets de Tokyo − 24 fausses adresses − 1 salle fermée)', originaux.length, 289);
// Les conseils de l'amie guide sont intouchables : ce compte ne bouge que par un
// retrait volontaire, daté.
// 20 depuis le 15 octobre 2026 : deux fiches en sont sorties, « Faire suivre les valises »
// (faux prix) et « Yuba de Nikko » (un plat, désormais dans data/delices.js).
// 19 depuis le 26 octobre 2026 : le Shochikuza d'Osaka a fermé le 26 mai 2026.
ok('19 conseils de l\'amie guide', originaux.filter((s) => s.source === 'guide').length, 19);
// 57 au premier lot, 16 au second (cafés, bars, disquaires, ouvertures
// 2025-2026), 13 au troisième (les lieux insolites, catégorie t6) = 99 ;
// le 28 septembre, 13 retirées et 14 ajoutées à la main ; le 14 octobre,
// 31 tables (tools/lib/spots-tables.json) et 11 événements datés ; le 26 octobre, 5 fêtes
// ajoutées (Kitano, Shōren-in, Shinnō-sai, Azabudai, Yebisu) et le Tori-no-ichi retiré (hors séjour).
ok('147 idées ajoutées (99 − 13 + 14 + 31 tables + 11 événements + 1 à Uji + 5 fêtes − 1)', ajouts.length, 147);
// Le premier lot venait de Commons, qui couvre bien les temples et les jardins.
// Le second lot est fait de cafés de spécialité, de bars et de disquaires : ils
// ne sont pas sur Commons, et un garde-fou anti-homonyme refuse d'illustrer
// « SG Club » avec le Singapore Recreation Club. Une fiche sans photo est
// acceptable ; une fiche avec la photo d'un autre lieu ne l'est pas.
const sansPhoto = ajouts.filter((s) => !s.img);
assert(`au moins 55 ajouts illustrés (${ajouts.length - sansPhoto.length} sur ${ajouts.length})`,
  ajouts.length - sansPhoto.length >= 55, sansPhoto.map((s) => s.name).join(', '));
// Les restaurants, cafés, bars et événements datés ne sont pas sur Commons non plus.
const sansPhotoOk = (s) => NOUVEAUX_NOMS.has(s.name) || ['resto', 'cafe', 'bar', 'event'].includes(s.kind);
assert('les ajouts sans photo sont tous des lots récents, des tables ou des événements',
  sansPhoto.every(sansPhotoOk),
  sansPhoto.filter((s) => !sansPhotoOk(s)).map((s) => s.name).join(', '));

ok('25 jours', DAYS.length, 25);
// 30, plus les journées type ajoutées le 28 septembre (Kyoto la nuit, Osaka gourmande…).
ok('34 journées type', TEMPLATES.length, 34);
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
// 7 359 € jusqu'au 14 octobre, plus les 10 tables à réserver (691 €) et trois
// billets datés (teamLab, Shibuya Sky, Rikugi-en : 94 €), ajoutés ce jour-là ;
// le 15 octobre, les passes Hakone (3 jours) et Nikko à leur prix réel, avec l'express
// Tobu prévu au programme (+62 €) ;
// le 16 octobre, une ligne pour les valises — Yamato le 27 novembre (≈ 6 040 ¥) et les casiers
// des trajets 2 et 3 (≈ 3 200 ¥, 1 600 ¥ chacun, comme la page Valises), soit 53 € au taux du
// budget (+53 €) ;
// le 19 octobre, Junsei (82 €, déplacé au 19 nov.) et teamLab (60 €) réservés sur Klook, à leur
// prix payé au lieu de l'estimation (+30 € et +16 €) ;
// le 19 octobre aussi, les tables ramenées à trois (Mitsukawa, The Sky le 10 nov. au soir, Tokyo Ten
// le 30 nov. à midi), à leur prix réservé : −372 € de tables retirées, +129 € et −40 € (−283 €).
// le 22 octobre, l'excursion d'Arashiyama du 21 nov. (train Sagano + bateau Hozu, 157 €, Klook) :
// total impair, chacun doit 4 089,5 €, la page écrit « ≈ 4 090 € » ;
// le 26 octobre, Rikugi-en acheté au guichet (1 200 ¥ au lieu de 1 000 ¥ en ligne, +2 €).
ok('total du voyage = 8 181 €', total, 8181);
ok('par personne = 4 090,5 €', total / 2, 4090.5);

// Le budget donne son taux : les équivalents en yens de la page, et les montants `fix` en yens
// arrondis en euros, s'y règlent. La ligne des valises suit la page Valises (une seule version de
// chaque information) : le centre Yamato (le `cout2` du trajet qui s'y fait) plus les casiers (le
// `cout2` des autres trajets qui ont un coût en yens), convertis au taux du budget. « ≈ 1 600 ¥ » → 1600.
assert('le budget donne son taux de change (¥ pour 1 €)', Number.isInteger(BUDGET.yenParEuro) && BUDGET.yenParEuro > 100, BUDGET.yenParEuro);
const yens = (cout) => Number(((/(\d[\d\s]*)¥/.exec(cout) || [])[1] || '0').replace(/\s/g, ''));
const parMilliers = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const yamato = TRAJETS.filter((t) => t.decision === 'Au centre Yamato').reduce((somme, t) => somme + yens(t.cout2), 0);
const casiers = TRAJETS.filter((t) => t.decision !== 'Au centre Yamato').reduce((somme, t) => somme + yens(t.cout2), 0);
const ligneValises = BUDGET.categories.flatMap((c) => c.items).find((i) => i.key === 'valises');
ok(`la ligne valises = Yamato (${yamato} ¥) + casiers (${casiers} ¥) de la page Valises, au taux du budget`,
  ligneValises?.fix, Math.round((yamato + casiers) / BUDGET.yenParEuro));
assert('la ligne valises écrit les mêmes yens que la page Valises (Yamato et casiers)',
  !!ligneValises && ligneValises.sub.includes(`(≈ ${parMilliers(yamato)} ¥)`) && ligneValises.sub.includes(`casiers (≈ ${parMilliers(casiers)} ¥)`),
  `${ligneValises?.sub} ≠ Yamato ${parMilliers(yamato)} ¥, casiers ${parMilliers(casiers)} ¥`);

assert(
  'le poste hébergement est calculé, pas saisi',
  BUDGET.categories.find((c) => c.id === 'heb').items.every((i) => i.fromHotel && i.fix == null),
  'un item du poste hébergement porte encore un montant en dur'
);

// --- réservations -------------------------------------------------------------

console.log('\nRéservations');
const HOTEL_FIELDS = ['room', 'capacity', 'address', 'checkIn', 'checkOut', 'bath', 'amenities', 'price', 'perNight', 'gare'];
for (const f of HOTEL_FIELDS) {
  const missing = HOTELS.filter((h) => h[f] == null).map((h) => h.name);
  assert(`les 6 hôtels ont « ${f} »`, missing.length === 0, missing.join(', '));
}

const AMENITY_KEYS = ['kitchen', 'washer', 'dryer', 'fridge', 'microwave', 'balcony', 'ac'];
assert('les 6 hôtels déclarent les mêmes équipements',
  HOTELS.every((h) => AMENITY_KEYS.every((k) => typeof h.amenities[k] === 'boolean')),
  'un équipement est indéfini quelque part — il doit valoir true ou false, jamais manquer');

const paid = HOTELS.filter((h) => h.paid).reduce((s, h) => s + h.price, 0);
// Les six hôtels sont réglés depuis le 15 octobre 2026.
ok('déjà réglé = 3 259 € (les six hôtels)', paid, 3259);
ok('reste à régler sur l\'hébergement = 0 €', hebergement - paid, 0);

// Qui a payé quoi vit dans les données (BUDGET[].qui : 'I', 'M' ou 'D' à deux), pareil sur les deux téléphones.
const lignesBudget = BUDGET.categories.flatMap((c) => c.items);
const quiInvalides = lignesBudget.filter((i) => i.qui !== undefined && !['I', 'M', 'D'].includes(i.qui)).map((i) => i.key);
assert('chaque payeur vaut I, M ou D', quiInvalides.length === 0, quiInvalides.join(', '));
assert('les vols sont payés à deux', lignesBudget.find((i) => i.key === 'vol')?.qui === 'D');
assert('le Nintendo Museum a été payé par Ilyès', lignesBudget.find((i) => i.key === 'resa-nintendo')?.qui === 'I');

// Ce que la page Budget compte comme payé : une ligne qui a un payeur dans les données,
// ou un hôtel réglé. C'est un fait, pas une case à cocher sur un téléphone.
// 5 197 € le 15 octobre 2026 : les six hôtels (3 259 €), les vols (1 900 €) et Nintendo (38 €) ;
// 5 339 € le 19 octobre, avec Junsei (82 €) et teamLab (60 €), payés par Ilyès sur Klook ;
// (les trois tables TableCheck ne sont que garanties par la carte : elles se paient au restaurant).
const regle = lignesBudget
  .filter((i) => i.qui || (i.fromHotel && HOTELS.find((h) => h.id === i.fromHotel).paid))
  .reduce((s, i) => s + ligne(i), 0);
// 5 496 € le 22 octobre, avec l'excursion d'Arashiyama (157 €), payée par Ilyès.
ok('déjà réglé au total = 5 496 € (6 hôtels, vols, Nintendo, Junsei, teamLab, Arashiyama)', regle, 5496);
// 3 009 € le 15 octobre ; 3 062 € le 16 octobre, avec les valises (+53 €) ; 2 683 € le 19 octobre.
ok('reste à payer = 2 685 €', total - regle, 2685);

// Ce reste se range comme la page Budget le range : les billets et les tables non réglés sont « à
// réserver avant le départ », tout le reste est « sur place ». Les trois parts font le total.
const catDe = new Map(BUDGET.categories.flatMap((c) => c.items.map((i) => [i.key, c.id])));
const nonRegles = lignesBudget.filter((i) => !(i.qui || (i.fromHotel && HOTELS.find((h) => h.id === i.fromHotel).paid)));
const avantLeDepart = nonRegles.filter((i) => ['billets', 'tables'].includes(catDe.get(i.key))).reduce((s, i) => s + ligne(i), 0);
const surPlace = nonRegles.filter((i) => !['billets', 'tables'].includes(catDe.get(i.key))).reduce((s, i) => s + ligne(i), 0);
// 785 € le 16 octobre ; 406 € le 19 octobre : Shibuya Sky et Rikugi-en (50 €), et les trois tables
// réservées, payées au restaurant (356 €) ; 395 € le 26 octobre, Rikugi-en passé au guichet.
ok('à réserver avant le départ = 395 € (Shibuya Sky : 39 €, 3 tables : 356 €)', avantLeDepart, 395);
// 2 224 € le 15 octobre (2 passes, trains, repas et sorties) ; 2 277 € le 16 octobre, avec les valises ;
// 2 277 € le 19 octobre : le Nikko Pass (34 €) et l'express Tobu (42 €) sont des lignes à part ;
// 2 290 € le 26 octobre, avec Rikugi-en au guichet (13 €).
ok('sur place = 2 290 € (2 passes, express Tobu, trains, valises, Rikugi-en, repas et sorties)', surPlace, 2290);
ok('payé + à réserver + sur place = le total', regle + avantLeDepart + surPlace, total);

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
// Les « Secrets de Tokyo » reprennent les mots du carnet d'origine, plus courts :
// on ne les allonge pas pour tenir un gabarit.
const minLore = (s) => (s.source === 'secrets' ? 60 : 120);
assert('chaque notice fait entre 120 et 500 signes (60 pour les Secrets de Tokyo)',
  avecLore.every((s) => s.lore.length >= minLore(s) && s.lore.length <= 500),
  avecLore.filter((s) => s.lore.length < minLore(s) || s.lore.length > 500).map((s) => `${s.name} (${s.lore.length})`).join(', '));
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

// --- fermetures ---------------------------------------------------------------
// Le champ `fermeture` est du texte libre. Iki Iki Tei « fermé » le dimanche parce que sa fiche dit
// « ouvert le dimanche » : un jour cité après « ouvert », dans une parenthèse ou une condition n'est
// pas un jour de fermeture. On interroge la fonction sur une semaine entière (du dimanche 15 au
// samedi 21 novembre 2026) et on liste les jours où elle répond « fermé ».

console.log('\nFermetures');
const SEMAINE = ['2026-11-15', '2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19', '2026-11-20', '2026-11-21'];
const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const joursFermes = (fiche) => SEMAINE.filter((d) => fermetureInfo(fiche, d)?.ferme === true).map((d) => JOURS[SEMAINE.indexOf(d)]);
const iki = SPOTS.find((x) => x.id === 'spot-ikiikitei');
ok('Iki Iki Tei (« mardi… ouvert le dimanche ») : fermé le mardi seulement', joursFermes(iki), ['mardi']);
assert("Iki Iki Tei n'est pas fermé le dimanche 15 novembre, jour de sa visite", fermetureInfo(iki, '2026-11-15').ferme !== true);
ok('« mercredi (et mardi soir) » : seul le mercredi est fermé', joursFermes({ fermeture: 'mercredi (et mardi soir)' }), ['mercredi']);
// Un filet pour toutes les fiches : un texte mal lu fermerait vite plus de deux jours sur sept.
const tropFermees = SPOTS.filter((x) => x.fermeture && joursFermes(x).length > 2).map((x) => `${x.name} (${joursFermes(x).join(', ')})`);
assert('aucune fiche n\'est « fermée » plus de deux jours par semaine', tropFermees.length === 0, tropFermees.join(' | '));

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

// Les deux listes sont affichées comme une seule, triée par échéance : sans
// date sur chaque démarche, l'ordre n'aurait aucun sens.
const sansEcheance = AVANT.filter((a) => !a.deadline).map((a) => a.id);
assert('chaque démarche a une échéance', sansEcheance.length === 0, sansEcheance.join(', '));
assert('chaque démarche est à faire avant le départ',
  AVANT.every((a) => a.deadline <= TRIP.start),
  AVANT.filter((a) => a.deadline > TRIP.start).map((a) => a.id).join(', '));

// « médicaments » et « yakkan » étaient la même démarche, une dans chaque
// liste. Fusionnées, elles ne doivent pas se remettre à cohabiter.
const doubles = [...AVANT, ...RESERVER]
  .filter((x) => /yakkan|médicament/i.test(x.title)).map((x) => x.id);
assert('le certificat médicaments n\'apparaît qu\'une fois',
  doubles.length === 1, doubles.join(', '));
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
// Un lien sort en https, ou mène à une page du site qui existe (la fiche de secours).
const pageDuSite = (u) => /^[a-z-]+\.html$/.test(u) && fs.existsSync(new URL(`../${u}`, import.meta.url));
const liensDouteux = [...AVANT, ...RESERVER]
  .filter((x) => x.url && !/^https:\/\//.test(x.url) && !pageDuSite(x.url)).map((x) => x.id);
assert('chaque lien est en https ou mène à une page du site', liensDouteux.length === 0, liensDouteux.join(', '));

// Ce qui ne se réserve pas n'a rien à faire dans une liste « à réserver » :
// Eikan-do et Kodai-ji vendent leur billet de nuit sur place, ils en sont
// sortis. Toute entrée qui reste doit dire par quel canal on s'y prend.
const sansCanal = RESERVER.filter((r) => !r.canal).map((r) => r.id);
assert('chaque réservation dit par quel canal on la fait',
  sansCanal.length === 0, sansCanal.join(', '));

// L'état d'une réservation vit dans les données, pareil sur les deux téléphones :
// « à réserver » par défaut, « réservé » avec son heure. Une table ou un billet.
const etatsInvalides = RESERVER.filter((r) => r.etat !== undefined && !['a-reserver', 'reserve'].includes(r.etat)).map((r) => r.id);
assert('chaque état de réservation vaut a-reserver ou reserve', etatsInvalides.length === 0, etatsInvalides.join(', '));
const reservesSansHeure = RESERVER.filter((r) => r.etat === 'reserve' && !/^\d{2}:\d{2}$/.test(r.heure || '')).map((r) => r.id);
assert('une réservation faite a son heure (HH:MM)', reservesSansHeure.length === 0, reservesSansHeure.join(', '));
const sansType = RESERVER.filter((r) => !['table', 'billet'].includes(r.type)).map((r) => r.id);
assert("chaque réservation dit si c'est une table ou un billet", sansType.length === 0, sansType.join(', '));
// Chaque conseil « sur place » a une seule page : Secours, Transports, ou À faire (« avant »).
const sansPlace = SURPLACE.filter((s) => !s.id || !['secours', 'transports', 'avant'].includes(s.place)).map((s) => s.title);
assert('chaque conseil sur place a un identifiant et sa page', sansPlace.length === 0, sansPlace.join(', '));
assert('les bornes du séjour au Japon', TRIP.japon && TRIP.japon.du === '2026-11-09' && TRIP.japon.au === '2026-12-02');

assert('identifiants uniques — à réserver',
  new Set(RESERVER.map((r) => r.id)).size === RESERVER.length);

// « résa conseillée » était le défaut de toute la catégorie Expériences : porté
// par 29 lieux qui ne se réservent pas, il ne voulait plus rien dire.
const resaBruit = SPOTS.filter((s) => s.when === 'résa conseillée').map((s) => s.name);
assert('« résa conseillée » n\'est plus un défaut de catégorie',
  resaBruit.length === 0, resaBruit.join(', '));

// --- une seule version de chaque information ----------------------------------
// Une information qui s'écrit à deux endroits finit par s'y contredire : le 27
// novembre disait shinkansen d'un côté et Odakyu de l'autre, Sushi Tomohiro était
// « réservé » sur la journée et « à réserver » dans le budget. Chaque fait vit
// à un seul endroit, les autres le lisent.

console.log('\nUne seule version');
// Le texte d'une journée n'affirme jamais l'état d'une réservation : il vit dans RESERVER.
// Les lookarounds remplacent \b, qui ne tient pas « é » pour une lettre : « réservé »
// suivi d'un blanc ou d'une virgule lui échappait. Le conseil du jour (tip) s'affiche
// avec les lignes, il est contrôlé comme elles.
const RESERVE = /(?<![\p{L}])réservée?s?(?![\p{L}])/iu;
const affirme = DAYS.flatMap((d) => [...d.items.map((i) => i.text), d.tip || '']
  .filter((t) => RESERVE.test(t)).map((t) => `${d.date} : ${t.slice(0, 50)}`));
assert("aucune journée n'affirme un état de réservation", affirme.length === 0, affirme.join(' | '));
// Le 27 novembre, un seul trajet : le shinkansen, partout.
const seg56 = SEGMENTS.find((g) => g.fromStepId === 'step-5' && g.toStepId === 'step-6');
const laVita = HOTELS.find((h) => h.id === 'hotel-la-vita-ikebukuro-residence');
const t5 = TRAJETS.find((t) => t.n === 5);
const trajets27 = [seg56.label, laVita.route.text, t5.train];
assert('Hakone → Tokyo : le train Tozan puis le shinkansen dans SEGMENTS, la fiche de La Vita et la page Valises',
  trajets27.every((t) => /tozan/i.test(t) && /shinkansen/i.test(t) && !/odakyu/i.test(t) && !/^bus/i.test(t)), trajets27.join(' | '));
// Les valises envoyées au centre Yamato le 27 arrivent le 28 : les deux jours le disent.
const j27 = DAYS.find((d) => d.date === '2026-11-27'); const j28 = DAYS.find((d) => d.date === '2026-11-28');
assert('le 27 prévient (petit sac), le 28 prévoit le retrait au centre Yamato',
  j27.items.some((i) => /petit sac/i.test(i.text)) && j28.items.some((i) => /centre Yamato/i.test(i.text)));
// Les fausses adresses (un plat, un lien de simple recherche) ont quitté SPOTS, et leur plat vit dans DELICES.
const FAUSSES = {
  'spot-faire-suivre-les-valises': null, 'spot-sushi-a-tsukiji': 'sushi-tsukiji', 'spot-monjayaki': 'monja',
  'spot-taiyaki': 'taiyaki', 'spot-melonpan': 'melonpan', 'spot-ichigo-daifuku': 'ichigo-daifuku',
  'spot-crabe-des-neiges': 'kobako', 'spot-nodoguro': 'nodoguro', 'spot-jibuni': 'jibuni',
  'spot-oden-de-kanazawa': 'oden-kanazawa', 'spot-glace-feuille-d-or': 'kinpaku', 'spot-kaiseki': 'kaiseki-midi',
  'spot-obanzai': 'obanzai', 'spot-yudofu': 'yudofu', 'spot-nishin-soba': 'nishin-soba', 'spot-yatsuhashi': 'yatsuhashi',
  'spot-tsukemono': 'tsukemono-kyoto', 'spot-kushikatsu': 'kushikatsu', 'spot-horumon': 'horumon',
  'spot-yuba-de-nikko': 'yuba', 'spot-kamaboko-d-odawara': 'kamaboko', 'spot-soba-de-montagne': 'soba-hakone',
  'spot-kakinoha-zushi': 'kakinoha', 'spot-kaisendon-d-omicho': 'kaisendon',
};
const plats = new Set(DELICES.flatMap((c) => c.items.map((i) => i.id)));
const restees = Object.keys(FAUSSES).filter((id) => SPOTS.some((s) => s.id === id));
const platsManquants = Object.values(FAUSSES).filter((p) => p && !plats.has(p));
assert('les fausses adresses ont quitté SPOTS', restees.length === 0, restees.join(', '));
assert('chaque plat retiré des adresses vit dans DELICES', platsManquants.length === 0, platsManquants.join(', '));
// L'état d'une table ou d'un billet ne s'écrit qu'une fois, dans RESERVER : le budget le lit.
const ventilees = BUDGET.categories.filter((c) => ['tables', 'billets'].includes(c.id)).flatMap((c) => c.items);
const sousEnDur = ventilees.filter((i) => /réserv/i.test(i.sub || '')).map((i) => i.key);
const sansResa = ventilees.filter((i) => /^(table|billet)-/.test(i.key) && !RESERVER.some((r) => r.id === i.key.replace(/^(table|billet)-/, ''))).map((i) => i.key);
assert("le budget n'écrit aucun état de réservation en dur", sousEnDur.length === 0, sousEnDur.join(', '));
assert('chaque table ou billet du budget renvoie à RESERVER', sansResa.length === 0, sansResa.join(', '));
// Les numéros d'urgence s'écrivent deux fois : dans SURPLACE (ce que la page affiche) et,
// en repli, dans secours.html (ce qu'elle donne si les données ou le script manquent).
// Le repli ne doit jamais diverger : un numéro faux, c'est un appel perdu.
const secoursSrc = fs.readFileSync(new URL('../secours.html', import.meta.url), 'utf8');
const debutRepli = secoursSrc.indexOf('id="urg-tels"');
// Les numéros de l'ambassade, juste après, ne sont écrits qu'ici : on s'arrête avant.
const finRepli = secoursSrc.indexOf('secours__amba', debutRepli);
const repli = debutRepli < 0 || finRepli < 0 ? []
  : [...secoursSrc.slice(debutRepli, finRepli).matchAll(/<a href="tel:([^"]*)">([^<]*)<\/a>/g)]
    .map((m) => ({ href: m[1], n: m[2].trim() }));
const telsUrgences = SURPLACE.find((k) => k.id === 'urgences')?.tels?.map((t) => t.n) ?? [];
// Le lien d'appel se déduit du numéro affiché, comme le fait le script de la page (telHref).
const repliFaux = repli
  .filter((t) => !telsUrgences.includes(t.n) || t.href !== t.n.replace(/[^+\d]/g, ''))
  .map((t) => `${t.n} (tel:${t.href})`);
// Et rien d'oublié : un numéro de plus dans SURPLACE doit avoir son repli, sinon la page
// qui sert quand tout le reste manque en sait moins que les données.
const repliOublies = telsUrgences.filter((n) => !repli.some((t) => t.n === n));
assert('les numéros de repli de secours.html (110, 119, la hotline) sont ceux de SURPLACE',
  repli.length > 0 && repli.length === telsUrgences.length && repliFaux.length === 0 && repliOublies.length === 0,
  `repli : ${repli.map((t) => t.n).join(', ') || 'aucun trouvé (bloc #urg-tels)'} ; SURPLACE : ${telsUrgences.join(', ')}`
  + (repliFaux.length ? ` ; au lien faux ou absents de SURPLACE : ${repliFaux.join(', ')}` : ''));

// --- la catégorie Insolite ----------------------------------------------------
// Un lieu n'entre ici que pour son histoire : sans notice, il n'a rien à y
// faire. Et plusieurs demandent un bus rare ou deux heures de trajet — l'oubli
// du champ `acces` coûterait la journée sur place.

console.log('\nInsolite');
const insolites = SPOTS.filter((s) => s.category === 't6');
assert(`au moins 30 lieux insolites (${insolites.length})`, insolites.length >= 30);

const sansNotice = insolites.filter((s) => !s.lore).map((s) => s.name);
assert('chaque lieu insolite a sa notice', sansNotice.length === 0, sansNotice.join(', '));

// Les entrées venant des lots récents portent un accès ; celles reclassées
// depuis l'ancien site n'en ont pas, et c'est normal — elles sont en ville.
const lotsRecents = new Set(
  fs.readdirSync(new URL('./lib', import.meta.url))
    .filter((f) => /^spots-.*\.json$/.test(f))
    .flatMap((f) => JSON.parse(fs.readFileSync(new URL(`./lib/${f}`, import.meta.url), 'utf8')))
    .filter((x) => x.category === 't6')
    .map((x) => x.name),
);
const sansAcces = insolites.filter((s) => lotsRecents.has(s.name) && !s.acces).map((s) => s.name);
assert('chaque lieu insolite ajouté dit comment y aller', sansAcces.length === 0, sansAcces.join(', '));

assert('la catégorie Insolite est déclarée', CATEGORIES.some((c) => c.id === 't6'));

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

const pages = ['index.html', 'itineraire.html', 'guide.html', 'pratique.html', 'aujourdhui.html', 'jour.html', 'budget.html',
  'table.html', 'transports.html', 'passes.html', 'valises.html', 'secours.html', 'villes.html'];

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
// Les fichiers tenus à la main depuis le 28 septembre (plats, sélection) citent
// leurs photos entre guillemets simples : on les lit comme les pages.
for (const page of [...pages, 'data/delices.js', 'data/selection.js']) {
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
