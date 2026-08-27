// Vendorise les polices Google en local, sous-ensembles latin uniquement.
// L'ancien theme.css les chargeait par @import depuis le réseau : hors-ligne,
// toute la typographie sautait. `node tools/fetch-fonts.mjs`.
//
// Les kanji ne sont pas embarqués : ils sont trop lourds pour les trois
// caractères qu'on utilise (川, 紅, 葉) et la police système japonaise,
// présente sur tous les appareils, les rend correctement.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'vendor', 'fonts');
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36';
const KEEP = new Set(['latin', 'latin-ext']);

const QUERY = 'family=Zen+Old+Mincho:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap';

fs.mkdirSync(OUT, { recursive: true });

const css = await (await fetch(`https://fonts.googleapis.com/css2?${QUERY}`, { headers: { 'User-Agent': UA } })).text();

// Découper en blocs @font-face, chacun précédé d'un commentaire de sous-ensemble.
const blocks = [];
const re = /\/\*\s*([a-z0-9-]+)\s*\*\/\s*(@font-face\s*\{[^}]*\})/g;
let m;
while ((m = re.exec(css))) blocks.push({ subset: m[1], body: m[2] });

console.log(`${blocks.length} blocs @font-face, ${blocks.filter((b) => KEEP.has(b.subset)).length} retenus (${[...KEEP].join(', ')})`);

const out = [];
let downloaded = 0;

for (const b of blocks) {
  if (!KEEP.has(b.subset)) continue;

  const family = (b.body.match(/font-family:\s*'([^']+)'/) || [, '?'])[1];
  const weight = (b.body.match(/font-weight:\s*(\d+)/) || [, '400'])[1];
  const url = (b.body.match(/url\((https:[^)]+)\)/) || [, null])[1];
  if (!url) continue;

  const name = `${family.toLowerCase().replace(/\s+/g, '-')}-${weight}-${b.subset}.woff2`;
  const dest = path.join(OUT, name);

  if (!fs.existsSync(dest)) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) { console.log(`  ✗ ${name} — HTTP ${res.status}`); continue; }
    fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
    downloaded++;
  }

  out.push(b.body.replace(/url\(https:[^)]+\)/, `url(fonts/${name})`));
  console.log(`  ✓ ${name} (${(fs.statSync(dest).size / 1024).toFixed(0)} Ko)`);
}

const header = [
  '/* Polices vendorées — générées par tools/fetch-fonts.mjs, ne pas éditer.',
  '   Sous-ensembles latin uniquement : les kanji utilisés (川 紅 葉) sont rendus',
  '   par la police système japonaise, déclarée en repli dans app.css. */',
  '',
].join('\n');

fs.writeFileSync(path.join(ROOT, 'vendor', 'fonts.css'), header + out.join('\n') + '\n');

const total = fs.readdirSync(OUT).reduce((s, f) => s + fs.statSync(path.join(OUT, f)).size, 0);
console.log(`\n${downloaded} téléchargées · ${fs.readdirSync(OUT).length} fichiers · ${(total / 1024).toFixed(0)} Ko au total`);
console.log('vendor/fonts.css écrit');
