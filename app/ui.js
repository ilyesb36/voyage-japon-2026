// Chrome de page et petits composants partagés par toutes les pages.
import { TRIP } from '../data/trip.js';

/**
 * Le moment du voyage : avant, pendant, après.
 *
 * Le site a trois vies et la même barre servait aux trois. Avant, on prépare :
 * échéances, budget, programme. Pendant, téléphone en main, on veut la journée,
 * ce qu'il y a autour, où manger, comment bouger, les urgences. Après, c'est un
 * souvenir. La barre change d'ordre et de libellés selon le moment, et cache ce
 * qui ne sert plus. Rien n'est supprimé : toutes les pages restent atteignables
 * par leur adresse.
 *
 * Les bornes sont celles du séjour au Japon (TRIP.japon), pas du voyage :
 * « avant » va jusqu'au 8 novembre inclus, le jour du vol ; « pendant » va du
 * 9 novembre au 2 décembre ; « après » commence le 3 décembre.
 */
export function moment() {
  const t = today();
  // Le jour du vol (8 nov.) est encore « avant » : on part le soir de Paris, on veut la liste.
  if (t < TRIP.japon.du) return 'avant';
  if (t <= TRIP.japon.au) return 'pendant';
  return 'apres';
}

const PAGES_PAR_MOMENT = {
  // Avant : préparer. Une entrée par besoin, cinq en tout.
  avant: [
    { href: 'aujourdhui.html', label: 'À faire' },
    { href: 'itineraire.html', label: 'Le programme' },
    { href: 'villes.html',     label: 'Les villes' },
    { href: 'activites.html',  label: 'Activités' },
    { href: 'transports.html', label: 'Transports' },
  ],
  // Pendant : téléphone en main. La journée, ce qu'il y a autour, où manger,
  // comment bouger, les urgences.
  pendant: [
    { href: 'jour.html',       label: "Aujourd'hui" },
    { href: 'villes.html',     label: 'Autour de moi' },
    { href: 'activites.html',  label: 'Activités' },
    { href: 'table.html',      label: 'À table' },
    { href: 'transports.html', label: 'Transports' },
    { href: 'secours.html',    label: 'Secours' },
  ],
  apres: [
    { href: 'index.html',      label: 'Le voyage' },
    { href: 'itineraire.html', label: 'Le programme' },
  ],
};
const PAGES = PAGES_PAR_MOMENT[moment()];
// Une page hors menu allume son parent.
const PARENT = {
  'passes.html': 'transports.html', 'valises.html': 'transports.html',
  'jour.html': 'itineraire.html', 'aujourdhui.html': 'jour.html',
  'pratique.html': 'secours.html', 'secours.html': 'aujourdhui.html',
  'table.html': 'villes.html',
};
// Toujours joignables, par le pied de page.
const PIED_EXTRA = [
  { href: 'index.html',      label: 'Le voyage' },
  { href: 'aujourdhui.html', label: 'À faire' },
  { href: 'secours.html',    label: 'Secours' },
  // Hors du menu du haut (à la demande d'Ilyès), mais toujours joignable ici.
  { href: 'budget.html',     label: 'Le budget' },
];

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

// Intl sépare les milliers par une espace fine (U+202F) : à 12 px de corps, elle ne fait que
// 1,7 px et « 1 584 € » se lit « 1584 € ». On met une vraie espace insécable.
export const eur = (n) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
    .format(n).replace(/\u202f/g, '\u00a0');

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
  // Le service worker rend le site utilisable sans réseau : toutes les pages
  // l'installent d'ici, et d'ici seulement, la première ouverte suffit. (La page À
  // faire l'enregistre aussi, pour brancher son bouton : deux fois, c'est sans effet.)
  // Là où il est interdit (iframe en bac à sable, cookies bloqués), c'est LIRE
  // navigator.serviceWorker qui lève, tout de suite : sans ce try, la barre ne serait
  // jamais posée et la page perdrait tout son contenu.
  try {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  } catch { /* service worker interdit ici : le site marche sans */ }

  const away = daysBetween(today(), TRIP.start);
  const counter = away > 0 ? `J−${away}`
                : away === 0 ? "C'est aujourd'hui"
                : daysBetween(today(), TRIP.end) >= 0 ? 'En voyage'
                : 'Souvenirs';
  // Seul « J−24 » est un vrai compte à rebours. Les autres libellés disent où l'on
  // en est, et s'effacent sur un petit téléphone pour laisser la place à la loupe.
  const classeCompteur = away > 0 ? 'nav__count' : 'nav__count nav__count--etat';

  // La page à allumer dans le menu : la page elle-même, ou son parent si elle n'y est pas.
  const actif = PAGES.some((x) => x.href === current) ? current : PARENT[current];
  // La loupe n'est pas une entrée du menu : elle est là à tous les moments et
  // ouvre la recherche du guide, curseur dedans.
  const loupe = `<a class="nav__search" href="guide.html?chercher" aria-label="Chercher dans tout le site"${current === 'guide.html' ? ' aria-current="page"' : ''}>
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 20l-4.2-4.2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></a>`;
  // Le pied de page reprend le menu, plus ce qui doit rester joignable partout.
  const pied = [...PAGES, ...PIED_EXTRA.filter((x) => !PAGES.some((p) => p.href === x.href))];
  // Pendant le voyage, index.html ouvre Aujourd'hui : « Le voyage » y va avec ?accueil,
  // sinon l'accueil ne serait plus joignable. (Le logo, lui, mène volontairement à Aujourd'hui.)
  const lienPied = (href) => (href === 'index.html' && moment() === 'pendant' ? 'index.html?accueil' : href);

  document.body.insertAdjacentHTML('afterbegin', `
    <nav class="nav">
      <div class="nav__in">
        <a class="nav__brand" href="index.html">Japon 2026</a>
        <button class="nav__burger" aria-label="Ouvrir le menu" aria-expanded="false">☰</button>
        <div class="nav__links">
          ${PAGES.map((p) => `<a href="${p.href}"${p.href === actif ? ' aria-current="page"' : ''}>${p.label}</a>`).join('')}
        </div>
        ${loupe}
        <span class="${classeCompteur}">${counter}</span>
        <button class="nav__theme" type="button"></button>
      </div>
    </nav>`);

  document.body.insertAdjacentHTML('beforeend', `
    <footer class="foot">
      <div class="foot__in">
        <b>Japon 2026</b>
        <span>8 novembre — 3 décembre · Tokyo, Kanazawa, Kyoto, Osaka, Hakone</span>
        <nav>${pied.filter((p) => p.href !== current).map((p) => `<a href="${lienPied(p.href)}">${p.label}</a>`).join('')}</nav>
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
  // Les apparitions ne servent qu'à l'accueil, qui se lit comme un magazine.
  // Ailleurs on vient chercher une info : elle doit être là tout de suite.
  if (!/\/(index\.html)?$/.test(location.pathname)) return;
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
