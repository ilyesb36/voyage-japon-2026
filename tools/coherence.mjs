// Cohérence des données tenues à la main (lecture seule), en complément de verify.mjs.
//   node tools/coherence.mjs
// Depuis le 28 septembre, data/*.js s'éditent à la main : ce script vérifie que tout se
// tient — références croisées (sélection, réservations, journées, lieux), heures des
// journées, quartiers et positions, hôtels, coque du service worker, liens internes.
// Sort : ✗ (bloquant), ⚠ (à regarder), ✓ (passe). Code de sortie 1 s'il y a un ✗.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imp = (f) => import(pathToFileURL(path.join(ROOT, f)).href + '?t=' + Date.now());
const [T, D, S, P, L, SEL, DEL] = await Promise.all(['data/trip.js', 'data/days.js', 'data/spots.js',
  'data/pratique.js', 'data/lieux.js', 'data/selection.js', 'data/delices.js'].map(imp));
let Q = null;
try { Q = await imp('data/quartiers.js'); } catch (e) { console.log('⚠ data/quartiers.js illisible :', e.message); }

let bloquants = 0;
const out = (sym, msg, extra) => {
  if (sym === '✗') bloquants++;
  console.log(`${sym} ${msg}${extra ? `\n    ${[].concat(extra).slice(0, 25).join('\n    ')}` : ''}`);
};
const check = (ok, msg, fails, grave = true) => out(ok ? '✓' : grave ? '✗' : '⚠', msg, ok ? null : fails);

const { TRIP, CITIES, STEPS, HOTELS, EXCURSIONS, RESERVATIONS } = T;
const { DAYS, TEMPLATES } = D;
const { SPOTS } = S;
const { AVANT, RESERVER } = P;
const { LIEUX } = L;
const { SELECTION } = SEL;
const { DELICES } = DEL;
const byId = new Map(SPOTS.map((s) => [s.id, s]));
const TODAY = new Date().toISOString().slice(0, 10);
const KINDS = ['temple', 'nature', 'jardin', 'vue', 'quartier', 'atelier', 'musee', 'street', 'resto', 'cafe', 'bar', 'shopping', 'onsen', 'event'];
const BBOX = { // [latMin, latMax, lngMin, lngMax] — ville + excursions rattachées
  // les excursions comprises : Fuji pour Tokyo, Shirakawa-gō pour Kanazawa, Kobe, Himeji et Kōyasan pour Osaka
  tokyo: [34.9, 36.9, 138.6, 140.2], kanazawa: [35.9, 36.8, 136.2, 137.0],
  kyoto: [34.8, 35.3, 135.5, 136.0], osaka: [34.1, 35.0, 134.6, 136.0], hakone: [35.1, 35.4, 138.9, 139.3],
};
const dans = (cityId, lat, lng) => { const b = BBOX[cityId]; return b && lat >= b[0] && lat <= b[1] && lng >= b[2] && lng <= b[3]; };
const haversine = ([a, b], [c, d]) => {
  const R = 6371000, r = Math.PI / 180, x = (c - a) * r, y = (d - b) * r;
  const h = Math.sin(x / 2) ** 2 + Math.cos(a * r) * Math.cos(c * r) * Math.sin(y / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

console.log('\n== Adresses (data/spots.js) ==');
{
  const ids = SPOTS.map((s) => s.id);
  check(new Set(ids).size === ids.length, 'ids uniques', ids.filter((x, i) => ids.indexOf(x) !== i));
  const sansVille = SPOTS.filter((s) => !CITIES[s.cityId]);
  check(!sansVille.length, 'chaque adresse a une ville connue', sansVille.map((s) => `${s.id} (cityId ${s.cityId})`), false);
  const badKind = SPOTS.filter((s) => s.kind && !KINDS.includes(s.kind));
  check(!badKind.length, 'kind dans le vocabulaire', badKind.map((s) => `${s.id}: ${s.kind}`));
  const imgLocalAbsente = SPOTS.filter((s) => s.img && !/^https?:/.test(s.img) && !fs.existsSync(path.join(ROOT, s.img)));
  check(!imgLocalAbsente.length, 'chaque photo locale existe', imgLocalAbsente.map((s) => `${s.id}: ${s.img}`));
  const imgDistante = SPOTS.filter((s) => s.img && /^https?:/.test(s.img));
  check(!imgDistante.length, 'aucune photo distante (hors-ligne)', imgDistante.map((s) => s.id), false);
  const mapsKo = SPOTS.filter((s) => !s.maps || !/^https:\/\/www\.google\.com\/maps\//.test(s.maps));
  check(!mapsKo.length, 'chaque adresse a un lien Google Maps', mapsKo.map((s) => s.id), false);
  const evs = SPOTS.filter((s) => s.kind === 'event' && s.du && s.au);
  const evHors = evs.filter((s) => s.au < TRIP.start || s.du > TRIP.end);
  check(!evHors.length, 'les événements datés tombent pendant le voyage', evHors.map((s) => `${s.id} ${s.du}→${s.au}`));
  const fermes = SPOTS.filter((s) => /fermé définitivement/i.test(`${s.when} ${s.note || ''}`)).map((s) => s.id);
  console.log(`  (fiches marquées fermées : ${fermes.join(', ') || 'aucune'})`);
  const tables = SPOTS.filter((s) => s.table);
  console.log(`  (tables : ${tables.length} ; événements : ${SPOTS.filter((s) => s.kind === 'event').length} ; total : ${SPOTS.length})`);
}

console.log('\n== Sélection, plats ==');
{
  const manq = SELECTION.flatMap((g) => g.picks.filter((p) => !byId.has(p.id)).map((p) => `étape ${g.step}: ${p.id}`));
  check(!manq.length, 'chaque choix de la sélection existe', manq);
  const fermes = SELECTION.flatMap((g) => g.picks.filter((p) => /fermé définitivement/i.test(byId.get(p.id)?.when || '')).map((p) => p.id));
  check(!fermes.length, 'aucun lieu fermé dans la sélection', fermes);
  const imgD = DELICES.flatMap((g) => g.items.filter((x) => x.img && /^https?:/.test(x.img)).map((x) => x.id));
  check(!imgD.length, 'photos des plats locales (hors-ligne)', `${imgD.length} photos distantes : ${imgD.slice(0, 6).join(', ')}…`, false);
}

console.log('\n== Journées (data/days.js) ==');
{
  const lieuxManquants = DAYS.flatMap((d) => d.items.flatMap((i) => (i.lieux || []).filter((l) => !LIEUX[l]).map((l) => `${d.date}: ${l}`)));
  check(!lieuxManquants.length, 'chaque lieu cité par une journée existe dans LIEUX', lieuxManquants);
  const soirMal = DAYS.filter((d) => d.items.some((i, k) => i.evening && d.items.slice(k + 1).some((j) => !j.evening))).map((d) => d.date);
  check(!soirMal.length, 'les lignes du soir sont en fin de journée', soirMal);
  const hMal = [], hOrdre = [];
  for (const d of DAYS) {
    let prev = '';
    for (const i of d.items) {
      if (i.h === undefined) continue;
      if (!/^\d{2}:\d{2}$/.test(i.h)) hMal.push(`${d.date}: « ${i.h} »`);
      else { if (prev && i.h < prev) hOrdre.push(`${d.date}: ${prev} puis ${i.h}`); prev = i.h; }
    }
  }
  check(!hMal.length, 'les heures sont au format HH:MM', hMal);
  check(!hOrdre.length, 'les heures avancent dans la journée', hOrdre, false);
  const avecH = DAYS.filter((d) => d.items.some((i) => i.h)).length;
  console.log(`  (${avecH}/${DAYS.length} journées ont des heures)`);
  const dates = DAYS.map((d) => d.date);
  check(new Set(dates).size === dates.length, 'une journée par date', dates.filter((x, i) => dates.indexOf(x) !== i));
  const mois = { nov: '11', déc: '12', dec: '12' };
  const labelKo = DAYS.filter((d) => { const [j, m] = d.label.split(' '); return `2026-${mois[m]}-${String(j).padStart(2, '0')}` !== d.date; });
  check(!labelKo.length, 'libellé du jour = sa date', labelKo.map((d) => `${d.label} ≠ ${d.date}`));
  // charge de chaque journée : nombre de lignes de jour (hors soir) — consigne : ni 1, ni 4 par demi-journée
  const charge = DAYS.map((d) => [d.date, d.items.filter((i) => !i.evening).length, d.items.filter((i) => i.evening).length]);
  const lourdes = charge.filter(([, j]) => j > 7).map(([d, j, s]) => `${d}: ${j} lignes de jour, ${s} du soir`);
  check(!lourdes.length, 'aucune journée à plus de 7 lignes de jour', lourdes, false);
  const textes = DAYS.flatMap((d) => d.items.map((i) => `${d.date} ${i.text}`));
  // Owariya peut être cité pour dire qu'il a fermé : seule une invitation à y aller est suspecte.
  const suspects = textes.filter((t) => /san-no-tori|3ᵉ foire|troisième foire|Shochikuza|Shōsōin/i.test(t)
    || (/Owariya/i.test(t) && !/fermé/i.test(t)));
  check(!suspects.length, 'aucune mention périmée (Tori-no-ichi du 1er déc, Shochikuza, Owariya, Shōsōin)', suspects);
  const lieuxHors = Object.entries(LIEUX).filter(([, v]) => !(v.lat > 24 && v.lat < 46 && v.lng > 122 && v.lng < 146)).map(([k]) => k);
  check(!lieuxHors.length, 'coordonnées de LIEUX au Japon', lieuxHors);
}

console.log('\n== Réservations et démarches ==');
{
  const ids = [...AVANT, ...RESERVER].map((x) => x.id);
  check(new Set(ids).size === ids.length, 'ids uniques (AVANT + RESERVER)', ids.filter((x, i) => ids.indexOf(x) !== i));
  const spotKo = RESERVER.filter((r) => r.spotId && !byId.has(r.spotId)).map((r) => `${r.id} → ${r.spotId}`);
  check(!spotKo.length, 'chaque réservation pointe vers une fiche existante', spotKo);
  const jourKo = RESERVER.filter((r) => r.forDate && !DAYS.some((d) => d.date === r.forDate)).map((r) => `${r.id} ${r.forDate}`);
  check(!jourKo.length, 'chaque réservation tombe un jour du voyage', jourKo);
  const ordreKo = RESERVER.filter((r) => r.forDate && r.deadline >= r.forDate).map((r) => r.id);
  check(!ordreKo.length, 'chaque échéance précède son jour', ordreKo);
  const passees = [...AVANT, ...RESERVER].filter((x) => x.deadline < TODAY).map((x) => `${x.id} (${x.deadline})`);
  check(!passees.length, `échéances déjà passées au ${TODAY}`, passees, false);
  // la réservation est-elle évoquée dans la journée de son forDate ?
  const absentes = RESERVER.filter((r) => r.forDate).filter((r) => {
    const d = DAYS.find((x) => x.date === r.forDate); const s = byId.get(r.spotId);
    if (!d || !s) return false;
    const mot = s.name.split(/[ ,(]/)[0].toLowerCase();
    return !d.items.some((i) => i.text.toLowerCase().includes(mot));
  }).map((r) => `${r.id} le ${r.forDate}`);
  check(!absentes.length, 'chaque réservation apparaît dans sa journée', absentes, false);
}

console.log('\n== Hôtels ==');
{
  const telKo = HOTELS.filter((h) => h.tel && !/^\+81-[\d-]+$/.test(h.tel)).map((h) => `${h.name}: ${h.tel}`);
  check(!telKo.length, 'téléphones au format +81-…', telKo);
  const sansArr = HOTELS.filter((h) => !h.arrivee).map((h) => h.name);
  check(!sansArr.length, 'chaque hôtel a ses consignes d\'arrivée', sansArr, false);
  const sansJp = HOTELS.filter((h) => !/[぀-ヿ一-龯]/.test(h.address || '')).map((h) => `${h.name}: ${h.address}`);
  check(!sansJp.length, 'adresse en japonais (à montrer)', sansJp, false);
  // un numéro de réservation (10 chiffres) ou un code chiffré (« code 1234 », « *1234 ») ;
  // le mot « code » seul est permis. Ne jamais écrire un vrai code ici : le dépôt est public.
  const secrets = HOTELS.filter((h) => /\b\d{10}\b|code\s*:?\s*\d{3,}|\*\s*\d{4}\b/i.test(JSON.stringify(h.arrivee || ''))).map((h) => h.name);
  check(!secrets.length, 'aucun code ni numéro de réservation dans les consignes', secrets);
}

if (Q) {
  console.log('\n== Quartiers (data/quartiers.js) ==');
  const { QUARTIERS, OU } = Q;
  const qid = new Map(QUARTIERS.map((q) => [q.id, q]));
  check(qid.size === QUARTIERS.length, 'ids de quartier uniques', QUARTIERS.map((q) => q.id));
  const formeKo = QUARTIERS.filter((q) => !CITIES[q.cityId] || !Array.isArray(q.ll) || typeof q.rayon !== 'number' || !q.nom || !q.essentiel).map((q) => q.id);
  check(!formeKo.length, 'chaque quartier a ville, centre, rayon, nom, essentiel', formeKo);
  const horsVille = QUARTIERS.filter((q) => Array.isArray(q.ll) && !dans(q.cityId, ...q.ll)).map((q) => `${q.id} ${q.ll}`);
  check(!horsVille.length, 'chaque centre de quartier est dans la zone de sa ville', horsVille);
  const essKo = QUARTIERS.flatMap((q) => ['voir', 'faire', 'manger'].flatMap((f) => (q.essentiel[f] || [])
    .filter((id) => !byId.has(id) || !OU[id] || OU[id][2] !== q.id).map((id) => `${q.id}.${f}: ${id}${!byId.has(id) ? ' (fiche absente)' : !OU[id] ? ' (pas dans OU)' : ` (rangé dans ${OU[id][2]})`}`)));
  check(!essKo.length, 'chaque essentiel existe et appartient à son quartier', essKo);
  const ouKo = Object.entries(OU).filter(([id, v]) => !byId.has(id) || !qid.has(v[2]) || !['sure', 'approx', 'quartier'].includes(v[3]) || !['voir', 'faire', 'manger'].includes(v[4]))
    .map(([id, v]) => `${id}: ${JSON.stringify(v)}`);
  check(!ouKo.length, 'chaque entrée de OU est bien formée', ouKo);
  const villeKo = Object.entries(OU).filter(([id, v]) => byId.has(id) && qid.has(v[2]) && byId.get(id).cityId !== qid.get(v[2]).cityId)
    .map(([id, v]) => `${id} (${byId.get(id).cityId}) → ${v[2]}`);
  check(!villeKo.length, 'une adresse est rangée dans un quartier de sa ville', villeKo, false);
  const loin = Object.entries(OU).filter(([, v]) => qid.has(v[2])).map(([id, v]) => {
    const q = qid.get(v[2]); const d = haversine([v[0], v[1]], q.ll); return [id, v[2], d, q.rayon];
  }).filter(([, , d, r]) => d > 2.5 * r).map(([id, q, d, r]) => `${id} à ${Math.round(d)} m du centre de ${q} (rayon ${r})`);
  check(!loin.length, 'aucune adresse à plus de 2,5 rayons du centre de son quartier', loin, false);
  const hors = Object.entries(OU).filter(([id, v]) => byId.has(id) && !dans(byId.get(id).cityId, v[0], v[1])).map(([id, v]) => `${id} ${v[0]},${v[1]}`);
  check(!hors.length, 'chaque adresse placée est dans la zone de sa ville', hors, false);
  const petits = QUARTIERS.map((q) => [q.id, Object.values(OU).filter((v) => v[2] === q.id).length]).filter(([, n]) => n < 3).map(([id, n]) => `${id}: ${n}`);
  check(!petits.length, 'chaque quartier compte au moins 3 adresses', petits, false);
  for (const c of Object.keys(CITIES)) {
    const tous = SPOTS.filter((s) => s.cityId === c);
    const places = tous.filter((s) => OU[s.id]).length;
    console.log(`  ${c.padEnd(9)} ${String(places).padStart(3)}/${tous.length} adresses placées · ${QUARTIERS.filter((q) => q.cityId === c).length} quartiers`);
  }
  // chaque hôtel tombe-t-il dans un quartier ?
  const hq = HOTELS.map((h) => {
    const ll = h.ll; if (!ll) return `${h.name}: pas de ll`;
    const best = QUARTIERS.filter((q) => q.cityId === h.cityId).map((q) => [q, haversine(ll, q.ll)]).sort((a, b) => a[1] - b[1])[0];
    return best ? `${h.name} → ${best[0].id} (${Math.round(best[1])} m, rayon ${best[0].rayon})` : `${h.name}: aucun quartier`;
  });
  console.log('  hôtels :\n    ' + hq.join('\n    '));
}

console.log('\n== Pages et hors-ligne ==');
{
  const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  const pages = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html'));
  const coque = [...sw.matchAll(/'([^']+\.(?:html|js|css|webmanifest|png))'/g)].map((m) => m[1]).filter((f) => !f.startsWith('http'));
  const absents = coque.filter((f) => !fs.existsSync(path.join(ROOT, f)));
  check(!absents.length, 'chaque fichier de la coque existe', absents);
  const importes = new Set();
  for (const p of pages) {
    const src = fs.readFileSync(path.join(ROOT, p), 'utf8');
    for (const m of src.matchAll(/from '\.\/([^']+)'/g)) importes.add(m[1]);
    for (const m of src.matchAll(/<link[^>]+href="([^"]+\.css)"/g)) if (!/^https?:/.test(m[1])) importes.add(m[1]);
    for (const m of src.matchAll(/<script[^>]+src="([^"]+)"/g)) if (!/^https?:/.test(m[1])) importes.add(m[1]);
  }
  for (const f of fs.readdirSync(path.join(ROOT, 'app'))) {
    const src = fs.readFileSync(path.join(ROOT, 'app', f), 'utf8');
    for (const m of src.matchAll(/from '\.\.\/([^']+)'/g)) importes.add(m[1]);
    for (const m of src.matchAll(/from '\.\/([^']+)'/g)) importes.add('app/' + m[1]);
  }
  const horsCoque = [...importes].filter((f) => !coque.includes(f));
  check(!horsCoque.length, 'chaque module chargé est dans la coque du service worker', horsCoque);
  const liensMorts = [];
  for (const p of pages) {
    const src = fs.readFileSync(path.join(ROOT, p), 'utf8');
    for (const m of src.matchAll(/href="([a-z-]+\.html)[^"]*"/g)) if (!fs.existsSync(path.join(ROOT, m[1]))) liensMorts.push(`${p} → ${m[1]}`);
  }
  check(!liensMorts.length, 'aucun lien interne mort', liensMorts);
  console.log(`  (version du cache : ${(sw.match(/const V = '([^']+)'/) || [])[1]})`);
}

console.log(`\n${bloquants ? `✗ ${bloquants} point(s) bloquant(s)` : '✓ aucun point bloquant'}`);
process.exit(bloquants ? 1 : 0);
