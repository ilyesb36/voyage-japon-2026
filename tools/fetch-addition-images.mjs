// Trouve une photo Wikimedia Commons pour chaque idée ajoutée, la télécharge
// et l'inscrit dans tools/lib/additions-images.json.
//
// L'API Commons cherche dans l'espace « File: » et renvoie une vignette à la
// largeur voulue — ce qui évite d'avoir à deviner un nom de fichier.
//
//   node tools/fetch-addition-images.mjs [--dry]

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { ADDITIONS } from './lib/additions.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMG = path.join(ROOT, 'img');
const OUT = path.join(ROOT, 'tools', 'lib', 'additions-images.json');
const UA = 'voyage-japon-2026/1.0 (https://github.com/ilyesb36/voyage-japon-2026)';
const DRY = process.argv.includes('--dry');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);

/** Cherche des fichiers image sur Commons et renvoie les candidats. */
async function search(term) {
  const url = 'https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({
    action: 'query', format: 'json', origin: '*',
    generator: 'search', gsrsearch: `${term} filetype:bitmap`,
    gsrnamespace: '6', gsrlimit: '8',
    prop: 'imageinfo', iiprop: 'url|size|extmetadata', iiurlwidth: '960',
  });
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const json = await res.json();
  const pages = Object.values(json.query?.pages || {});
  return pages
    .map((p) => {
      const ii = p.imageinfo?.[0];
      if (!ii) return null;
      const meta = ii.extmetadata || {};
      return {
        title: p.title,
        thumb: ii.thumburl,
        width: ii.width, height: ii.height,
        licence: (meta.LicenseShortName?.value || '').replace(/<[^>]+>/g, ''),
        author: (meta.Artist?.value || '').replace(/<[^>]+>/g, '').trim().slice(0, 80),
        descUrl: ii.descriptionurl,
      };
    })
    .filter(Boolean)
    // paysage et assez grand : une photo de grille est en 16/10
    .filter((c) => c.width >= 800 && c.width >= c.height)
    .sort((a, b) => b.width - a.width);
}

const results = {};
let ok = 0;
const failures = [];

for (const a of ADDITIONS) {
  const term = a.commons || a.name;
  try {
    let candidates = await search(term);
    if (!candidates.length) {
      await sleep(400);
      candidates = await search(a.q); // second essai avec la requête Maps
    }
    if (!candidates.length) throw new Error('aucun candidat');

    // Garde-fou : Commons renvoie volontiers un homonyme — « Shisen-do » a
    // ramené un temple de Sapporo, « Shoren-in » un temple de Shirakawa. On
    // exige que le titre du fichier contienne le mot-clé discriminant.
    const norm = (s) => s.toLowerCase().normalize('NFD')
      .replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '');
    // Un seul mot discriminant, pas la phrase entière : le fichier de Minoo
    // s'appelle « Minoo Park - Falls Trail », pas « Minoo Falls ».
    const key = a.mustMatch
      ? norm(a.mustMatch)
      : norm((a.commons || a.name).split(/[\s,]+/)[0]);
    const matching = candidates.filter((c) => norm(c.title).includes(key));
    if (!matching.length) throw new Error(`aucun candidat ne contient « ${key} »`);

    const pick = matching[0];
    const name = `${slug(a.name)}-${crypto.createHash('sha1').update(pick.thumb).digest('hex').slice(0, 8)}.webp`;
    const dest = path.join(IMG, name);

    if (!DRY && !fs.existsSync(dest)) {
      const img = await fetch(pick.thumb, { headers: { 'User-Agent': UA } });
      if (!img.ok) throw new Error(`image HTTP ${img.status}`);
      const buf = Buffer.from(await img.arrayBuffer());
      await sharp(buf).resize({ width: 640, withoutEnlargement: true })
        .webp({ quality: 76 }).toFile(dest);
    }

    results[a.name] = {
      img: `img/${name}`,
      source: pick.descUrl,
      licence: pick.licence,
      author: pick.author,
    };
    ok++;
    console.log(`  ✓ ${a.name.padEnd(30)} ${pick.title.replace('File:', '').slice(0, 50)}`);
  } catch (err) {
    failures.push({ name: a.name, term, error: err.message });
    console.log(`  ✗ ${a.name.padEnd(30)} ${err.message}`);
  }
  await sleep(600);
}

if (!DRY) fs.writeFileSync(OUT, JSON.stringify(results, null, 2));
console.log(`\n${ok}/${ADDITIONS.length} illustrées${failures.length ? `, ${failures.length} sans photo` : ''}`);
if (failures.length) console.log('Sans photo :', failures.map((f) => f.name).join(', '));
