// Rapatrie les photos distantes dans img/ et réécrit data/*.js pour pointer
// sur les fichiers locaux. Sans ça, le mode hors-ligne est un mensonge.
//
//   node tools/fetch-images.mjs           tout
//   node tools/fetch-images.mjs --booking les photos d'hôtel seulement (urgent)
//   node tools/fetch-images.mjs --dry     liste sans télécharger
//
// Reprend là où il s'est arrêté : un fichier déjà présent n'est pas retéléchargé.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMG = path.join(ROOT, 'img');
const UA = 'voyage-japon-2026/1.0 (https://github.com/ilyesb36/voyage-japon-2026)';

const args = new Set(process.argv.slice(2));
const DRY = args.has('--dry');
const ONLY_BOOKING = args.has('--booking');

// Largeurs : 640 pour les grilles, 960 pour les images en vedette (hero, chambres).
const GRID = { width: 640, quality: 76 };
const FEATURED = { width: 960, quality: 74 };

const { SPOTS } = await import('../data/spots.js');
const { HOTELS } = await import('../data/trip.js');
const { TEMPLATES } = await import('../data/days.js');

// --- inventaire ---------------------------------------------------------------

/** @type {Map<string, {url:string, featured:boolean, label:string}>} */
const inventory = new Map();

function add(url, featured, label) {
  if (!url || !/^https?:/.test(url)) return;
  const existing = inventory.get(url);
  if (existing) { existing.featured ||= featured; return; }
  inventory.set(url, { url, featured, label });
}

// Les photos de chambre sont en vedette ET urgentes : leurs URL Booking portent
// une signature `?k=…` qui expire.
for (const h of HOTELS) for (const i of h.images) add(i, true, h.name);
for (const s of SPOTS) add(s.img, false, s.name);
for (const t of TEMPLATES) {
  add(t.img, false, t.title);
  // Les étapes des journées type ont leur propre photo : les oublier laissait
  // 144 images distantes tout en affichant « tout est local ».
  for (const st of t.steps) add(st.img, false, `${t.title} ${st.h}`);
}

const targets = [...inventory.values()]
  .filter((e) => (ONLY_BOOKING ? isBooking(e.url) : true))
  // Booking d'abord, quoi qu'il arrive.
  .sort((a, b) => Number(isBooking(b.url)) - Number(isBooking(a.url)));

console.log(`${targets.length} images à traiter${ONLY_BOOKING ? ' (Booking seulement)' : ''}${DRY ? ' — simulation' : ''}\n`);

// --- nommage ------------------------------------------------------------------

function isBooking(url) { return url.includes('bstatic.com'); }

function hash8(url) { return crypto.createHash('sha1').update(url).digest('hex').slice(0, 8); }

function slug(s) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'img';
}

function localName(entry) {
  const suffix = entry.featured ? '@960' : '';
  return `${slug(entry.label)}-${hash8(entry.url)}${suffix}.webp`;
}

/** Wikimedia n'accepte que certaines largeurs de vignette ; on demande la plus grande utile. */
function sourceUrl(url) {
  if (!url.includes('upload.wikimedia.org')) return url;
  return url.replace(/\/(\d+)px-/, '/960px-').replace(/\?.*$/, '');
}

// --- téléchargement -----------------------------------------------------------

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Wikimedia répond 429 dès qu'on le sollicite trop vite. On respecte
 * `Retry-After` quand il est donné, et on double l'attente sinon.
 */
async function fetchWithBackoff(url, attempts = 5) {
  let wait = 2000;
  for (let i = 1; i <= attempts; i++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'image/*' } });

    if (res.status === 429 || res.status === 503) {
      if (i === attempts) throw new Error(`HTTP ${res.status} après ${attempts} tentatives`);
      const retryAfter = Number(res.headers.get('retry-after'));
      const pause = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : wait;
      process.stdout.write(`\r  ⏸ ${res.status}, pause ${Math.round(pause / 1000)} s…            `);
      await sleep(pause);
      wait = Math.min(wait * 2, 60_000);
      continue;
    }

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1024) throw new Error(`réponse trop courte (${buf.length} o) — probable page d'erreur`);
    return buf;
  }
  throw new Error('épuisé');
}

const failures = [];
const credits = [];
let done = 0, skipped = 0;

fs.mkdirSync(IMG, { recursive: true });

for (const entry of targets) {
  const name = localName(entry);
  const dest = path.join(IMG, name);
  entry.local = `img/${name}`;

  if (fs.existsSync(dest)) { skipped++; recordCredit(entry, name); continue; }
  if (DRY) { console.log(`  · ${name}  <- ${entry.url.slice(0, 80)}`); continue; }

  try {
    const buf = await fetchWithBackoff(sourceUrl(entry.url));

    const opts = entry.featured ? FEATURED : GRID;
    await sharp(buf)
      .resize({ width: opts.width, withoutEnlargement: true })
      .webp({ quality: opts.quality })
      .toFile(dest);

    recordCredit(entry, name);
    done++;
    if (done % 25 === 0) console.log(`  ${done} téléchargées…`);
  } catch (err) {
    failures.push({ ...entry, error: err.message });
    console.log(`  ✗ ${entry.label} — ${err.message}`);
  }

  // Wikimedia est un service gratuit : on ne le martèle pas.
  await sleep(700);
}

function recordCredit(entry, name) {
  credits.push({ name, url: entry.url, label: entry.label });
}

// --- réécriture des données ----------------------------------------------------

if (!DRY && !ONLY_BOOKING) {
  const map = new Map([...inventory.values()].filter((e) => e.local && fs.existsSync(path.join(ROOT, e.local)))
    .map((e) => [e.url, e.local]));

  let rewritten = 0;
  for (const file of ['data/spots.js', 'data/trip.js', 'data/days.js']) {
    const p = path.join(ROOT, file);
    let src = fs.readFileSync(p, 'utf8');
    for (const [remote, local] of map) {
      const before = src;
      src = src.split(JSON.stringify(remote)).join(JSON.stringify(local));
      if (src !== before) rewritten++;
    }
    fs.writeFileSync(p, src);
  }
  console.log(`\n  ${rewritten} références réécrites vers img/`);

  writeCredits();
}

function writeCredits() {
  const wm = credits.filter((c) => c.url.includes('wikimedia'));
  const bk = credits.filter((c) => c.url.includes('bstatic'));
  const body = [
    '# Crédits photo',
    '',
    'Les images de ce site sont rapatriées en local pour que le mode hors-ligne',
    'fonctionne réellement. Leur source d\'origine est listée ici.',
    '',
    `## Wikimedia Commons (${wm.length})`,
    '',
    'Sous les licences indiquées sur chaque page Commons — se reporter à l\'URL source.',
    '',
    ...wm.map((c) => `- \`${c.name}\` — ${c.label} — ${c.url}`),
    '',
    `## Booking.com (${bk.length})`,
    '',
    'Photos des hébergements réservés, fournies par les établissements via Booking.',
    'Usage strictement privé, pour la préparation de ce voyage.',
    '',
    ...bk.map((c) => `- \`${c.name}\` — ${c.label}`),
    '',
  ].join('\n');
  fs.writeFileSync(path.join(IMG, 'CREDITS.md'), body);
  console.log('  img/CREDITS.md écrit');
}

// --- rapport -------------------------------------------------------------------

console.log(`\n${done} téléchargées, ${skipped} déjà présentes, ${failures.length} en échec`);

if (failures.length) {
  const report = path.join(ROOT, 'tools', 'failed-images.json');
  fs.writeFileSync(report, JSON.stringify(failures, null, 2));
  console.log(`\nÉchecs consignés dans ${path.relative(ROOT, report)}.`);
  console.log('À traiter un par un : soit l\'image a bougé et on trouve l\'équivalent,');
  console.log('soit le spot perd sa photo — mais aucune image cassée ne doit rester.');
  process.exit(1);
}
