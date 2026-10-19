// Les quartiers : ce qui se fait à pied, et « où suis-je ? ».
//
// Deux choses dans ce module, et rien d'autre :
//   1. de la logique pure — distance à pied, appartenance d'une adresse à un
//      quartier, jours du programme qui touchent un quartier, et « où suis-je ? »
//      (la position GPS du téléphone, puis le quartier qui lui correspond) ;
//   2. de quoi composer les pages — la carte d'un quartier, la fiche d'une
//      adresse, et « Montrer au chauffeur » (l'adresse en grand, pour un taxi
//      ou un passant), posé tel quel sur n'importe quelle page.
//
// Aucune dépendance externe : seules les données du voyage sont importées, et
// `esc` est redéfini ici pour que le module reste autonome. Tout est calculé
// sur le téléphone. La position GPS ne part JAMAIS dans une URL ni ailleurs :
// elle sert au tri local, puis elle est oubliée. Le lien « Rentrer » ne porte
// que la destination — Maps prend la position tout seul, côté application.
//
// Le fichier data/quartiers.js est une graine (trois quartiers de Kyoto). Tout
// ici marche avec 0, 3 ou 60 quartiers, et avec des adresses absentes de OU.

import { QUARTIERS, OU } from '../data/quartiers.js';
import { SPOTS } from '../data/spots.js';
import { LIEUX } from '../data/lieux.js';
import { DAYS } from '../data/days.js';
import { STEPS, HOTELS } from '../data/trip.js';

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
  if (m < 10000) return `${(m / 1000).toFixed(1).replace('.', ',')} km`;
  return `${Math.round(m / 1000)} km`;
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
  // Jour variable (y compris « aucun jour fixe », « fermetures irrégulières ») → horaires à vérifier.
  if (/irr[ée]guli[eè]r|不定休|v[ée]rifier|jour fixe|variable/.test(nf)) return { texte: 'Horaires à vérifier', ferme: null, verifier: true };
  // Ouvert tous les jours → rien à signaler.
  if (/^aucune|ouvert tous les jours|tous les jours|7\s*j/.test(nf)) return { texte: '', ferme: false, verifier: false };
  let ferme = null;
  if (date && !/\d/.test(nf)) {   // pas d'ordinal « 4e mardi » : seulement des jours simples
    const jour = JSEM[new Date(`${date}T00:00:00Z`).getUTCDay()];
    // Seule la première proposition nomme les jours de fermeture. Ce qui la suit (une
    // parenthèse, un « ; », un tiret long, un « + », ou « ouvert… ») précise, excepte ou
    // cite une autre source : « ouvert le dimanche », « (mercredi si lundi férié) » ou
    // « (et mardi soir) » ne ferment pas la journée.
    const principal = nf.split(/[(;+—]|\bouvert/)[0];
    ferme = principal.includes(jour);
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
 * « Où suis-je ? » (le bouton de villes.html), toutes villes confondues. On ne
 * dit « Vous êtes dans <quartier> » que pour un VRAI quartier à pied (rayon
 * modeste) : les grands regroupements de Tokyo (rayons de plusieurs km)
 * donneraient un faux positif. Sinon « Près de <l'adresse la plus proche> »,
 * et au-delà « loin ».
 */
export function ouSuisJe(pos) {
  const near = pres(pos, 1)[0] || null;      // la plus proche, remplissages exclus
  const q = quartierPour(pos);
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
 * { q, jours, premier, role }.
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

// ---------------------------------------------------------------------------
// Fragments HTML partagés (chaînes — la page les insère)
// ---------------------------------------------------------------------------

const PRIO_NOM = { ob: 'Obligatoire', top: 'Recommandé', symp: 'Sympa', niche: 'Niche' };
const PRIO_ORDRE = ['ob', 'top', 'symp', 'niche'];
const FAMILLE_NOM = { voir: 'À voir', faire: 'À faire', manger: 'À manger' };

/**
 * Un bouton-adresse qui ouvre la fiche (la page écoute `[data-fiche]`).
 * `etoile` : l'adresse est un incontournable de l'étape, on la marque d'une étoile.
 */
function spotBtn(s, { prio = false, etoile = false } = {}) {
  return `<button class="qspot" type="button" data-fiche="${esc(s.id)}">`
    + (etoile ? `<span class="etoile" role="img" aria-label="incontournable">★</span>` : '')
    + `${esc(s.name)}`
    + (prio ? `<span class="prio prio--${esc(s.priority)}">${PRIO_NOM[s.priority] || ''}</span>` : '')
    + `</button>`;
}

/** Une ligne d'essentiel (« À voir : … »), ou '' si rien de valide. `etoiles` : un Set d'ids d'adresses. */
function ligneEssentiel(cle, ids, etoiles) {
  const spots = (ids || []).map((id) => parId.get(id)).filter(Boolean);
  if (!spots.length) return '';
  return `<p class="qcard__ligne"><span class="qcard__fam">${FAMILLE_NOM[cle]}</span>`
    + `<span class="qcard__spots">${spots.map((s) => spotBtn(s, { etoile: etoiles.has(s.id) })).join('')}</span></p>`;
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
 * Une carte de quartier (chaîne HTML), repliée : le nom suffit à la reconnaître,
 * le reste s'ouvre au toucher. `entry` vient de quartiersOrdonnes ; `etoiles`
 * est un Set d'ids d'adresses à marquer d'une étoile (les incontournables de
 * l'étape) : la carte repliée en porte une aussi, si elle en cache au moins un.
 * La page insère, puis écoute `[data-fiche]` et les ancres de jour.
 */
export function carteQuartierHTML(entry, { etoiles = new Set() } = {}) {
  const { q, jours } = entry;
  const ess = q.essentiel || {};
  const lignes = [
    ligneEssentiel('voir', ess.voir, etoiles),
    ligneEssentiel('faire', ess.faire, etoiles),
    ligneEssentiel('manger', ess.manger, etoiles),
  ].join('');
  // Les étoiles se lisent dans l'essentiel, la carte repliée les annonce au même endroit.
  const aUneEtoile = [ess.voir, ess.faire, ess.manger].some((ids) => (ids || []).some((id) => etoiles.has(id)));
  return `
  <details class="qcard" id="q-${esc(q.id)}" style="--c:var(--c-${esc(q.cityId)})">
    <summary class="qcard__tete">
      <h3 class="qcard__nom">${esc(q.nom)}${q.excursion ? ' <span class="qcard__exc">excursion</span>' : ''}${q.jp ? ` <span class="qcard__jp">${esc(q.jp)}</span>` : ''}</h3>
      ${aUneEtoile ? '<span class="etoile qcard__star" role="img" aria-label="contient un incontournable">★</span>' : ''}
    </summary>
    ${q.gares?.length ? `<p class="qcard__acces"><span class="label">Accès</span> ${q.gares.map(esc).join(' · ')}</p>` : ''}
    ${q.resume ? `<p class="qcard__resume">${esc(q.resume)}</p>` : ''}
    ${q.moment ? `<p class="qcard__moment"><span class="label">Le bon moment</span> ${esc(q.moment)}</p>` : ''}
    ${jours.length ? `<p class="qcard__jours"><span class="label">Au programme</span> ${jours.map((d) => `<a class="qcard__jour" href="jour.html?d=${d.n}">${esc(d.label)}</a>`).join(' · ')}</p>` : ''}
    ${lignes ? `<div class="qcard__ess">${lignes}</div>` : ''}
    ${toutLeQuartier(q.id)}
  </details>`;
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
  // Le même numéro à la japonaise (+81-50-6877-5947 → 050-6877-5947) : c'est sous cette forme
  // que le GPS du chauffeur le cherche.
  const telJp = hotel.tel ? hotel.tel.replace(/^\+81[-\s]?/, '0') : '';

  // Un vrai <dialog> ouvert par showModal() : il passe dans le « top layer », donc
  // au-dessus de tout le reste. Plus de gestion manuelle d'inert/focus.
  const dlg = document.createElement('dialog');
  dlg.className = 'chauffeur';
  dlg.setAttribute('aria-label', 'Adresse du logement à montrer');
  dlg.innerHTML = `
    <div class="chauffeur__in">
      <button class="chauffeur__x" type="button" aria-label="Fermer">&times;</button>
      <p class="chauffeur__phrase" lang="ja"><span class="chauffeur__bloc">この住所まで</span><span class="chauffeur__bloc">お願いします</span></p>
      <p class="chauffeur__sub">« À cette adresse, s'il vous plaît »</p>
      <p class="chauffeur__adresse" lang="${adresseJp ? 'ja' : 'en'}">${esc(grand)}</p>
      ${sousAdresse ? `<p class="chauffeur__adresse2">${esc(sousAdresse)}</p>` : ''}
      <p class="chauffeur__hotel">${esc(hotel.name)}</p>
      ${telJp ? `<p class="chauffeur__gps"><span lang="ja">電話番号</span> <b class="chauffeur__num">${esc(telJp)}</b></p>
      <p class="chauffeur__sub">« Numéro de téléphone, pour le GPS »</p>` : ''}
      ${tel ? `<a class="chauffeur__tel" href="tel:${esc(tel)}">Appeler <span class="chauffeur__num">${esc(hotel.tel)}</span></a>` : ''}
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
