// Les billets datés : Nintendo Museum et, si d'autres arrivent, la même carte.
//
// Un hôtel se rattrape, un billet à créneau non. Ces cartes ne se replient pas
// et sortent du gris du programme : c'est le seul contenu du site qui a une
// heure limite.

import { RESERVATIONS } from '../data/trip.js';
import { esc, formatDate, daysBetween, today } from './ui.js';

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
        · ${r.people} pers. · ${esc(String(r.price))} € ${esc(r.status)}
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
