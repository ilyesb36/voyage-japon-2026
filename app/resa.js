// Les billets datés : Nintendo Museum et, si d'autres arrivent, la même carte.
//
// Un hôtel se rattrape, un billet à créneau non. Ces cartes ne se replient pas
// et sortent du gris du programme : c'est le seul contenu du site qui a une
// heure limite.
//
// Le module dit aussi où en sont les tables et les billets à réserver (etatDe),
// ce qui a une heure un jour donné (reservationsDuJour), ce qui presse
// (echeancesAVenir, echeancesQuiPressent) et ce qui est coché sur ce téléphone
// (lireFaits). Les pages lisent ces réponses au lieu de les refaire.

import { RESERVATIONS } from '../data/trip.js';
import { AVANT, RESERVER } from '../data/pratique.js';
import { esc, eur, formatDate, daysBetween, today } from './ui.js';

export const resasForDate = (date) => RESERVATIONS.filter((r) => r.date === date);

export function resaCard(r, { withDate = false } = {}) {
  const j = daysBetween(today(), r.date);
  const compte = j > 0 ? `dans ${j} j` : j === 0 ? "aujourd’hui" : 'passé';

  return `
  <article class="resa${j < 0 ? ' resa--past' : ''}">
    <div class="resa__slot">
      <b class="data">${esc(r.slot.split('–')[0].trim())}</b>
      <span class="label">${esc(r.slot)}</span>
    </div>
    <div class="resa__main">
      <h3 class="resa__title">${esc(r.title)}</h3>
      <p class="resa__meta mut">
        ${esc(r.where)}
        ${withDate ? ` · ${esc(formatDate(r.date, { weekday: true }))} · ${compte}` : ''}
        · ${r.people} pers. · ${eur(r.price)} ${esc(r.status)}
      </p>
      <ul class="resa__notes">
        ${r.notes.map((n) => `<li>${esc(n)}</li>`).join('')}
      </ul>
      ${r.access ? `<p class="resa__access">${esc(r.access)}</p>` : ''}
    </div>
  </article>`;
}

export const resaStrip = (date, opts) =>
  resasForDate(date).map((r) => resaCard(r, opts)).join('');

/**
 * L'état d'une entrée à réserver : ce que disent les données (`etat`) ; sinon « réservé » si la
 * case est cochée sur CE téléphone (page À faire), sinon « à réserver ». Une réservation dont la
 * date est passée et qui n'est pas réservée n'est plus « à réserver » : sa date est passée.
 */
export function etatDe(r) {
  const etat = r.etat || (lireFaits()[r.id] ? 'reserve' : 'a-reserver');
  return etat === 'a-reserver' && r.forDate && r.forDate < today() ? 'passee' : etat;
}

/** Les états en toutes lettres (etatDe, et `paye` pour un billet déjà payé) : un seul dictionnaire pour toutes les pages. */
export const ETAT = { paye: 'payé', reserve: 'réservé', 'a-reserver': 'à réserver', passee: 'date passée' };

/**
 * Tout ce qui a une heure un jour donné : les billets payés (RESERVATIONS) et
 * les tables ou billets de RESERVER, avec leur état. Trié par heure, puis sans heure.
 */
export function reservationsDuJour(date) {
  const payes = RESERVATIONS.filter((r) => r.date === date).map((r) => ({
    id: r.id, titre: r.title, heure: (r.slot || '').split('–')[0].trim(), etat: 'paye', type: 'billet', url: null,
  }));
  const autres = RESERVER.filter((r) => r.forDate === date).map((r) => ({
    id: r.id, titre: r.title, heure: r.heure || '', etat: etatDe(r), type: r.type, url: r.url || null,
  }));
  return [...payes, ...autres].sort((a, b) => (a.heure || '99:99').localeCompare(b.heure || '99:99'));
}

/**
 * Les cases cochées de la page À faire : { [id]: true | false }, propres à ce
 * téléphone. Rend toujours un objet : {} quand le stockage manque (navigation
 * privée), est abîmé, ou ne contient pas une table (null, un nombre, une liste).
 */
export function lireFaits() {
  try {
    const faits = JSON.parse(localStorage.getItem('jp2026_faits') || '{}');
    return faits && typeof faits === 'object' && !Array.isArray(faits) ? faits : {};
  } catch { return {}; }
}

/**
 * Les échéances pas faites (case cochée sur ce téléphone, ou réservation marquée
 * « reserve » dans les données), de la plus ancienne à la plus lointaine : celles
 * déjà passées comprises.
 */
function echeancesRestantes() {
  const faits = lireFaits();
  return [...AVANT, ...RESERVER]
    .filter((x) => x.deadline && !faits[x.id] && etatDe(x) !== 'reserve')
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .map((x) => ({ id: x.id, titre: x.title, deadline: x.deadline }));
}

/** Celles qui ne sont pas encore passées, de la plus proche à la plus lointaine. */
export function echeancesAVenir(depuis = today(), n = Infinity) {
  return echeancesRestantes().filter((x) => x.deadline >= depuis).slice(0, n);
}

/** Celles qui pressent : les échéances en retard, et celles des `jours` prochains jours. L'accueil les montre. */
export function echeancesQuiPressent(depuis = today(), jours = 7) {
  return echeancesRestantes().filter((x) => daysBetween(depuis, x.deadline) <= jours);
}
