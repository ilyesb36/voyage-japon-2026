// Les quartiers : ce qui se fait à pied, et « où suis-je ? ».
//
// Deux choses dans ce module, et rien d'autre :
//   1. de la logique pure — distance à pied, appartenance d'une adresse à un
//      quartier, jours du programme qui touchent un quartier ;
//   2. deux composants réutilisables, posés tels quels sur n'importe quelle
//      page — « Près de moi » (GPS du téléphone) et « Montrer au chauffeur »
//      (l'adresse en grand, pour un taxi ou un passant).
//
// Aucune dépendance externe : seules les données du voyage sont importées, et
// `esc` est redéfini ici pour que le module reste autonome. Tout est calculé
// sur le téléphone. La position GPS ne part JAMAIS dans une URL ni ailleurs :
// elle sert au tri local, puis elle est oubliée. Les liens « Rentrer » et
// « M'y emmener » ne portent que la destination — Maps prend la position tout
// seul, côté application.
//
// Le fichier data/quartiers.js est une graine (trois quartiers de Kyoto). Tout
// ici marche avec 0, 3 ou 60 quartiers, et avec des adresses absentes de OU.

import { QUARTIERS, OU } from '../data/quartiers.js';
import { SPOTS } from '../data/spots.js';
import { LIEUX } from '../data/lieux.js';
import { DAYS } from '../data/days.js';
import { CITIES, STEPS, HOTELS } from '../data/trip.js';

const parId = new Map(SPOTS.map((s) => [s.id, s]));
const quartierParId = new Map(QUARTIERS.map((q) => [q.id, q]));

// esc local : le module ne dépend de rien (cf. contrat « sans dépendance »).
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------------------------------------------------------------------------
// Distances
// ---------------------------------------------------------------------------

const R = 6371000;
const rad = (x) => (x * Math.PI) / 180;

/** Distance à vol d'oiseau, en mètres, entre deux [lat, lng]. */
export function metres(a, b) {
  const dLat = rad(b[0] - a[0]);
  const dLng = rad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2
    + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Minutes à pied. 4,5 km/h = 75 m/min, et on majore de 25 % : les rues ne
 * vont jamais tout droit. Jamais « 0 min » — toujours au moins une.
 */
export const minutesAPied = (m) => Math.max(1, Math.round((m * 1.25) / 75));

/** « 850 m » / « 4,2 km » / « 12 km » — l'ordre de grandeur, lisible. */
export function distanceTexte(m) {
  if (m < 1000) return `${Math.round(m / 10) * 10} m`;
  if (m < 10000) return `${(m / 1000).toFixed(1)} km`;
  return `${Math.round(m / 1000)} km`;
}

/**
 * La distance + les minutes à pied, en HTML, selon la confiance de la position :
 * 'sure' → exact ; 'approx' (≈200 m) → préfixé « ~ » ; 'quartier' → rien (la
 * coordonnée n'est qu'un point de remplissage, on ne promet pas de distance).
 */
function metaDistance(d, confiance) {
  if (confiance === 'quartier') return '';
  const t = confiance === 'approx' ? '~' : '';
  return `<span class="data">${t}${esc(distanceTexte(d))}</span> · <span class="data">${t}${minutesAPied(d)} min</span> à pied`;
}

// La date du jour, forçable par ?date= (même règle que app/ui.js) — pour savoir
// si une adresse est fermée aujourd'hui, sans dépendre de ui.js.
function dateDuJour() {
  try {
    const q = new URLSearchParams(location.search).get('date');
    if (q && /^\d{4}-\d{2}-\d{2}$/.test(q)) return q;
  } catch (e) { /* pas de location (test) */ }
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
const JSEM = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

/**
 * Ce que dit le champ `fermeture` d'une adresse, et si elle est fermée au jour
 * `date`. On ne décide « fermé aujourd'hui » que pour un jour de semaine simple
 * (pas « 4e mardi », pas d'horaire chiffré). « Ouvert tous les jours » → rien ;
 * « irrégulier / 不定休 » → horaires à vérifier.
 */
export function fermetureInfo(s, date = dateDuJour()) {
  const f = s && s.fermeture;
  if (!f) return null;
  const nf = f.toLowerCase();
  // Jour variable (y compris « aucun jour fixe ») → horaires à vérifier.
  if (/irr[ée]gulier|不定休|v[ée]rifier|jour fixe|variable/.test(nf)) return { texte: 'Horaires à vérifier', ferme: null, verifier: true };
  // Ouvert tous les jours → rien à signaler.
  if (/^aucune|ouvert tous les jours|tous les jours|7\s*j/.test(nf)) return { texte: '', ferme: false, verifier: false };
  let ferme = null;
  if (date && !/\d/.test(nf)) {   // pas d'ordinal « 4e mardi » : seulement des jours simples
    const jour = JSEM[new Date(`${date}T00:00:00Z`).getUTCDay()];
    ferme = nf.includes(jour);
  }
  return { texte: `Fermé : ${f}`, ferme, verifier: false };
}

/** Le badge « Fermé aujourd'hui » (rouge) ou « Horaires à vérifier », ou ''. */
export function fermeBadgeHTML(s, date = dateDuJour()) {
  const i = fermetureInfo(s, date);
  if (!i) return '';
  if (i.ferme === true) return `<span class="badge-ferme">Fermé aujourd'hui</span>`;
  if (i.verifier) return `<span class="badge-verif">Horaires à vérifier</span>`;
  return '';
}

/** Le filet de sécurité à toute heure : le konbini. Les mêmes mots partout. */
export const KONBINI_LIGNE = "Le plus sûr, à toute heure : un konbini (7-Eleven, Lawson, FamilyMart), ouverts 24h/24 — petit-déjeuner, oden et nikuman chauds, distributeur d'argent.";

/**
 * La fiche d'une adresse, en dialog, dans le site (pas de window.open vers Maps,
 * bloqué sur iOS). Réutilise la mise en forme .tpldlg. Montre la fermeture, et
 * garde son bouton Maps quand l'adresse a un lieu.
 */
export function ouvrirFiche(idOrSpot, { hotel, why } = {}) {
  const s = typeof idOrSpot === 'string' ? parId.get(idOrSpot) : idOrSpot;
  if (!s) return;
  const city = CITIES[s.cityId];
  const faits = [['Durée', s.duration], ['Budget', s.budget], ['Le bon moment', s.when]]
    .filter((x) => x[1]).map((x) => `<div><dt>${x[0]}</dt><dd>${esc(x[1])}</dd></div>`).join('');
  const dlg = document.createElement('dialog');
  dlg.className = 'tpldlg';
  dlg.innerHTML = `<div class="tpldlg__in"><button class="tpldlg__x" aria-label="Fermer">&times;</button><div>
    ${s.img ? `<img class="tpldlg__img" src="${esc(s.img)}" alt="">` : ''}
    <p class="tpldlg__kicker">${esc(city?.name || 'Japon')}${s.area ? ` · ${esc(s.area)}` : ''}</p>
    <div class="tpldlg__head"><h3>${esc(s.name)}</h3><p class="mut">${esc(s.blurb || '')}</p></div>
    ${why ? `<p class="fiche__why">${esc(why)}</p>` : ''}
    ${s.lore ? `<p class="fiche__lore">${esc(s.lore)}</p>` : ''}
    ${faits ? `<dl class="fiche__facts">${faits}</dl>` : ''}
    ${ficheExtra(s, hotel)}
    ${s.maps ? `<p class="tpldlg__links"><a class="btn" href="${esc(s.maps)}" target="_blank" rel="noopener">Ouvrir dans Google Maps</a></p>` : ''}
  </div></div>`;
  document.body.appendChild(dlg);
  const close = () => { dlg.close(); };
  dlg.querySelector('.tpldlg__x').addEventListener('click', close);
  dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });
  dlg.addEventListener('close', () => dlg.remove());
  dlg.showModal();
}

// ---------------------------------------------------------------------------
// Appartenance : une adresse, un quartier
// ---------------------------------------------------------------------------

/**
 * Où se trouve une adresse de data/spots.js. Accepte un id ('spot-…') ou un
 * objet spot. Renvoie { ll, quartierId, confiance, famille } ou null quand
 * l'adresse n'a pas de lieu fixe (un plat générique n'est pas dans OU).
 */
export function ouEst(spot) {
  const id = typeof spot === 'string' ? spot : spot?.id;
  const e = id && OU[id];
  if (!e) return null;
  return { ll: [e[0], e[1]], quartierId: e[2], confiance: e[3], famille: e[4] };
}

/** Le quartier d'un id. */
export const quartier = (qid) => quartierParId.get(qid) || null;

/** Les quartiers d'une ville, graine comprise (0, 3 ou 60). */
export const quartiersDe = (cityId) => QUARTIERS.filter((q) => q.cityId === cityId);

/**
 * Toutes les adresses d'un quartier, d'après OU. Renvoie des entrées enrichies
 * { spot, ll, confiance, famille } — à ranger ensuite par famille et priorité.
 */
export function adressesDe(qid) {
  const out = [];
  for (const id in OU) {
    const e = OU[id];
    if (e[2] !== qid) continue;
    const s = parId.get(id);
    if (!s) continue;
    out.push({ spot: s, ll: [e[0], e[1]], confiance: e[3], famille: e[4] });
  }
  return out;
}

/**
 * Le quartier d'un point [lat, lng] : le centre le plus proche, dans la limite
 * de 1,5 × son rayon. Au-delà, on n'est « dans » aucun quartier. `cityId`
 * restreint la recherche à une ville ; absent, on cherche partout.
 */
export function quartierPour(ll, cityId) {
  let best = null;
  let bestD = Infinity;
  for (const q of QUARTIERS) {
    if (cityId && q.cityId !== cityId) continue;
    const d = metres(ll, q.ll);
    if (d <= q.rayon * 1.5 && d < bestD) { best = q; bestD = d; }
  }
  return best;
}

/**
 * Les adresses les plus proches d'un point, toutes villes confondues. Chaque
 * entrée porte sa distance (m) et son quartier. Trié du plus près au plus loin.
 */
export function pres(ll, n = 6) {
  const all = [];
  for (const id in OU) {
    const e = OU[id];
    if (e[3] === 'quartier') continue;   // coordonnée de remplissage : hors distance
    const s = parId.get(id);
    if (!s) continue;
    all.push({
      spot: s, ll: [e[0], e[1]], quartierId: e[2], confiance: e[3],
      famille: e[4], d: metres(ll, [e[0], e[1]]),
    });
  }
  all.sort((a, b) => a.d - b.d);
  return all.slice(0, n);
}

/**
 * « Où suis-je ? » pour l'en-tête du panneau. On ne dit « Vous êtes dans
 * <quartier> » que pour un VRAI quartier à pied (rayon modeste) : les grands
 * regroupements de Tokyo (rayons de plusieurs km) donneraient un faux positif.
 * Sinon « Près de <l'adresse la plus proche> », et au-delà « à X de <ville> ».
 */
export function ouSuisJe(pos, cityId) {
  const near = pres(pos, 1)[0] || null;      // la plus proche, remplissages exclus
  const q = quartierPour(pos, cityId);
  if (q && q.rayon <= 1800) return { type: 'dans', quartier: q };
  if (near && near.d <= 1500) return { type: 'pres', spot: near.spot, quartier: quartier(near.quartierId), d: near.d };
  return { type: 'loin', near };
}

/**
 * Les jours d'une étape qui touchent un quartier — calculé, jamais recopié :
 * on part des lieux du programme (DAYS → LIEUX) et on regarde lesquels tombent
 * dans le quartier (quartierPour). Renvoie des objets DAYS, dans l'ordre.
 */
export function joursDuQuartier(qid, stepId) {
  if (!quartierParId.has(qid)) return [];
  const out = [];
  for (const d of DAYS) {
    if (stepId && d.stepId !== stepId) continue;
    let touche = false;
    for (const it of d.items) {
      for (const lid of it.lieux || []) {
        const l = LIEUX[lid];
        if (!l) continue;
        const q = quartierPour([l.lat, l.lng], l.cityId);
        if (q && q.id === qid) { touche = true; break; }
      }
      if (touche) break;
    }
    if (touche) out.push(d);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Petits accès pratiques pour les pages
// ---------------------------------------------------------------------------

/** Le nom du quartier d'une adresse, ou null. Pour l'étiqueter dans une liste. */
export function quartierNomDeSpot(spot) {
  const o = ouEst(spot);
  return o ? (quartier(o.quartierId)?.nom || null) : null;
}

// La famille d'une adresse — le chemin unique « À voir / À faire / À manger ».
// La vraie valeur (OU) quand l'adresse est placée ; sinon déduite du kind.
const FAM_PAR_KIND = {
  resto: 'manger', cafe: 'manger', bar: 'manger', street: 'manger',
  atelier: 'faire', onsen: 'faire', shopping: 'faire', event: 'faire',
};
export function familleDe(spot) {
  const o = ouEst(spot);
  if (o && o.famille) return o.famille;
  const s = (typeof spot === 'string') ? parId.get(spot) : spot;
  return FAM_PAR_KIND[s && s.kind] || 'voir';
}

/** Nom lisible d'une famille. Les mêmes mots partout. */
export const FAMILLE_LABEL = { voir: 'À voir', faire: 'À faire', manger: 'À manger' };

/** Type de lieu lisible — mêmes libellés que le guide. Pour « Près de moi ». */
export const KIND_LABEL = {
  temple: 'Temples & sanctuaires', jardin: 'Parcs & jardins', musee: 'Musées & galeries',
  vue: 'Points de vue', quartier: 'Quartiers & balades', nature: 'Nature & excursions',
  cafe: 'Cafés & salons de thé', resto: 'Restaurants', street: 'Marchés & street food',
  bar: 'Bars & nuit', shopping: 'Boutiques & shopping', atelier: 'Expériences & ateliers',
  onsen: 'Onsen & sento', event: 'Événements datés',
};

/** L'hôtel d'une ville (la première étape qui y séjourne). */
function hotelDeVille(cityId) {
  const step = STEPS.find((s) => s.cityId === cityId);
  return step ? HOTELS.find((h) => h.id === step.hotelId) : null;
}

/**
 * « à 12 min à pied de l'hôtel » quand c'est marchable, sinon « à 4,2 km de
 * l'hôtel ». Renvoie '' si on ne sait pas situer l'adresse ou l'hôtel.
 */
export function distanceHotelTexte(spot, hotel) {
  const o = ouEst(spot);
  const h = hotel || (spot?.cityId && hotelDeVille(spot.cityId));
  // 'quartier' : coordonnée de remplissage → aucune distance promise.
  if (!o || o.confiance === 'quartier' || !h || !h.ll) return '';
  const m = metres(o.ll, h.ll);
  const t = o.confiance === 'approx' ? '~' : '';
  return m <= 2000 ? `${t}${minutesAPied(m)} min à pied` : `${t}${distanceTexte(m)}`;
}

/**
 * Quartiers d'une étape, dans l'ordre d'affichage : le programme d'abord (par
 * ordre des jours), puis les autres, les excursions en dernier. Chaque entrée :
 * { q, jours, premier, role }. (« Autour de l'hôtel » est un bloc à part,
 * calculé par distance — voir autourHotel : le quartier de l'hôtel n'existe
 * pas toujours, l'appartement de Kyoto est à 2,5 km du plus proche.)
 */
export function quartiersOrdonnes(step) {
  const entries = quartiersDe(step.cityId).map((q) => {
    const jours = joursDuQuartier(q.id, step.id);
    const premier = jours.length ? Math.min(...jours.map((d) => d.n)) : Infinity;
    const role = q.excursion ? 'excursion' : (jours.length ? 'programme' : 'autre');
    return { q, jours, premier, role };
  });
  const rang = { programme: 0, autre: 1, excursion: 2 };
  entries.sort((a, b) =>
    rang[a.role] - rang[b.role]
    || a.premier - b.premier
    || a.q.nom.localeCompare(b.q.nom, 'fr'));
  return entries;
}

/** Un lien Maps non vide : la fiche de l'adresse, ou une recherche par nom. */
export const lienMaps = (s) =>
  (s && s.maps) || ('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(((s && s.name) || '') + ' Japon'));

/**
 * « Autour de l'hôtel », par DISTANCE depuis HOTELS[].ll (le quartier de
 * l'hôtel n'existe pas toujours) : les adresses de la ville à moins de `rayon`
 * mètres, les plus proches d'abord. `nearest` est la plus proche quoi qu'il
 * arrive, pour le cas « rien à moins de 20 min ».
 */
export function autourHotel(hotel, rayon = 1500, n = 8) {
  if (!hotel || !hotel.ll) return { proches: [], nearest: null };
  const all = [];
  for (const id in OU) {
    const e = OU[id];
    if (e[3] === 'quartier') continue;   // coordonnée de remplissage : hors distance
    const s = parId.get(id);
    if (!s || s.cityId !== hotel.cityId) continue;
    all.push({ spot: s, ll: [e[0], e[1]], quartierId: e[2], confiance: e[3], famille: e[4], d: metres(hotel.ll, [e[0], e[1]]) });
  }
  all.sort((a, b) => a.d - b.d);
  return { proches: all.filter((x) => x.d <= rayon).slice(0, n), nearest: all[0] || null };
}

/**
 * Le bloc « Autour de l'hôtel » (chaîne HTML). Si rien n'est à portée, on le
 * dit et on montre la plus proche. onSpot:true → les adresses ouvrent la fiche
 * (villes.html) ; sinon un lien Maps (jour.html).
 */
export function autourHotelHTML(hotel, { onSpot = false } = {}) {
  const { proches, nearest } = autourHotel(hotel);
  if (!nearest) return '';
  const item = (x) => {
    const nomQ = quartier(x.quartierId)?.nom;
    const meta = `${nomQ ? esc(nomQ) + ' · ' : ''}${metaDistance(x.d, x.confiance)}`;
    const inner = `<span class="autour__nom">${esc(x.spot.name)}</span><span class="autour__meta">${meta}</span>`;
    return onSpot
      ? `<button class="autour__item" type="button" data-fiche="${esc(x.spot.id)}">${inner}</button>`
      : `<a class="autour__item" href="${esc(lienMaps(x.spot))}" target="_blank" rel="noopener">${inner}</a>`;
  };
  const corps = proches.length
    ? `<div class="autour__items">${proches.map(item).join('')}</div>`
    : `<p class="mut">Rien du guide à moins de 20 min à pied. Le plus proche :</p><div class="autour__items">${item(nearest)}</div>`;
  return `<div class="autour"><p class="label">Autour de l'hôtel</p>${corps}</div>`;
}

// ---------------------------------------------------------------------------
// Fragments HTML partagés (chaînes — la page les insère)
// ---------------------------------------------------------------------------

const PRIO_NOM = { ob: 'Obligatoire', top: 'Recommandé', symp: 'Sympa', niche: 'Niche' };
const PRIO_ORDRE = ['ob', 'top', 'symp', 'niche'];
const FAMILLE_NOM = { voir: 'À voir', faire: 'À faire', manger: 'À manger' };

/** Un bouton-adresse qui ouvre la fiche (la page écoute `[data-fiche]`). */
function spotBtn(s, { prio = false } = {}) {
  return `<button class="qspot" type="button" data-fiche="${esc(s.id)}">`
    + `${esc(s.name)}`
    + (prio ? `<span class="prio prio--${esc(s.priority)}">${PRIO_NOM[s.priority] || ''}</span>` : '')
    + `</button>`;
}

/** Une ligne d'essentiel (« À voir : … »), ou '' si rien de valide. */
function ligneEssentiel(cle, ids) {
  const spots = (ids || []).map((id) => parId.get(id)).filter(Boolean);
  if (!spots.length) return '';
  return `<p class="qcard__ligne"><span class="qcard__fam">${FAMILLE_NOM[cle]}</span>`
    + `<span class="qcard__spots">${spots.map((s) => spotBtn(s)).join('')}</span></p>`;
}

/** Tout le quartier, rangé par famille puis priorité (ob, top, symp, niche). */
function toutLeQuartier(qid) {
  const items = adressesDe(qid);
  if (!items.length) return '';
  const blocs = ['voir', 'faire', 'manger'].map((fam) => {
    const dedans = items
      .filter((x) => x.famille === fam)
      .sort((a, b) => PRIO_ORDRE.indexOf(a.spot.priority) - PRIO_ORDRE.indexOf(b.spot.priority));
    if (!dedans.length) return '';
    return `<div class="qall__fam"><span class="qcard__fam">${FAMILLE_NOM[fam]}</span>`
      + `<span class="qcard__spots">${dedans.map((x) => spotBtn(x.spot, { prio: true })).join('')}</span></div>`;
  }).filter(Boolean).join('');
  return `<details class="qcard__all"><summary>Tout le quartier (${items.length})</summary>`
    + `<div class="qall">${blocs}</div></details>`;
}

/**
 * Une carte de quartier (chaîne HTML). `entry` vient de quartiersOrdonnes.
 * La page insère, puis écoute `[data-fiche]` et les ancres de jour.
 */
export function carteQuartierHTML(entry) {
  const { q, jours } = entry;
  const ess = q.essentiel || {};
  const lignes = [
    ligneEssentiel('voir', ess.voir),
    ligneEssentiel('faire', ess.faire),
    ligneEssentiel('manger', ess.manger),
  ].join('');
  return `
  <article class="qcard" id="q-${esc(q.id)}" style="--c:var(--c-${esc(q.cityId)})">
    <div class="qcard__tete">
      <h3 class="qcard__nom">${esc(q.nom)}${q.excursion ? ' <span class="qcard__exc">excursion</span>' : ''}${q.jp ? ` <span class="qcard__jp">${esc(q.jp)}</span>` : ''}</h3>
    </div>
    ${q.gares?.length ? `<p class="qcard__acces"><span class="label">Accès</span> ${q.gares.map(esc).join(' · ')}</p>` : ''}
    ${q.resume ? `<p class="qcard__resume">${esc(q.resume)}</p>` : ''}
    ${q.moment ? `<p class="qcard__moment"><span class="label">Le bon moment</span> ${esc(q.moment)}</p>` : ''}
    ${jours.length ? `<p class="qcard__jours"><span class="label">Au programme</span> ${jours.map((d) => `<a class="qcard__jour" href="jour.html?d=${d.n}">${esc(d.label)}</a>`).join(' · ')}</p>` : ''}
    ${lignes ? `<div class="qcard__ess">${lignes}</div>` : ''}
    ${toutLeQuartier(q.id)}
  </article>`;
}

/**
 * La fiche d'une adresse gagne : son quartier, sa distance à l'hôtel, et —
 * s'ils existent — la réservation et la note Tabelog. Renvoie '' si rien.
 * À insérer dans le corps de la fiche (villes.html, guide.html).
 */
export function ficheExtra(spot, hotel) {
  const nomQ = quartierNomDeSpot(spot);
  const dist = distanceHotelTexte(spot, hotel);
  const badge = fermeBadgeHTML(spot);
  const faits = [];
  if (spot?.jp) faits.push(`<div><dt>En japonais</dt><dd lang="ja">${esc(spot.jp)}</dd></div>`);
  if (nomQ) faits.push(`<div><dt>Quartier</dt><dd>${esc(nomQ)}</dd></div>`);
  if (dist) faits.push(`<div><dt>Depuis l'hôtel</dt><dd>${esc(dist)}</dd></div>`);
  if (spot?.tabelog) faits.push(`<div><dt>Tabelog</dt><dd class="data">${esc(spot.tabelog)}</dd></div>`);
  if (spot?.fermeture && !/aucun|tous les jours/i.test(spot.fermeture)) faits.push(`<div><dt>Fermeture</dt><dd>${esc(spot.fermeture)}</dd></div>`);
  const resa = spot?.resa;
  const blocResa = resa
    ? `<p class="fiche__resa"><b>Réservation</b> ${esc(resa.canal || '')}`
      + `${resa.ouverture ? ` · ${esc(resa.ouverture)}` : ''}`
      + `${resa.conseil ? `<span class="mut"> — ${esc(resa.conseil)}</span>` : ''}`
      + `${resa.url ? ` <a href="${esc(resa.url)}" target="_blank" rel="noopener">réserver</a>` : ''}</p>`
    : '';
  if (!faits.length && !blocResa && !badge) return '';
  return `${badge ? `<p class="fiche__ferme">${badge}</p>` : ''}${faits.length ? `<dl class="fiche__q">${faits.join('')}</dl>` : ''}${blocResa}`;
}

// ---------------------------------------------------------------------------
// « Montrer au chauffeur » — l'adresse en grand, hors-ligne, toujours clair
// ---------------------------------------------------------------------------

const EN_JP = (s) => /[぀-ヿ㐀-鿿＀-￯]/.test(s || '');

/**
 * Plein écran très lisible, pour un taxi ou un passant quand on est perdu.
 * Fond clair et contraste maximal même en thème sombre (classe .chauffeur,
 * couleurs figées en dur). Rien d'externe : marche hors-ligne.
 */
export function montreChauffeur(hotel) {
  if (!hotel) return;
  const adresseJp = EN_JP(hotel.address);
  const grand = adresseJp ? hotel.address : (hotel.bookingName || hotel.name);
  const sousAdresse = adresseJp ? '' : (hotel.address || '');
  const tel = hotel.tel ? hotel.tel.replace(/[^+\d]/g, '') : '';

  // Un vrai <dialog> ouvert par showModal() : il passe dans le « top layer »,
  // donc AU-DESSUS du panneau « Perdu ? » (lui aussi un dialog modal), et y
  // revient à la fermeture. Plus de gestion manuelle d'inert/focus.
  const dlg = document.createElement('dialog');
  dlg.className = 'chauffeur';
  dlg.setAttribute('aria-label', 'Adresse du logement à montrer');
  dlg.innerHTML = `
    <div class="chauffeur__in">
      <button class="chauffeur__x" type="button" aria-label="Fermer">&times;</button>
      <p class="chauffeur__phrase" lang="ja">この住所までお願いします</p>
      <p class="chauffeur__sub">« À cette adresse, s'il vous plaît »</p>
      <p class="chauffeur__adresse" lang="${adresseJp ? 'ja' : 'en'}">${esc(grand)}</p>
      ${sousAdresse ? `<p class="chauffeur__adresse2">${esc(sousAdresse)}</p>` : ''}
      <p class="chauffeur__hotel">${esc(hotel.name)}</p>
      ${tel ? `<a class="chauffeur__tel" href="tel:${esc(tel)}">Appeler ${esc(hotel.tel)}</a>` : ''}
    </div>`;
  document.body.appendChild(dlg);
  const close = () => dlg.close();
  dlg.querySelector('.chauffeur__x').addEventListener('click', close);
  dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });
  dlg.addEventListener('close', () => dlg.remove());
  dlg.showModal();
}

/** Un bouton « Montrer au chauffeur » déjà câblé, à insérer dans un en-tête. */
export function boutonChauffeur(hotel) {
  if (!hotel) return null;
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'btn btn--ghost';
  b.textContent = 'Montrer au chauffeur';
  b.addEventListener('click', () => montreChauffeur(hotel));
  return b;
}

// ---------------------------------------------------------------------------
// Géolocalisation
// ---------------------------------------------------------------------------

/**
 * La position du téléphone, en Promise de [lat, lng]. Haute précision, délai
 * raisonnable. Rejette proprement (refus, indisponible) — jamais d'exception
 * non gérée, et rien n'est envoyé nulle part.
 */
export function maPosition() {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) { reject(new Error('indispo')); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => resolve([p.coords.latitude, p.coords.longitude]),
      (e) => reject(e),
      { enableHighAccuracy: true, timeout: 9000, maximumAge: 30000 },
    );
  });
}

/** Le lien d'itinéraire en transports vers l'hôtel. Sans origine : Maps prend
 *  la position. Jamais de coordonnées de l'utilisateur dans l'URL. */
export function lienRentrer(hotel) {
  if (!hotel) return null;
  const dest = hotel.ll ? `${hotel.ll[0]},${hotel.ll[1]}` : (hotel.name || '');
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}&travelmode=transit`;
}

// ---------------------------------------------------------------------------
// « Près de moi » — composant réutilisable (bouton + panneau)
// ---------------------------------------------------------------------------

/**
 * Pose un bloc « Près de moi » dans `el`. Au clic : la position, puis où l'on
 * est (« Vous êtes dans … » ou « à X de … »), les six adresses les plus
 * proches (nom, quartier, distance, minutes à pied), et « Rentrer à l'hôtel ».
 *
 * opts.step   : l'étape courante (pour la ville et son centre) — requis.
 * opts.hotel  : l'hôtel de l'étape (pour « Rentrer ») — facultatif.
 * opts.onSpot : callback(id) au toucher d'une adresse (ouvre la fiche). Sans
 *               lui, l'adresse ouvre Google Maps.
 */
let _lastPos = null;
/** La dernière position obtenue, ou null. Sert à trier « Dans le coin ». */
export const positionConnue = () => _lastPos;

export function montePresDeMoi(el, { step, hotel, onSpot, onPos } = {}) {
  if (!el || !step) return;
  const ville = CITIES[step.cityId];
  // Toucher une adresse ouvre la fiche DANS le site (pas window.open vers Maps,
  // bloqué sur iOS). La fiche garde son propre bouton Maps.
  const ouvrir = onSpot || ((id) => ouvrirFiche(id, { hotel }));
  el.classList.add('proche');
  el.innerHTML = `
    <button class="btn proche__btn" type="button">Près de moi</button>
    <div class="proche__panel" hidden></div>`;
  const btn = el.querySelector('.proche__btn');
  const panel = el.querySelector('.proche__panel');
  const dire = (html) => { panel.hidden = false; panel.innerHTML = html; };

  let fam = 'all';     // filtre d'envie du panneau
  let dernier = null;  // dernière position affichée

  const rendre = (pos) => {
    dernier = pos;
    const info = ouSuisJe(pos, step.cityId);
    let ou;
    if (info.type === 'dans') ou = `Vous êtes dans <b>${esc(info.quartier.nom)}</b>${info.quartier.jp ? ` <span class="proche__jp">${esc(info.quartier.jp)}</span>` : ''}`;
    else if (info.type === 'pres') ou = `Près de <b>${esc(info.spot.name)}</b>${info.quartier ? ` <span class="proche__jp">${esc(info.quartier.nom)}</span>` : ''}`;
    else {
      const ancre = step.ll || (hotel && hotel.ll);
      const loin = ancre ? distanceTexte(metres(pos, ancre)) : null;
      ou = loin ? `Vous êtes à <b>${esc(loin)}</b> de ${esc(ville?.name || 'la ville')}` : 'Position repérée';
    }

    const tout = pres(pos, 40);
    const compte = (f) => (f === 'all' ? tout.length : tout.filter((x) => familleDe(x.spot) === f).length);
    const chips = [['all', 'Tout'], ['voir', 'À voir'], ['faire', 'À faire'], ['manger', 'À manger']]
      .map(([id, lab]) => `<button class="chip proche__fam" type="button" data-fam="${id}" aria-pressed="${fam === id}">${lab}<span class="ptabs__n">${compte(id)}</span></button>`).join('');

    const sel = (fam === 'all' ? tout : tout.filter((x) => familleDe(x.spot) === fam)).slice(0, 6);
    const liste = sel.map((x) => {
      const nomQ = quartier(x.quartierId)?.nom;
      const badge = fermeBadgeHTML(x.spot);
      // Type de lieu (comme le guide) + prix court en tête : « Restaurants ·
      // ~1 000 ¥ » se lit d'un coup. Repli sur la famille si le kind manque.
      const type = KIND_LABEL[x.spot.kind] || FAMILLE_LABEL[familleDe(x.spot)] || '';
      const prix = x.spot.budget ? ` · ${esc(x.spot.budget)}` : '';
      return `<li>
        <button class="proche__spot" type="button" data-id="${esc(x.spot.id)}">
          <span class="proche__nom">${esc(x.spot.name)}${badge ? ` ${badge}` : ''}</span>
          <span class="proche__meta">${esc(type)}${prix} · ${nomQ ? `${esc(nomQ)} · ` : ''}${metaDistance(x.d, x.confiance)}</span>
          ${x.spot.when ? `<span class="proche__when">${esc(x.spot.when)}</span>` : ''}
        </button></li>`;
    }).join('');

    const rentrer = lienRentrer(hotel);
    dire(`
      <p class="proche__ou">${ou}</p>
      <div class="chipbar proche__fams">${chips}</div>
      ${liste ? `<ul class="proche__liste">${liste}</ul>` : `<p class="mut">Aucune adresse de cette envie tout près.</p>`}
      <p class="proche__konbini">${esc(KONBINI_LIGNE)}</p>
      ${rentrer ? `<a class="btn proche__rentrer" href="${esc(rentrer)}" target="_blank" rel="noopener">Rentrer à l'hôtel</a>` : ''}
    `);
  };

  btn.addEventListener('click', () => {
    btn.disabled = true;
    dire(`<p class="proche__ou mut">Localisation en cours…</p>`);
    maPosition().then((pos) => {
      btn.disabled = false; _lastPos = pos; rendre(pos); if (onPos) onPos(pos);
    }).catch(() => {
      btn.disabled = false;
      dire(`<p class="proche__ou">La localisation n'est pas disponible.</p>
        <p class="mut">Autorisez l'accès à votre position, puis réessayez. Rien n'est envoyé : la position reste sur le téléphone.</p>
        <p class="proche__konbini">${esc(KONBINI_LIGNE)}</p>`);
    });
  });

  panel.addEventListener('click', (e) => {
    const f = e.target.closest('.proche__fam');
    if (f) { fam = f.dataset.fam; if (dernier) rendre(dernier); return; }
    const b = e.target.closest('.proche__spot');
    if (b) ouvrir(b.dataset.id);
  });
}

/**
 * « Dans le coin » pour la page du jour : pour les quartiers touchés par la
 * journée, l'essentiel qui n'est PAS déjà au programme — « Pour manger »
 * d'abord, puis « Si vous avez du temps ». Renvoie '' s'il n'y a rien.
 *
 * Une adresse est « déjà au programme » si elle tombe à moins de ~100 m d'un
 * lieu visité ce jour-là (spots et lieux viennent des mêmes coordonnées).
 */
export function dansLeCoinHTML(jour, { pos } = {}) {
  const step = STEPS.find((s) => s.id === jour.stepId);
  if (!step) return '';

  // Les points visités ce jour, et les quartiers qu'ils touchent.
  const points = [];
  const quartiersTouches = new Map();
  for (const it of jour.items) {
    for (const lid of it.lieux || []) {
      const l = LIEUX[lid];
      if (!l) continue;
      points.push([l.lat, l.lng]);
      const q = quartierPour([l.lat, l.lng], l.cityId);
      if (q) quartiersTouches.set(q.id, q);
    }
  }
  if (!points.length) return '';

  // Tri : par distance à la position si on la connaît (Près de moi déjà utilisé),
  // sinon au barycentre des lieux du jour. Jamais d'adresse à plus de 5 km de
  // tout lieu du jour.
  const bary = [points.reduce((a, p) => a + p[0], 0) / points.length,
                points.reduce((a, p) => a + p[1], 0) / points.length];
  const ancre = pos || bary;
  const minAuxLieux = (ll) => Math.min(...points.map((p) => metres(ll, p)));
  const dejaLa = (ll) => points.some((p) => metres(ll, p) < 100);

  const manger = [];
  const temps = [];
  const vus = new Set();
  for (const q of quartiersTouches.values()) {
    const ess = q.essentiel || {};
    const pousser = (ids, bac) => {
      for (const id of ids || []) {
        if (vus.has(id)) continue;
        const s = parId.get(id);
        const o = ouEst(id);
        if (!s || !o || dejaLa(o.ll) || minAuxLieux(o.ll) > 5000) continue;
        vus.add(id);
        bac.push({ s, q, d: metres(ancre, o.ll) });
      }
    };
    pousser(ess.manger, manger);
    pousser(ess.voir, temps);
    pousser(ess.faire, temps);
  }
  manger.sort((a, b) => a.d - b.d);
  temps.sort((a, b) => a.d - b.d);

  // Les événements qui tombent ce jour-là (kind 'event', `jours` contient la date).
  const evts = [];
  for (const s of SPOTS) {
    if (s.kind !== 'event' || !Array.isArray(s.jours) || !s.jours.includes(jour.date)) continue;
    const o = ouEst(s);
    const ll = o ? o.ll : (Array.isArray(s.ll) ? s.ll : null);
    if (ll && minAuxLieux(ll) > 5000) continue;
    evts.push({ s, q: o ? quartier(o.quartierId) : null, d: ll ? metres(ancre, ll) : Infinity });
  }
  evts.sort((a, b) => a.d - b.d);

  if (!manger.length && !temps.length && !evts.length) return '';

  const item = ({ s, q }) => {
    const badge = fermeBadgeHTML(s);
    return `<button class="coin__item" type="button" data-fiche="${esc(s.id)}">`
      + `<span class="coin__nom">${esc(s.name)}${badge ? ` ${badge}` : ''}</span>`
      + `${q ? `<span class="coin__q mut">${esc(q.nom)}</span>` : ''}</button>`;
  };

  const groupe = (titre, bac) => bac.length
    ? `<div class="coin__grp"><span class="label">${titre}</span><div class="coin__items">${bac.map(item).join('')}</div></div>`
    : '';

  return `
    <div class="shead"><h2>Dans le coin</h2><p>L'essentiel du quartier, pas déjà prévu aujourd'hui.</p></div>
    <div class="coin">
      ${groupe('Ce jour-là', evts)}
      ${groupe('Pour manger', manger)}
      ${groupe('Si vous avez du temps', temps)}
    </div>`;
}

// ---------------------------------------------------------------------------
// « Perdu ? » — le panneau d'urgence, accessible de partout pendant le voyage
// ---------------------------------------------------------------------------

/**
 * Ouvre le panneau « Perdu ? » : Près de moi (position → quartier + adresses),
 * « Rentrer à l'hôtel » (via Près de moi), « Montrer au chauffeur », appeler
 * l'hôtel, et les numéros d'urgence. `step`/`hotel` = ceux du jour en cours.
 */
export function montePerdu({ step, hotel, autoPres } = {}) {
  const tel = hotel && hotel.tel ? hotel.tel.replace(/[^+\d]/g, '') : '';
  const rentrer = lienRentrer(hotel);
  const dlg = document.createElement('dialog');
  dlg.className = 'perdu';
  dlg.setAttribute('aria-label', 'Perdu ?');
  dlg.innerHTML = `
    <div class="perdu__in">
      <button class="perdu__x" aria-label="Fermer">&times;</button>
      <h2 class="perdu__titre">Perdu ?</h2>
      <div class="perdu__actions">
        ${rentrer ? `<a class="btn" href="${esc(rentrer)}" target="_blank" rel="noopener">Rentrer à l'hôtel</a>` : ''}
        ${hotel ? '<button class="btn btn--ghost" type="button" data-chauffeur>Montrer au chauffeur</button>' : ''}
        ${tel ? `<a class="btn btn--ghost" href="tel:${esc(tel)}">Appeler le logement</a>` : ''}
      </div>
      <div class="perdu__pres" id="perdu-pres"></div>
      <div class="perdu__urgences">
        <span class="label">Urgences</span>
        <a class="btn btn--ghost" href="tel:110">Police · 110</a>
        <a class="btn btn--ghost" href="tel:119">Pompiers · ambulance · 119</a>
        <a class="btn btn--ghost" href="tel:+815038162787">Hotline touristes, en anglais, 24h/24 · 050-3816-2787</a>
      </div>
    </div>`;
  document.body.appendChild(dlg);
  let presBtn = null;
  if (step) {
    montePresDeMoi(dlg.querySelector('#perdu-pres'), { step, hotel, onSpot: (id) => ouvrirFiche(id, { hotel }) });
    presBtn = dlg.querySelector('#perdu-pres .proche__btn');
  } else {
    dlg.querySelector('#perdu-pres').innerHTML = `<p class="mut">Journée hors étape — pas de quartier à proximité.</p><p class="proche__konbini">${esc(KONBINI_LIGNE)}</p>`;
  }
  dlg.querySelector('[data-chauffeur]')?.addEventListener('click', () => montreChauffeur(hotel));
  const close = () => { dlg.close(); };
  dlg.querySelector('.perdu__x').addEventListener('click', close);
  dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });
  dlg.addEventListener('close', () => dlg.remove());
  dlg.showModal();
  // Depuis l'accueil : on déclenche directement « Près de moi ».
  if (autoPres && presBtn) presBtn.click();
}
