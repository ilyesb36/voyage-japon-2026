// Rapatrie des photos Wikimedia distantes dans img/ (webp 640 px), pour le hors-ligne.
//   node tools/rapatrier-photos.mjs data/spots.js [--dry]
// fetch-images.mjs ne sert plus (il repart de l'extraction) : c'est ce script qu'on
// lance après avoir ajouté à la main une fiche avec une photo Wikimedia.
// Réécrit les URL https://upload|thumb.wikimedia.org/... du fichier en chemins img/<slug>-<hash>.webp
// et ajoute les crédits (lien vers la page du fichier sur Commons) à img/CREDITS.md.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FICHIER = process.argv[2];
const DRY = process.argv.includes('--dry');
const require = createRequire(path.join(ROOT, 'package.json'));
const sharp = require('sharp');
const UA = 'voyage-japon-2026/1.0 (https://github.com/ilyesb36/voyage-japon-2026)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);

const src = fs.readFileSync(path.join(ROOT, FICHIER), 'utf8');
const urls = [...new Set([...src.matchAll(/https:\/\/(?:upload|thumb)\.wikimedia\.org\/[^'"\s)]+/g)].map((m) => m[0]))];
console.log(`${urls.length} photos distantes dans ${FICHIER}`);
const credits = [];
let out = src, ok = 0, ko = 0;
for (const u of urls) {
  // le nom du fichier Commons : le segment après /commons/thumb/x/xy/ (ou /commons/x/xy/)
  const m = u.match(/\/commons\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/?]+)/);
  const nom = m ? decodeURIComponent(m[1]) : `photo-${ok + ko}`;
  const base = slug(nom.replace(/\.[a-z]+$/i, '')) || 'photo';
  const hash = crypto.createHash('sha1').update(u).digest('hex').slice(0, 8);
  const rel = `img/${base}-${hash}.webp`;
  const dest = path.join(ROOT, rel);
  if (!fs.existsSync(dest) && !DRY) {
    let tries = 0, buf = null;
    while (tries++ < 4) {
      const r = await fetch(u, { headers: { 'User-Agent': UA } });
      if (r.status === 429) { const w = (+r.headers.get('retry-after') || 5) * 1000; console.log(`  429, attente ${w} ms`); await sleep(w); continue; }
      if (!r.ok) { console.log(`  ✗ ${r.status} ${nom}`); break; }
      buf = Buffer.from(await r.arrayBuffer()); break;
    }
    if (!buf) { ko++; continue; }
    await sharp(buf).rotate().resize({ width: 640, withoutEnlargement: true }).webp({ quality: 78 }).toFile(dest);
    await sleep(700);
  }
  out = out.split(u).join(rel);
  credits.push(`- \`${rel}\` — [${nom}](https://commons.wikimedia.org/wiki/File:${encodeURIComponent(nom)})`);
  ok++;
}
if (!DRY) {
  fs.writeFileSync(path.join(ROOT, FICHIER), out);
  if (credits.length) {
    fs.appendFileSync(path.join(ROOT, 'img/CREDITS.md'),
      `\n## Wikimedia Commons — rapatriées le ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} depuis ${FICHIER} (${credits.length})\n\n${credits.join('\n')}\n`);
  }
}
console.log(`${ok} rapatriées, ${ko} en échec`);
