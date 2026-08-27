// « Tombe-t-on au bon moment ? »
//
// C'est la question que pose un voyage nommé « l'automne des momiji », et à
// laquelle rien ne répondait. Chaque ville rougit dans sa propre fenêtre —
// Hakone tôt parce qu'on y est en altitude, Kyoto et Tokyo tard. On superpose
// les dates du séjour à ces fenêtres pour le voir d'un coup d'œil.
//
// Les fenêtres sont des moyennes des dernières années, pas une prévision 2026 :
// les prévisions japonaises ne sortent qu'en septembre. C'est dit sur la page.

import { CITIES, STEPS, TRIP } from '../data/trip.js';
import { daysBetween, formatDate } from './ui.js';

const day = (iso) => Date.parse(`${iso}T00:00:00Z`);

/** Où tombe une étape par rapport au pic de sa ville. */
export function momijiVerdict(step) {
  const city = CITIES[step.cityId];
  const [p0, p1] = city.momiji;
  const overlap = Math.min(day(step.to), day(p1)) - Math.max(day(step.from), day(p0));
  const days = Math.max(0, Math.round(overlap / 86400000));
  const stay = daysBetween(step.from, step.to);

  if (days >= stay) return { state: 'plein', days, text: 'en plein pic' };
  if (days > 0) return { state: 'partiel', days, text: `${days} j dans le pic` };
  if (day(step.to) < day(p0)) {
    const early = Math.round((day(p0) - day(step.to)) / 86400000);
    return { state: 'tot', days: 0, text: `${early} j trop tôt` };
  }
  const late = Math.round((day(step.from) - day(p1)) / 86400000);
  return { state: 'tard', days: 0, text: `${late} j trop tard` };
}

/**
 * Rend la bande. Une ligne par étape : le séjour en plein, la fenêtre du pic
 * en trame. L'échelle est commune aux six, donc les décalages se lisent
 * directement — c'est tout l'intérêt.
 */
export function renderMomijiBand(el) {
  // L'échelle couvre le voyage et déborde des deux côtés pour montrer les
  // fenêtres qui commencent avant l'arrivée ou finissent après le départ.
  const lo = day('2026-11-01');
  const hi = day('2026-12-08');
  const pct = (iso) => ((day(iso) - lo) / (hi - lo)) * 100;

  const ticks = ['2026-11-01', '2026-11-08', '2026-11-15', '2026-11-22', '2026-11-29', '2026-12-06'];

  el.innerHTML = `
    <div class="momiji">
      <div class="momiji__row momiji__row--scale" aria-hidden="true">
        <span class="momiji__name"></span>
        <span class="momiji__track momiji__track--scale">
          ${ticks.map((t) => `<span style="left:${pct(t)}%">${formatDate(t).replace(' novembre', ' nov').replace(' décembre', ' déc')}</span>`).join('')}
        </span>
        <span class="momiji__verdict"></span>
      </div>
      <ol class="momiji__rows">
        ${STEPS.map((s) => {
          const city = CITIES[s.cityId];
          const v = momijiVerdict(s);
          const [p0, p1] = city.momiji;
          return `
          <li class="momiji__row" style="--c:${city.color}">
            <span class="momiji__name">
              <span class="step-num" style="--c:${city.color}">${s.n}</span>
              ${city.name}
            </span>
            <span class="momiji__track">
              <span class="momiji__peak" style="left:${pct(p0)}%;width:${pct(p1) - pct(p0)}%"></span>
              <span class="momiji__stay" style="left:${pct(s.from)}%;width:${Math.max(1.2, pct(s.to) - pct(s.from))}%"></span>
            </span>
            <span class="momiji__verdict" data-state="${v.state}">${v.text}</span>
          </li>`;
        }).join('')}
      </ol>
      <p class="momiji__legend">
        <span class="momiji__key momiji__key--peak"></span> fenêtre habituelle du pic
        <span class="momiji__key momiji__key--stay"></span> vos dates sur place
      </p>
      <p class="momiji__note">
        Moyenne des dernières années, pas une prévision : les prévisions japonaises
        du <i lang="ja">kōyō</i> ne paraissent qu'en septembre. Hakone rougit tôt — on y est
        en altitude ; Kyoto et Tokyo tard. La boucle est faite pour finir à Tokyo au bon moment.
      </p>
    </div>`;
}
