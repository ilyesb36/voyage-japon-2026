// Extrait les données des pages d'origine (legacy/) vers data/*.js.
// `node tools/extract.mjs`.
//
// Les pages de legacy/ ne sont plus servies, mais elles restent la source de
// vérité historique : sans elles, l'extraction ne serait plus rejouable.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveCity, normalizeHeading } from './lib/gazetteer.mjs';
import { BOOKINGS, AMENITY_LABELS } from './lib/bookings.mjs';
import { enriched as ADDITIONS } from './lib/additions.mjs';
import { FLIGHTS as FLIGHT_DATA } from './lib/flights.mjs';
import { SPOT_FIXES } from './lib/spot-fixes.mjs';
import { REMOVED } from './lib/guide-removals.mjs';
import { DAY_PLAN } from './lib/day-plan.mjs';
import { RESERVATIONS } from './lib/reservations.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => fs.readFileSync(path.join(ROOT, 'legacy', f), 'utf8');

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
  tokyo:    { name: 'Tokyo',    color: '#0369A1', pref: 'Kantō',    momiji: ['2026-11-20', '2026-12-07'] },
  kanazawa: { name: 'Kanazawa', color: '#A16207', pref: 'Ishikawa', momiji: ['2026-11-15', '2026-11-30'] },
  kyoto:    { name: 'Kyoto',    color: '#B91C1C', pref: 'Kansai',   momiji: ['2026-11-18', '2026-12-05'] },
  osaka:    { name: 'Osaka',    color: '#C2410C', pref: 'Kansai',   momiji: ['2026-11-20', '2026-12-05'] },
  hakone:   { name: 'Hakone',   color: '#0F766E', pref: 'Kanagawa', momiji: ['2026-11-03', '2026-11-20'] },
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
      arrivee: bk.arrivee || null,
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

  // Les billets datés sont un poste à part : ils sont payés d'avance, à un
  // montant connu au yen près, et ils ne se rattrapent pas. Le forfait
  // « Activités & entrées » est une moyenne journalière — il ne peut pas les
  // absorber sans mentir sur ce qui est déjà réglé.
  if (RESERVATIONS.length) {
    categories.push({
      id: 'billets',
      name: 'Billets datés',
      sub: `${RESERVATIONS.length} réservation${RESERVATIONS.length > 1 ? 's' : ''} à créneau`,
      items: RESERVATIONS.map((r) => ({
        key: r.id,
        label: r.title,
        sub: `${r.where} · ${r.date.split('-').reverse().join('/')} ${r.slot} · ${r.people} pers.`,
        fix: r.price,
        settled: r.status === 'payé',
      })),
    });
  }

  const defaults = {};
  for (const m of src.matchAll(/id="(vol|train|food|act)"[^>]*value="(\d+)"/g)) defaults[m[1]] = +m[2];

  return {
    categories,
    defaults,
    // multiplicateurs repris de calc() dans budget.html
    formula: { vol: 'x2', train: 'x2', food: 'x24x2', act: 'x24x2' },
  };
}

// --- vols ---------------------------------------------------------------------
// Tenus à la main dans tools/lib/flights.mjs : l'ancienne page n'avait qu'une
// phrase, dont on ne pouvait rien dessiner.
function parseFlights() { return FLIGHT_DATA; }

// --- jours (jour-par-jour.html) ----------------------------------------------

const MONTHS = { nov: 11, 'déc': 12, dec: 12 };

function parseDays(STEPS) {
  const src = read('jour-par-jour.html');
  const DAY_EXTRA = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/lib/day-additions.json'), 'utf8'));
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

      const n = DAYS.length + 1;
      // Lignes ajoutées à la main dans tools/lib/day-additions.json : les
      // journées d'origine tenaient en 3 ou 4 lignes, trop peu pour 8 heures.
      const extra = (DAY_EXTRA[String(n)] || []).map((x) => ({ text: x.text, evening: !!x.evening }));

      DAYS.push({
        n,
        date,
        label: `${dayNum} ${month}`,
        title: dayTitle,
        kind: normalizeKind(kindRaw, flags),
        phase: title,
        phaseHotel: hotelLine || null,
        stepId: owner ? owner.id : null,
        cityId: owner ? owner.cityId : null,
        // les lignes du soir restent en fin de journée, quelle que soit
        // l'ordre dans lequel elles ont été ajoutées
        items: [...items, ...extra].sort((a, b) => Number(a.evening) - Number(b.evening)),
        tip,
      });
    }
  }

  // Journées recalées à la main (voir tools/lib/day-plan.mjs) : elles
  // remplacent titre, lignes et conseil, day-additions.json compris.
  for (const d of DAYS) {
    const plan = DAY_PLAN[d.date];
    if (!plan) continue;
    if (plan.title) d.title = plan.title;
    if (plan.tip !== undefined) d.tip = plan.tip;
    if (plan.items) {
      d.items = plan.items
        .map((x) => ({ text: x.text, evening: !!x.evening }))
        .sort((a, b) => Number(a.evening) - Number(b.evening));
    }
  }

  // Un billet daté doit tomber sur un jour du voyage. Le rapprochement à
  // l'affichage se fait par DATE : inutile de recopier des identifiants dans
  // les jours, un champ recopié finit toujours par mentir.
  for (const r of RESERVATIONS) {
    if (!DAYS.some((d) => d.date === r.date)) {
      throw new Error(`réservation « ${r.title} » le ${r.date} : aucun jour de voyage à cette date`);
    }
  }

  const planned = Object.keys(DAY_PLAN);
  const missing = planned.filter((date) => !DAYS.some((d) => d.date === date));
  if (missing.length) throw new Error(`day-plan.mjs vise des dates inexistantes : ${missing.join(', ')}`);

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

    // Un bloc .st se ferme soit juste après .sd, soit après une <img class="simg">.
    // Une seule expression qui exigeait le premier cas perdait les 144 blocs
    // illustrés et recollait les étapes suivantes bout à bout. On découpe donc
    // d'abord par bloc, puis on extrait à l'intérieur.
    const blocks = body.match(/<div class="st">[\s\S]*?(?=<div class="st">|$)/g) || [];
    const steps = blocks.map((b) => {
      const sh = (b.match(/<div class="sh">([\s\S]*?)<\/div>/) || [, ''])[1];
      const sd = (b.match(/<div class="sd">([\s\S]*?)<\/div>/) || [, ''])[1];
      return {
        h: clean(sh),
        text: clean(sd.replace(/<a class="pin"[\s\S]*?<\/a>/g, '').replace(/<small>[\s\S]*?<\/small>/g, '')),
        note: clean((sd.match(/<small>([\s\S]*?)<\/small>/) || [, ''])[1]) || null,
        maps: (sd.match(/<a class="pin"[^>]*href="([^"]+)"/) || [, null])[1],
        img: (b.match(/<img class="simg"[^>]+src="([^"]+)"/) || [, null])[1],
      };
    }).filter((s) => s.h || s.text);

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

// Durée, budget et meilleur moment : l'ancien site les avait, la migration
// les avait perdus. On les relit, et on complète par un défaut de catégorie
// pour qu'aucune fiche n'ait de ligne vide.
function parseSpotMeta() {
  const src = read('guide.html');
  const block = (src.match(/var META=\{([\s\S]*?)\};/) || [, ''])[1];
  const meta = new Map();
  for (const m of block.matchAll(/'((?:[^'\\]|\\.)*)':\[\s*'((?:[^'\\]|\\.)*)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*\]/g)) {
    const clean = (x) => x.replace(/\\'/g, "'");
    meta.set(clean(m[1]), { duration: clean(m[2]), budget: clean(m[3]), when: clean(m[4]) });
  }
  const def = {};
  const defBlock = (src.match(/var DEF=\{([\s\S]*?)\};/) || [, ''])[1];
  for (const m of defBlock.matchAll(/'(t\d)':\['([^']*)','([^']*)','([^']*)'\]/g)) {
    def[m[1]] = { duration: m[2], budget: m[3], when: m[4] };
  }
  // Le défaut de la catégorie « Expériences » était « résa conseillée ». Il
  // s'appliquait à 29 lieux qui ne se réservent pas — le croisement de Shibuya,
  // Akihabara, Shimokitazawa — et noyait les vraies réservations obligatoires
  // (teamLab, Nintendo, Rurikō-in, le temple ninja) dans du bruit. Un label
  // porté par tout le monde ne veut plus rien dire.
  // Les lieux qui exigent réellement une réservation ont, eux, un `when`
  // explicite dans META : ils ne sont pas touchés.
  if (def.t3) def.t3.when = 'selon l\'envie';

  // La catégorie « Insolite » n'existait pas dans l'ancien site : elle n'a donc
  // pas de défaut hérité. Ses entrées portent presque toutes leurs propres
  // valeurs ; ce défaut n'est qu'un filet.
  def.t6 = { duration: '1–2h', budget: 'à vérifier', when: 'selon l\'envie' };

  return { meta, def };
}

const CATEGORY_NAMES = {
  t0: 'Monuments', t1: 'Food', t2: 'Day trips',
  t3: 'Expériences', t4: 'Shopping', t5: 'Insta',
  // Ajoutée après coup : les lieux dont on parle en rentrant. Elle prend des
  // entrées aux autres catégories, parce qu'un temple aux 1 200 statues
  // moussues se cherche par son étrangeté, pas par son statut de monument.
  t6: 'Insolite',
};
const PRIORITY_NAMES = { ob: 'Obligatoire', top: 'À voir', symp: 'Sympa', niche: 'Niche' };

function parseSpots() {
  const src = read('guide.html');
  const { meta, def } = parseSpotMeta();
  // Notices historiques, vérifiées sur sources. Elles sont écrites par lots
  // (une ville, une passe de recherche) : tout fichier tools/lib/lore*.json est
  // fusionné, dans l'ordre alphabétique. Un nouveau lot se pose là, sans
  // toucher au générateur. Une clé déjà connue est un conflit, pas un écrasement.
  const loreDir = path.join(ROOT, 'tools/lib');
  const LORE = {};
  for (const f of fs.readdirSync(loreDir).filter((f) => /^lore.*\.json$/.test(f)).sort()) {
    const lot = JSON.parse(fs.readFileSync(path.join(loreDir, f), 'utf8'));
    for (const [id, texte] of Object.entries(lot)) {
      if (LORE[id] && LORE[id] !== texte) throw new Error(`notice en double pour ${id} (${f})`);
      LORE[id] = texte;
    }
  }
  console.log(`  ${Object.keys(LORE).length} notices historiques`);
  const SPOTS = [];

  // Le META de l'ancien site est indexé par un nom parfois raccourci
  // (« Otagi » pour « Otagi Nenbutsu-ji ») : on rapproche dans les deux sens.
  const findMeta = (name, category) => {
    if (meta.has(name)) return meta.get(name);
    for (const [k, v] of meta) {
      if (name.includes(k) || k.includes(name)) return v;
    }
    return def[category] || def.t0;
  };
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

    // Retiré volontairement — voir tools/lib/guide-removals.mjs. Le filtre
    // porte sur l'identifiant : deux entrées partagent parfois un nom.
    if (REMOVED.has(id)) continue;

    SPOTS.push({
      id, name,
      cityId: r.cityId,          // null = enseigne nationale, voir gazetteer
      area: r.area,
      category: panel,
      priority,
      blurb,
      guideTip,
      source: guideTip ? 'guide' : 'ilyes',
      ...findMeta(name, panel),
      img,
      maps: href,
      // Les corrections passent EN DERNIER, sinon elles ne peuvent pas
      // rattraper `img` ni `maps` — un lieu rangé sous la mauvaise ville
      // gardait un lien Maps qui cherchait au mauvais endroit.
      ...(SPOT_FIXES[name] || {}),
      ...(LORE[id] ? { lore: LORE[id] } : {}),
    });
  }

  // Les ajouts viennent après, avec leur propre source et leur photo Commons.
  const images = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/lib/additions-images.json'), 'utf8'));
  for (const a of ADDITIONS) {
    let id = `spot-${slug(a.name)}`;
    let k = 2;
    while (seen.has(id)) id = `spot-${slug(a.name)}-${k++}`;
    seen.add(id);
    SPOTS.push({
      id, name: a.name,
      cityId: a.cityId, area: null,
      category: a.category, priority: a.priority,
      blurb: a.blurb,
      guideTip: false,
      source: 'claude',
      ...(def[a.category] || def.t0),
      ...(SPOT_FIXES[a.name] || {}),
      ...(LORE[id] ? { lore: LORE[id] } : {}),
      img: images[a.name]?.img || null,
      maps: a.maps,
    });
  }

  // Les lots ajoutés après coup vivent dans tools/lib/spots-*.json et sont
  // fusionnés par ordre alphabétique : les cafés et ouvertures récentes
  // (spots-nouveaux), les lieux insolites (spots-insolites), le Japon des morts
  // et des esprits (spots-sombres). Un nouveau lot se pose là, sans toucher au
  // générateur — même principe que les notices lore*.json.
  //
  // Ils portent leurs propres `duration`/`budget`/`when`/`lore`, déjà vérifiés,
  // et parfois un champ `acces` que les autres n'ont pas : plusieurs demandent
  // un bus rare ou deux heures de trajet, et l'ignorer coûterait la journée.
  const libDir = path.join(ROOT, 'tools/lib');
  for (const f of fs.readdirSync(libDir).filter((f) => /^spots-.*\.json$/.test(f)).sort()) {
    const lot = JSON.parse(fs.readFileSync(path.join(libDir, f), 'utf8'));
    for (const a of lot) {
      const id = `spot-${slug(a.name)}`;
      if (seen.has(id)) throw new Error(`${f} : « ${a.name} » fait doublon avec un spot existant`);
      seen.add(id);
      const parDefaut = def[a.category] || def.t0;
      SPOTS.push({
        id, name: a.name,
        cityId: a.cityId, area: a.area || null,
        category: a.category, priority: a.priority,
        blurb: a.blurb,
        guideTip: false,
        source: 'claude',
        duration: a.duration || parDefaut.duration,
        budget: a.budget || 'à vérifier',
        when: a.when || parDefaut.when,
        ...(a.acces ? { acces: a.acces } : {}),
        ...(a.lore ? { lore: a.lore } : {}),
        ...(SPOT_FIXES[a.name] || {}),
        img: images[a.name]?.img || null,
        maps: a.maps,
      });
    }
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

for (const [id, c] of Object.entries(CITIES)) c.id = id;   // var(--c-<id>) dans les pages

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
  arrayBlock('RESERVATIONS', RESERVATIONS),
]);

// Les lieux du programme, géolocalisés. Sans ça, « Tenryu-ji → bambouseraie →
// déjeuner au bord de la rivière » demande trois recherches Google Maps sur
// place, à chaque ligne de chaque journée.
const LIEUX = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/lib/lieux.json'), 'utf8'));
const JOURS_LIEUX = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/lib/jours-lieux.json'), 'utf8'));

// Contrôles avant écriture : une coordonnée fausse envoie marcher au mauvais
// endroit, ce qui est pire que pas de coordonnée du tout.
for (const [id, l] of Object.entries(LIEUX)) {
  if (l.lat < 30 || l.lat > 46 || l.lng < 128 || l.lng > 146) {
    throw new Error(`lieu « ${id} » hors du Japon : ${l.lat}, ${l.lng}`);
  }
  if (!CITIES[l.cityId]) throw new Error(`lieu « ${id} » : ville inconnue « ${l.cityId} »`);
}
for (const [date, lignes] of Object.entries(JOURS_LIEUX)) {
  const jour = DAYS.find((d) => d.date === date);
  if (!jour) throw new Error(`jours-lieux : date inconnue ${date}`);
  for (const [i, ids] of Object.entries(lignes)) {
    if (!jour.items[+i]) throw new Error(`jours-lieux ${date} : la ligne ${i} n'existe pas`);
    for (const id of ids) if (!LIEUX[id]) throw new Error(`jours-lieux ${date}[${i}] : lieu inconnu « ${id} »`);
  }
}

// On accroche les lieux directement sur les lignes du programme : la page du
// jour n'a plus qu'à lire les journées.
for (const jour of DAYS) {
  const lignes = JOURS_LIEUX[jour.date] || {};
  jour.items = jour.items.map((it, i) => {
    const ids = lignes[String(i)] || [];
    return ids.length ? { ...it, lieux: ids } : it;
  });
}

writeModule('data/lieux.js', 'Les lieux du programme, géolocalisés.', [
  `export const LIEUX = Object.freeze(${j(LIEUX)});`,
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
// L'extraction repart des pages d'origine, où les photos sont encore des URL
// Wikimedia : elle ANNULE la relocalisation dans img/. Sans le rappel, le mode
// hors-ligne redevient un mensonge sans que personne s'en aperçoive.
console.log('\nExtraction terminée. Enchaîner, dans cet ordre :');
console.log('  node tools/fetch-images.mjs   (réécrit les photos vers img/)');
console.log('  node tools/verify.mjs');
