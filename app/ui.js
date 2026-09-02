// Chrome de page et petits composants partagés par les cinq pages.
import { TRIP } from '../data/trip.js';

/**
 * Le moment du voyage : avant, pendant, après.
 *
 * Le site a trois vies et la même barre servait aux trois. Avant, on prépare :
 * échéances, budget, programme. Pendant, téléphone en main, on veut la journée
 * et le guide — pas le compte à rebours ni le budget. Après, c'est un souvenir.
 * La barre change d'ordre et de libellés selon le moment, et cache ce qui ne
 * sert plus. Rien n'est supprimé : toutes les pages restent atteignables par
 * leur adresse.
 */
export function moment() {
  const t = today();
  if (t < TRIP.start) return 'avant';
  if (t <= TRIP.end) return 'pendant';
  return 'apres';
}

const PAGES_PAR_MOMENT = {
  avant: [
    { href: 'index.html',      label: 'Le voyage' },
    { href: 'aujourdhui.html', label: 'Préparatifs' },
    { href: 'itineraire.html', label: 'Le programme' },
    { href: 'jour.html',       label: 'La journée' },
    { href: 'guide.html',      label: 'Le guide' },
    { href: 'budget.html',     label: 'Le budget' },
    { href: 'pratique.html',   label: 'Pratique' },
  ],
  // Pendant : « Aujourd'hui » EST la page du jour, qui s'ouvre sur la date du
  // jour. Le compte à rebours et le budget reculent — on ne les cherche pas dans
  // le métro. Le voyage (l'accueil) reste là pour le montrer à quelqu'un.
  pendant: [
    { href: 'jour.html',       label: "Aujourd'hui" },
    { href: 'guide.html',      label: 'Le guide' },
    { href: 'itineraire.html', label: 'Le programme' },
    { href: 'pratique.html',   label: 'Pratique' },
    { href: 'budget.html',     label: 'Le budget' },
    { href: 'index.html',      label: 'Le voyage' },
  ],
  apres: [
    { href: 'index.html',      label: 'Le voyage' },
    { href: 'itineraire.html', label: 'Le programme' },
    { href: 'jour.html',       label: 'Les journées' },
    { href: 'guide.html',      label: 'Le guide' },
    { href: 'budget.html',     label: 'Le budget' },
    { href: 'pratique.html',   label: 'Pratique' },
  ],
};
const PAGES = PAGES_PAR_MOMENT[moment()];

export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** Date du jour, forçable par ?date=2026-11-18 pour tester les états futurs. */
export function today() {
  const q = new URLSearchParams(location.search).get('date');
  if (q && /^\d{4}-\d{2}-\d{2}$/.test(q)) return q;
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Nombre de jours entiers entre deux dates ISO. */
export function daysBetween(a, b) {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);
}

const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet',
                'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

export function formatDate(iso, { weekday = false, year = false } = {}) {
  const d = new Date(`${iso}T00:00:00Z`);
  const parts = [];
  if (weekday) parts.push(DAYS[d.getUTCDay()]);
  parts.push(String(d.getUTCDate()), MONTHS[d.getUTCMonth()]);
  if (year) parts.push(String(d.getUTCFullYear()));
  return parts.join(' ');
}

export const eur = (n) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

/** Monte la barre de navigation et le pied de page. */
/**
 * Le thème. Le crème est le défaut assumé ; le sombre est un choix que l'on
 * garde d'une visite à l'autre. On l'applique avant le rendu pour éviter
 * l'éclair blanc au chargement.
 */
export function applyTheme() {
  let saved = null;
  try { saved = localStorage.getItem('jp2026_theme'); } catch {}
  if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
}
applyTheme();

function toggleTheme() {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (dark) document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', 'dark');
  try { localStorage.setItem('jp2026_theme', dark ? 'light' : 'dark'); } catch {}
  syncThemeButton();
}

function syncThemeButton() {
  const btn = document.querySelector('.nav__theme');
  if (!btn) return;
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  btn.textContent = dark ? '☾' : '☀';
  btn.setAttribute('aria-label', dark ? 'Passer en clair' : 'Passer en sombre');
  btn.setAttribute('aria-pressed', String(dark));
}

export function mountChrome(current) {
  const away = daysBetween(today(), TRIP.start);
  const counter = away > 0 ? `J−${away}`
                : away === 0 ? "C'est aujourd'hui"
                : daysBetween(today(), TRIP.end) >= 0 ? 'En voyage'
                : 'Souvenirs';

  document.body.insertAdjacentHTML('afterbegin', `
    <nav class="nav">
      <div class="nav__in">
        <a class="nav__brand" href="index.html">Japon 2026</a>
        <button class="nav__burger" aria-label="Ouvrir le menu" aria-expanded="false">☰</button>
        <div class="nav__links">
          ${PAGES.map((p) => `<a href="${p.href}"${p.href === current ? ' aria-current="page"' : ''}>${p.label}</a>`).join('')}
        </div>
        <span class="nav__count">${counter}</span>
        <button class="nav__theme" type="button"></button>
      </div>
    </nav>`);

  document.body.insertAdjacentHTML('beforeend', `
    <footer class="foot">
      <div class="foot__in">
        <b>Japon 2026</b>
        <span>8 novembre — 3 décembre · Tokyo, Kanazawa, Kyoto, Osaka, Hakone</span>
        <nav>${PAGES.filter((p) => p.href !== current).map((p) => `<a href="${p.href}">${p.label}</a>`).join('')}</nav>
        <small>Fait maison, pour Ilyès &amp; Mathilde. Photos : Wikimedia Commons — voir img/CREDITS.md.</small>
      </div>
    </footer>`);

  document.querySelector('.nav__theme').addEventListener('click', toggleTheme);
  syncThemeButton();

  const burger = document.querySelector('.nav__burger');
  const links = document.querySelector('.nav__links');
  burger.addEventListener('click', () => {
    const open = links.hasAttribute('data-open');
    links.toggleAttribute('data-open', !open);
    burger.setAttribute('aria-expanded', String(!open));
    burger.textContent = open ? '☰' : '✕';
  });
}

/**
 * Apparitions au défilement. Discrètes : 12 px et 0,5 s, pas un carrousel.
 * Rien ne dépend de l'animation — sans JS, tout est déjà visible.
 */
export function initReveal(selector = '.section, .city, .fl, .know__item, .todo__item') {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const els = [...document.querySelectorAll(selector)];
  if (!els.length || !('IntersectionObserver' in window)) return;

  els.forEach((el) => el.classList.add('rv'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('rv--in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  els.forEach((el) => io.observe(el));
}

/**
 * La photo de couverture descend un peu moins vite que la page. Très léger :
 * au-delà, ça donne le mal de mer et ça masque le titre.
 */
export function initCoverParallax() {
  const img = document.querySelector('.cover__img');
  if (!img || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = Math.min(window.scrollY, 900);
      img.style.transform = `translate3d(0, ${y * 0.18}px, 0) scale(1.08)`;
      ticking = false;
    });
  };
  img.style.willChange = 'transform';
  img.style.transform = 'scale(1.08)';
  addEventListener('scroll', onScroll, { passive: true });
}

/** Une barre de lecture le long du liseré d'automne, en haut de page. */
export function initProgressBar() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const bar = document.createElement('div');
  bar.id = 'progress-bar';
  document.body.appendChild(bar);
  let ticking = false;
  const paint = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = h > 0 ? `${Math.min(100, (scrollY / h) * 100)}%` : '0';
      ticking = false;
    });
  };
  addEventListener('scroll', paint, { passive: true });
  paint();
}

/** Visionneuse plein écran. Les photos ne recouvrent jamais du texte : on les ouvre à la demande. */
export function lightbox(images, start = 0, captions = []) {
  let i = start;
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-label', 'Photo en plein écran');
  box.innerHTML = `
    <button class="lightbox__close" aria-label="Fermer">✕</button>
    ${images.length > 1 ? '<button class="lightbox__nav lightbox__nav--prev" aria-label="Photo précédente">‹</button>' : ''}
    ${images.length > 1 ? '<button class="lightbox__nav lightbox__nav--next" aria-label="Photo suivante">›</button>' : ''}
    <figure><img alt=""><figcaption></figcaption></figure>`;

  const img = box.querySelector('img');
  const cap = box.querySelector('figcaption');
  const show = () => {
    img.src = images[i];
    cap.textContent = captions[i] || (images.length > 1 ? `${i + 1} / ${images.length}` : '');
  };
  const move = (d) => { i = (i + d + images.length) % images.length; show(); };

  // Au clavier, Tab sortait de la visionneuse vers la page derrière : on
  // tabulait dans du contenu qu'on ne voit plus. Le fond passe `inert` le temps
  // de l'ouverture, et le focus revient d'où il venait à la fermeture.
  const veniat = document.activeElement;
  const fond = [...document.body.children];
  const close = () => {
    box.remove();
    document.removeEventListener('keydown', onKey);
    fond.forEach((el) => el.removeAttribute('inert'));
    veniat?.focus?.();
  };
  const onKey = (e) => {
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') move(-1);
    if (e.key === 'ArrowRight') move(1);
  };

  box.querySelector('.lightbox__close').addEventListener('click', close);
  box.querySelector('.lightbox__nav--prev')?.addEventListener('click', () => move(-1));
  box.querySelector('.lightbox__nav--next')?.addEventListener('click', () => move(1));
  box.addEventListener('click', (e) => { if (e.target === box) close(); });
  document.addEventListener('keydown', onKey);

  show();
  box.setAttribute('aria-modal', 'true');
  fond.forEach((el) => el.setAttribute('inert', ''));
  document.body.appendChild(box);
  box.querySelector('.lightbox__close').focus();
}

/** Branche la visionneuse sur toutes les images d'un conteneur. */
export function bindLightbox(root, selector = 'img[data-full]') {
  root.addEventListener('click', (e) => {
    const img = e.target.closest(selector);
    if (!img) return;
    e.preventDefault();
    const group = [...root.querySelectorAll(selector)];
    lightbox(group.map((x) => x.dataset.full || x.src), group.indexOf(img),
             group.map((x) => x.alt));
  });
}
