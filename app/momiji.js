// « Tombe-t-on au bon moment ? »
//
// C'est la question que pose un voyage nommé « l'automne des momiji », et à
// laquelle rien ne répondait. Chaque ville rougit dans sa propre fenêtre —
// Hakone tôt parce qu'on y est en altitude, Kyoto et Tokyo tard. On superpose
// les dates du séjour à ces fenêtres pour le voir d'un coup d'œil.
//
// Les fenêtres suivent les prévisions par lieu de Weathernews (pages du 15 au 26 oct. 2026),
// croisées avec tenki.jp (日本気象協会, édition du 14 oct.) et le Japan Meteorological
// Corporation (2e édition du 1er oct.) : du début du pic au début de la chute des feuilles.

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
  // Un départ le jour même où le pic commence est encore « trop tôt » (Kyoto en a été un).
  if (day(step.to) <= day(p0)) {
    const early = Math.round((day(p0) - day(step.to)) / 86400000);
    return { state: 'tot', days: 0, text: early ? `${early} j trop tôt` : 'le pic arrive au départ' };
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
          // Le dégradé suit la feuille : verte avant, or à l'entrée du pic,
          // rouge au cœur, brune après. Les bornes sont calées sur la fenêtre
          // de cette ville, donc le dessin dit la même chose que le chiffre.
          const a = pct(p0), b = pct(p1), w = b - a;
          const feuille = `linear-gradient(90deg,
            #6E8B4B 0%,
            #9CA84A ${Math.max(0, a - 4)}%,
            #C9962F ${a}%,
            #B4451F ${a + w * 0.45}%,
            #8C2F1A ${b}%,
            #6B5648 ${Math.min(100, b + 6)}%,
            #5C5A52 100%)`;
          return `
          <li class="momiji__row" style="--c:var(--c-${city.id})">
            <span class="momiji__name">
              <span class="step-num" style="--c:var(--c-${city.id})">${s.n}</span>
              ${city.name}
            </span>
            <span class="momiji__track">
              <span class="momiji__season" style="background-image:${feuille}"></span>
              <span class="momiji__peak" style="background-image:${feuille};
                    clip-path:inset(0 ${(100 - b).toFixed(2)}% 0 ${a.toFixed(2)}%)"></span>
              <span class="momiji__stay" style="left:${pct(s.from)}%;width:${Math.max(1.6, pct(s.to) - pct(s.from))}%"></span>
            </span>
            <span class="momiji__verdict" data-state="${v.state}">${v.text}</span>
          </li>`;
        }).join('')}
      </ol>
      <p class="momiji__legend">
        <span class="momiji__key momiji__key--season"></span> la feuille, du vert au brun
        <span class="momiji__key momiji__key--stay"></span> vos dates sur place
      </p>
      <p class="momiji__note">
        Prévisions par lieu de Weathernews et tenki.jp, relevées le 26 octobre 2026 : une saison dans la normale, à peine en retard.
        Nikkō le 12 : en plein pic en ville (Tōshōgū, Rinnō-ji), déjà en chute au lac Chūzenji et à Irohazaka.
        Kanazawa : les couleurs commencent, Kenroku-en culmine vers le 20.
        Kyoto du 16 au 22 : les érables virent, les grands temples culminent juste après votre départ (22–24 nov.) ;
        Arashiyama le 21 est à l'entrée du pic (Tenryū-ji dès le 18) — et les illuminations du soir font le reste.
        Osaka et Nara : en plein pic. Hakone : en plein pic à Gōra, en fin de saison au bord du lac.
        Tokyo, second séjour : les ginkgos de Gaien au sommet (dès le 26–29), Rikugi-en juste avant le sien (dès le 3 déc.) ; Kamakura le 29, presque au pic.
        Prochaine mise à jour des prévisions début novembre.
      </p>
    </div>`;
}
