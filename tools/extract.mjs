// Extrait les données des anciennes pages HTML vers data/*.js.
// Script d'auteur, lancé une fois : `node tools/extract.mjs`.
// Les anciennes pages restent la source tant que la refonte n'est pas terminée.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveCity, normalizeHeading } from './lib/gazetteer.mjs';
import { BOOKINGS, AMENITY_LABELS } from './lib/bookings.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');

// --- petits utilitaires de nettoyage ----------------------------------------

const stripTags = (s) => s.replace(/<[^>]+>/g, '').trim();
const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
   .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').trim();
const clean = (s) => decode(stripTags(s)).replace(/\s+/g, ' ').trim();
const slug = (s) =>
  decode(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);

/** Évalue un littéral de tableau JS pris dans une ancienne page. */
function evalArray(source, varName) {
  const start = source.indexOf(`${varName}=[`);
  if (start === -1) throw new Error(`tableau ${varName} introuvable`);
  let i = source.indexOf('[', start), depth = 0, end = -1;
  for (let j = i; j < source.length; j++) {
    if (source[j] === '[') depth++;
    else if (source[j] === ']' && --depth === 0) { end = j + 1; break; }
  }
  if (end === -1) throw new Error(`tableau ${varName} non fermé`);
  return new Function(`return ${source.slice(i, end)}`)();
}

// --- villes ------------------------------------------------------------------

// Une couleur par ville, tirée de son propre monde : l'indigo des noren de
// Tokyo, la feuille d'or de Kanazawa, le vermillon des torii de Fushimi,
// l'orange des néons de Dotonbori, le vert-bleu du lac Ashi.
//
// `momiji` : la fenêtre habituelle du pic des érables, en moyenne des dernières
// années. Ce n'est PAS une prévision 2026 — elles ne sortent qu'en septembre.
// Sert à répondre à la seule question que pose ce voyage : tombe-t-on au bon
// moment dans chaque ville ?
const CITIES = {
  tokyo:    { name: 'Tokyo',    color: '#24435C', pref: 'Kantō',    momiji: ['2026-11-20', '2026-12-07'] },
  kanazawa: { name: 'Kanazawa', color: '#9C7A24', pref: 'Ishikawa', momiji: ['2026-11-15', '2026-11-30'] },
  kyoto:    { name: 'Kyoto',    color: '#B7301C', pref: 'Kansai',   momiji: ['2026-11-18', '2026-12-05'] },
  osaka:    { name: 'Osaka',    color: '#C05621', pref: 'Kansai',   momiji: ['2026-11-20', '2026-12-05'] },
  hakone:   { name: 'Hakone',   color: '#2E6E6E', pref: 'Kanagawa', momiji: ['2026-11-03', '2026-11-20'] },
};

// --- étapes, excursions, segments (villes.html) ------------------------------

function parseItinerary() {
  const src = read('villes.html');
  const rawSteps = evalArray(src, 'STEPS');
  const rawExc = evalArray(src, 'EXC');
  const rawSegs = evalArray(src, 'SEGS');

  const cityOf = (label) => {
    const base = label.split('·')[0].trim().toLowerCase();
    return Object.keys(CITIES).find((k) => CITIES[k].name.toLowerCase() === base) || null;
  };

  const STEPS = rawSteps.map((s) => {
    const cityId = cityOf(s.city);
    if (!cityId) throw new Error(`étape sans ville reconnue : ${s.city}`);
    const { from, to } = parseDateRange(s.dates);
    return {
      id: `step-${s.n}`,
      n: s.n,
      cityId,
      area: s.city.includes('·') ? s.city.split('·')[1].trim() : null,
      pref: s.pref,
      from, to,
      label: s.dates,
      nights: parseInt(s.nuits, 10),
      ryokan: /ryokan/.test(s.nuits),
      hotelName: s.hotel,
      mapsQuery: s.mq,
      ll: s.ll,
    };
  });

  const EXCURSIONS = rawExc.map((e) => ({
    id: `exc-${slug(e.city)}`,
    name: e.city,
    date: e.date,
    fromStepId: STEPS[e.from].id,
    ll: e.ll,
    hook: e.hook,
  }));

  const SEGMENTS = rawSegs.map((g) => ({
    fromStepId: STEPS[g.f].id,
    toStepId: STEPS[g.t].id,
    mode: g.mode,
    label: g.lbl,
    duration: g.dur,
    pricePerPerson: g.prix,
    via: g.via,
  }));

  return { STEPS, EXCURSIONS, SEGMENTS };
}

/**
 * « 22 → 25 nov » ou « 27 nov → 2 déc » -> dates ISO.
 * Quand seule la borne de droite porte le mois, la gauche l'hérite.
 */
function parseDateRange(range) {
  const [l, r] = range.split('→').map((s) => s.trim());
  const rm = r.match(/(\d+)\s*(nov|déc|dec)/i);
  if (!rm) throw new Error(`plage de dates illisible : ${range}`);
  const lm = l.match(/(\d+)\s*(nov|déc|dec)?/i);
  const leftMonth = lm[2] || rm[2];
  return { from: isoDate(+lm[1], leftMonth), to: isoDate(+rm[1], rm[2]) };
}

// --- hôtels (hotels.html + budget.html) --------------------------------------

function parseHotels(STEPS) {
  const src = read('hotels.html');
  const coords = evalArray(src, 'const HOTELS'.replace('const ', '')); // HOTELS=[[lat,lng,nom,sub]]
  const byName = new Map(coords.map(([la, lo, n]) => [n, [la, lo]]));

  const prices = parseBudgetHotelPrices();

  const cards = [...src.matchAll(/<div class="hcard">([\s\S]*?)<\/div>\s*<\/div>\s*(?=<div class="hcard">|<\/div>)/g)]
    .map((m) => m[1]);
  if (cards.length !== 6) throw new Error(`attendu 6 fiches hôtel, trouvé ${cards.length}`);

  const HOTELS = cards.map((card) => {
    const name = clean((card.match(/<h3>([\s\S]*?)<\/h3>/) || [, ''])[1]);
    const subs = [...card.matchAll(/<div class="hsub"[^>]*>([\s\S]*?)<\/div>/g)].map((m) => clean(m[1]));
    const room = clean((card.match(/<span class="room">([\s\S]*?)<\/span>/) || [, ''])[1]);
    const priceBlock = (card.match(/<div class="hprice">([\s\S]*?)<\/div>/) || [, ''])[1];
    const price = parseInt((priceBlock.match(/<b>\s*([\d\s]+)\s*€/) || [, '0'])[1].replace(/\s/g, ''), 10);
    const perNight = parseInt((priceBlock.match(/·\s*([\d\s]+)\s*€\/nuit/) || [, '0'])[1].replace(/\s/g, ''), 10);
    const status = clean((priceBlock.match(/<span class="badge-[^"]*">([\s\S]*?)<\/span>/) || [, ''])[1]);
    const images = [...card.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1]);
    const routeSummary = clean((card.match(/<span class="tsub">([\s\S]*?)<\/span>/) || [, ''])[1]);
    const routeText = clean((card.match(/<div class="trtxt">([\s\S]*?)<\/div>/) || [, ''])[1]);
    const maps = (card.match(/class="hmaps" href="([^"]+)"/) || [, ''])[1];

    const step = STEPS.find((s) => s.hotelName === name);
    if (!step) throw new Error(`hôtel sans étape correspondante : ${name}`);

    const budgetPrice = prices.get(name);
    if (budgetPrice == null) throw new Error(`hôtel absent du budget : ${name}`);
    if (budgetPrice !== price) {
      throw new Error(
        `prix divergent pour ${name} : ${price} € dans hotels.html, ${budgetPrice} € dans budget.html. ` +
        `À trancher à la main avant de continuer.`
      );
    }

    // La confirmation Booking fait foi : elle porte le prix réellement facturé,
    // les horaires de check-in et les équipements réels. L'ancien HTML n'avait
    // qu'un champ de texte libre, renseigné différemment d'une fiche à l'autre.
    const bk = BOOKINGS[name];
    if (!bk) throw new Error(`réservation Booking absente pour ${name} (voir tools/lib/bookings.mjs)`);

    return {
      id: `hotel-${slug(name)}`,
      name,
      bookingName: bk.bookingName || name,
      cityId: step.cityId,
      stepId: step.id,
      dates: subs[0] || null,
      access: subs[1] || null,

      // ces champs sont présents pour les six, sans exception
      room: bk.room,
      size: bk.size,                 // null = non communiquée par l'établissement
      capacity: bk.capacity,
      address: bk.address,
      checkIn: bk.checkIn,
      checkOut: bk.checkOut,
      bath: bk.bath,
      meals: bk.meals,
      amenities: bk.amenities,

      price: bk.price,
      priceYen: bk.priceYen,
      perNight: Math.round(bk.price / step.nights),
      paid: bk.paid,
      refundable: bk.refundable,
      cancelBefore: bk.cancelBefore,
      status,
      legacyRoom: room,              // le texte d'origine, gardé pour référence

      route: routeSummary ? { summary: routeSummary, text: routeText } : null,
      images,
      ll: byName.get(name) || step.ll,
      maps,
    };
  });

  return HOTELS;
}

function parseBudgetHotelPrices() {
  const src = read('budget.html');
  const cats = evalArray(src, 'CATS');
  const heb = cats.find((c) => c.id === 'heb');
  return new Map(heb.items.map((i) => [i.label, i.fix]));
}

// --- budget ------------------------------------------------------------------

function parseBudget(HOTELS) {
  const src = read('budget.html');
  const cats = evalArray(src, 'CATS');

  const categories = cats.map((c) => ({
    id: c.id,
    name: c.name,
    sub: c.sub,
    items: c.items.map((i) => ({
      key: i.key,
      label: i.label,
      sub: i.sub,
      ...(i.fix != null ? { fix: i.fix } : {}),
      ...(i.dyn ? { dyn: i.dyn } : {}),
    })),
  }));

  // Le poste hébergement est calculé depuis HOTELS ; on ne recopie pas les montants.
  const heb = categories.find((c) => c.id === 'heb');
  heb.items = HOTELS.map((h) => ({ key: h.id, label: h.name, sub: `${CITIES[h.cityId].name} · ${h.status}`, fromHotel: h.id }));

  const defaults = {};
  for (const m of src.matchAll(/id="(vol|train|food|act)"[^>]*value="(\d+)"/g)) defaults[m[1]] = +m[2];

  return {
    categories,
    defaults,
    // multiplicateurs repris de calc() dans budget.html
    formula: { vol: 'x2', train: 'x2', food: 'x24x2', act: 'x24x2' },
  };
}

// --- vols (index.html) --------------------------------------------------------

function parseFlights() {
  const src = read('index.html');
  return [...src.matchAll(/<div class="flight"><div>([\s\S]*?)<\/div><span>([\s\S]*?)<\/span><\/div>/g)]
    .map((m) => {
      const main = clean(m[1]);
      const [leg, ...rest] = main.split('·').map((s) => s.trim());
      return { leg, when: rest[0] || null, route: rest.slice(1).join(' · ') || null, detail: clean(m[2]) };
    });
}

// --- jours (jour-par-jour.html) ----------------------------------------------

const MONTHS = { nov: 11, 'déc': 12, dec: 12 };

function parseDays(STEPS) {
  const src = read('jour-par-jour.html');
  const phases = [...src.matchAll(/<div class="phase">([\s\S]*?)(?=<div class="phase">|<p class="note")/g)].map((m) => m[1]);
  const DAYS = [];

  for (const phase of phases) {
    const title = clean((phase.match(/<h2>([\s\S]*?)<\/h2>/) || [, ''])[1]);
    const hotelLine = clean((phase.match(/<span class="ph-hotel">([\s\S]*?)<\/span>/) || [, ''])[1]);
    const step = matchStep(title, STEPS);

    for (const dm of phase.matchAll(/<div class="day([^"]*)">([\s\S]*?)(?=<div class="day|<\/div>\s*<\/div>\s*$)/g)) {
      const flags = dm[1], body = dm[2];
      const dayNum = +clean((body.match(/<div class="dchip"><b>(\d+)<\/b>/) || [, '0'])[1]);
      const month = clean((body.match(/<span>([^<]+)<\/span>/) || [, ''])[1]);
      const h3 = (body.match(/<h3>([\s\S]*?)<\/h3>/) || [, ''])[1];
      const kindRaw = clean((h3.match(/<small>([\s\S]*?)<\/small>/) || [, ''])[1]);
      const dayTitle = clean(h3.replace(/<small>[\s\S]*?<\/small>/, ''));
      const items = [...body.matchAll(/<li([^>]*)>([\s\S]*?)<\/li>/g)]
        .map((m) => ({ text: clean(m[2]), evening: /class="t"/.test(m[1]) }));
      const tip = clean((body.match(/<div class="dtip">([\s\S]*?)<\/div>/) || [, ''])[1]) || null;

      // Le rattachement se fait par la DATE : le 9 nov au soir on dort déjà à
      // Asakusa, même si la phase s'appelle « Le départ ». Le titre de phase
      // ne sert que de repli (jour hors de toute étape, comme le vol aller).
      const date = isoDate(dayNum, month);
      const byDate = STEPS.find((s) => date >= s.from && date < s.to)
                  || STEPS.find((s) => date === s.to);
      const owner = byDate || step;

      DAYS.push({
        n: DAYS.length + 1,
        date,
        label: `${dayNum} ${month}`,
        title: dayTitle,
        kind: normalizeKind(kindRaw, flags),
        phase: title,
        phaseHotel: hotelLine || null,
        stepId: owner ? owner.id : null,
        cityId: owner ? owner.cityId : null,
        items,
        tip,
      });
    }
  }
  return DAYS;
}

function isoDate(day, month) {
  const m = MONTHS[month.toLowerCase().replace('.', '')];
  if (!m) throw new Error(`mois inconnu : ${month}`);
  return `2026-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function normalizeKind(small, flags) {
  const s = (small || '').toLowerCase();
  if (s.includes('vol')) return 'vol';
  if (s.includes('excursion')) return 'excursion';
  if (s.includes('départ') || s.includes('depart')) return 'transfert';
  if (flags.includes('voyage')) return 'transfert';
  return 'etape';
}

/**
 * Rattache une phase de `jour-par-jour.html` à son étape.
 * Tokyo apparaît deux fois (« Tokyo, l'arrivée » et « Tokyo, le final ») : on
 * tranche par la date, en cherchant l'étape dont l'intervalle couvre celle du titre.
 */
function matchStep(phaseTitle, STEPS) {
  const t = phaseTitle.toLowerCase();
  const candidates = STEPS.filter((s) => t.includes(CITIES[s.cityId].name.toLowerCase()));
  if (candidates.length <= 1) return candidates[0] || null;

  const m = t.match(/(\d+)\s*(nov|déc|dec)/i);
  if (!m) return candidates[0];
  const d = isoDate(+m[1], m[2]);
  // l'étape dont l'intervalle contient cette date, sinon la plus proche par la gauche
  return candidates.find((s) => d >= s.from && d <= s.to)
      || candidates.filter((s) => s.from <= d).pop()
      || candidates[0];
}

// --- journées type (journees.html) -------------------------------------------

function parseTemplates() {
  const src = read('journees.html');
  const coords = evalArray(src, 'DC');
  const blocks = [...src.matchAll(/<details class="day"([^>]*)>([\s\S]*?)<\/details>/g)];
  if (blocks.length !== 30) throw new Error(`attendu 30 journées type, trouvé ${blocks.length}`);

  // La ville vient du <h2 class="city"> qui précède le bloc.
  const cityMarks = [...src.matchAll(/<h2 class="city"[^>]*>([\s\S]*?)<\/h2>/g)]
    .map((m) => ({ at: m.index, name: clean(m[1]) }));

  return blocks.map((b, i) => {
    const attrs = b[1], body = b[2];
    const priority = (attrs.match(/data-p="(\w+)"/) || [, null])[1];
    const category = (attrs.match(/data-tag="([^"]*)"/) || [, null])[1];
    const title = clean((body.match(/<div class="dtit"><b>([\s\S]*?)<\/b>/) || [, ''])[1]);
    const sub = clean((body.match(/<div class="dtit">[\s\S]*?<span>([\s\S]*?)<\/span>/) || [, ''])[1]);
    const img = (body.match(/<img class="dimg" src="([^"]+)"/) || [, null])[1];

    const steps = [...body.matchAll(/<div class="st"><div class="sh">([\s\S]*?)<\/div><div class="sd">([\s\S]*?)<\/div><\/div>/g)]
      .map((m) => ({
        h: clean(m[1]),
        text: clean(m[2].replace(/<a class="pin"[\s\S]*?<\/a>/g, '').replace(/<small>[\s\S]*?<\/small>/g, '')),
        note: clean((m[2].match(/<small>([\s\S]*?)<\/small>/) || [, ''])[1]) || null,
        maps: (m[2].match(/<a class="pin"[^>]*href="([^"]+)"/) || [, null])[1],
      }));

    const before = cityMarks.filter((c) => c.at < b.index).pop();
    const cityId = before ? cityFromLabel(before.name) : null;

    return {
      id: `tpl-${slug(title)}`,
      cityId,
      title, sub, category, priority, img,
      steps,
      points: (coords[i] || []).map(([lat, lng, name]) => ({ lat, lng, name })),
    };
  });
}

function cityFromLabel(label) {
  const l = label.toLowerCase();
  const hit = Object.keys(CITIES).find((k) => l.includes(CITIES[k].name.toLowerCase()));
  if (hit) return hit;
  if (l.includes('day trip')) return null; // les day trips sont rattachés par excursion
  return null;
}

// --- spots (guide.html) -------------------------------------------------------

const CATEGORY_NAMES = {
  t0: 'Monuments', t1: 'Food', t2: 'Day trips',
  t3: 'Expériences', t4: 'Shopping', t5: 'Insta',
};
const PRIORITY_NAMES = { ob: 'Obligatoire', top: 'À voir', symp: 'Sympa', niche: 'Niche' };

function parseSpots() {
  const src = read('guide.html');
  const SPOTS = [];
  let heading = null, panel = 't0';
  const seen = new Set();

  const tok = /<div class="gpanel" id="(t\d)"|<h3[^>]*>([\s\S]*?)<\/h3>|<a class="gcard"[^>]*?data-p="(\w+)"[^>]*?href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g;
  let m;
  while ((m = tok.exec(src))) {
    if (m[1]) { panel = m[1]; heading = null; continue; }
    if (m[2] != null) { heading = m[2]; continue; }

    const [, , , priority, href, inner] = m;
    const name = clean((inner.match(/<b>([\s\S]*?)<\/b>/) || [, ''])[1]);
    const blurb = clean((inner.match(/<span>([\s\S]*?)<\/span>/) || [, ''])[1]);
    const img = (inner.match(/<img[^>]+src="([^"]+)"/) || [, null])[1];
    const guideTip = /class="gg"|·\s*guide/.test(inner);
    const mapsQuery = decodeURIComponent(((href.match(/query=([^"&]+)/) || [, ''])[1]).replace(/\+/g, ' '));

    const r = resolveCity({ mapsQuery, name, heading, blurb });
    if (!r) throw new Error(`spot sans ville résolue : « ${name} » (section « ${normalizeHeading(heading || '')} »)`);

    let id = `spot-${slug(name)}`;
    let k = 2;
    while (seen.has(id)) id = `spot-${slug(name)}-${k++}`;
    seen.add(id);

    SPOTS.push({
      id, name,
      cityId: r.cityId,          // null = enseigne nationale, voir gazetteer
      area: r.area,
      category: panel,
      priority,
      blurb,
      guideTip,
      // D'où vient la recommandation. « guide » = l'amie guide de Mathilde,
      // « ilyes » = la sélection d'origine. Les ajouts ultérieurs porteront
      // une autre source, pour ne jamais les confondre avec les deux premières.
      source: guideTip ? 'guide' : 'ilyes',
      img,
      maps: href,
    });
  }
  return SPOTS;
}

// --- écriture -----------------------------------------------------------------

function j(v) { return JSON.stringify(v); }

function writeModule(file, header, blocks) {
  const out = `// Généré par tools/extract.mjs — ne pas éditer à la main sans relancer la vérification.\n// ${header}\n\n${blocks.join('\n\n')}\n`;
  fs.writeFileSync(path.join(ROOT, file), out, 'utf8');
  console.log(`  écrit ${file} (${(out.length / 1024).toFixed(0)} Ko)`);
}

function arrayBlock(name, rows) {
  return `export const ${name} = Object.freeze([\n${rows.map((r) => `  ${j(r)},`).join('\n')}\n].map(Object.freeze));`;
}

// --- main ---------------------------------------------------------------------

console.log('Extraction depuis les anciennes pages…');

const { STEPS, EXCURSIONS, SEGMENTS } = parseItinerary();
const HOTELS = parseHotels(STEPS);
const BUDGET = parseBudget(HOTELS);
const FLIGHTS = parseFlights();
const DAYS = parseDays(STEPS);
const TEMPLATES = parseTemplates();
const SPOTS = parseSpots();

// relier chaque étape à son hôtel par identifiant plutôt que par nom recopié
for (const s of STEPS) {
  const h = HOTELS.find((h) => h.stepId === s.id);
  s.hotelId = h ? h.id : null;
  delete s.hotelName;
}

const TRIP = {
  start: '2026-11-08', end: '2026-12-03',
  travellers: 2,
  nights: STEPS.reduce((n, s) => n + s.nights, 0),
  days: DAYS.length,
  title: "L'automne des momiji",
  subtitle: '23 nuits pour descendre le Japon au rythme des érables — des néons de Tokyo au silence des temples.',
};

writeModule('data/trip.js', 'Voyage, étapes, hôtels, trajets, budget.', [
  `export const TRIP = Object.freeze(${j(TRIP)});`,
  `export const CITIES = Object.freeze(${j(CITIES)});`,
  arrayBlock('STEPS', STEPS),
  arrayBlock('EXCURSIONS', EXCURSIONS),
  arrayBlock('SEGMENTS', SEGMENTS),
  arrayBlock('HOTELS', HOTELS),
  arrayBlock('FLIGHTS', FLIGHTS),
  `export const BUDGET = Object.freeze(${j(BUDGET)});`,
  `export const AMENITY_LABELS = Object.freeze(${j(AMENITY_LABELS)});`,
]);

writeModule('data/days.js', 'Les 25 jours du voyage et les 30 journées type.', [
  arrayBlock('DAYS', DAYS),
  arrayBlock('TEMPLATES', TEMPLATES),
]);

writeModule('data/spots.js', 'Les idées du guide.', [
  `export const CATEGORIES = Object.freeze(${j(Object.entries(CATEGORY_NAMES).map(([id, name]) => ({ id, name })))});`,
  `export const PRIORITIES = Object.freeze(${j(Object.entries(PRIORITY_NAMES).map(([id, name]) => ({ id, name })))});`,
  arrayBlock('SPOTS', SPOTS),
]);

console.log(`\n  ${STEPS.length} étapes · ${EXCURSIONS.length} excursions · ${SEGMENTS.length} segments`);
console.log(`  ${HOTELS.length} hôtels · ${DAYS.length} jours · ${TEMPLATES.length} journées type · ${SPOTS.length} spots`);
console.log('\nExtraction terminée. Lancer `node tools/verify.mjs`.');
