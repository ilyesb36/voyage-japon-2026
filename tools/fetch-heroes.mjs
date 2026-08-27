// Images de grande taille pour la mise en page éditoriale : une par ville,
// plus l'ouverture. Les photos de grille (640 px) sont trop petites dès qu'on
// les passe en plein cadre.
//
//   node tools/fetch-heroes.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMG = path.join(ROOT, 'img', 'hero');
const UA = 'voyage-japon-2026/1.0 (https://github.com/ilyesb36/voyage-japon-2026)';

// Choisies pour ce voyage : de l'automne, et le visage de chaque ville.
const WANTED = [
  { key: 'ouverture', term: 'Fushimi Inari torii path', match: 'fushimi',  width: 2000 },
  { key: 'tokyo',     term: 'Tokyo autumn ginkgo Meiji Jingu Gaien', match: 'ginkgo', width: 1600 },
  { key: 'kanazawa',  term: 'Kenrokuen autumn Kanazawa', match: 'kenroku', width: 1600 },
  { key: 'kyoto',     term: 'Tofukuji autumn maple Kyoto', match: 'fukuji', width: 1600 },
  { key: 'osaka',     term: 'Dotonbori night Osaka', match: 'dotonbori', width: 1600 },
  { key: 'hakone',    term: 'Lake Ashi Hakone Mount Fuji', match: 'hakone', width: 1600 },
  // Tokyo revient en fin de voyage : une seconde image, sinon la page se répète.
  { key: 'tokyo2',    term: 'Ikebukuro Tokyo night skyline', match: 'ikebukuro', width: 1600 },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '');

async function search(term, width) {
  const url = 'https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({
    action: 'query', format: 'json', origin: '*',
    generator: 'search', gsrsearch: `${term} filetype:bitmap`,
    gsrnamespace: '6', gsrlimit: '12',
    prop: 'imageinfo', iiprop: 'url|size', iiurlwidth: String(width),
  });
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const json = await res.json();
  return Object.values(json.query?.pages || {})
    .map((p) => ({ title: p.title, ...(p.imageinfo?.[0] || {}) }))
    .filter((c) => c.thumburl && c.width >= 1400)
    // le plein cadre veut du paysage franc
    .filter((c) => c.width / c.height >= 1.4)
    .sort((a, b) => b.width - a.width);
}

fs.mkdirSync(IMG, { recursive: true });
const out = {};

for (const w of WANTED) {
  const candidates = await search(w.term, w.width);
  const pick = candidates.find((c) => norm(c.title).includes(norm(w.match))) || candidates[0];
  if (!pick) { console.log(`  ✗ ${w.key} — rien`); continue; }

  const dest = path.join(IMG, `${w.key}.webp`);
  const res = await fetch(pick.thumburl, { headers: { 'User-Agent': UA } });
  const buf = Buffer.from(await res.arrayBuffer());
  const info = await sharp(buf)
    .resize({ width: w.width, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(dest);

  out[w.key] = { file: `img/hero/${w.key}.webp`, source: pick.descriptionurl, title: pick.title };
  console.log(`  ✓ ${w.key.padEnd(10)} ${info.width}×${info.height}  ${Math.round(info.size / 1024)} Ko  ${pick.title.replace('File:', '').slice(0, 46)}`);
  await sleep(700);
}

fs.writeFileSync(path.join(ROOT, 'tools/lib/heroes.json'), JSON.stringify(out, null, 2));
console.log(`\n${Object.keys(out).length}/${WANTED.length} images d'ouverture`);
