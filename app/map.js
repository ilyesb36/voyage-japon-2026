// Fabrique de cartes Leaflet.
//
// Fond Esri « World Light Gray Canvas » : sans clé d'API, sans filigrane, et
// son gris neutre laisse ressortir le tracé et les pastilles colorées. Les
// tuiles Carto utilisées auparavant renvoient désormais des images tamponnées
// « API KEY REQUIRED ».
//
// Attention : Esri sert ses tuiles en {z}/{y}/{x}, l'inverse de la convention
// Leaflet. Une inversion ici donne une carte du mauvais hémisphère.

import { CITIES } from '../data/trip.js';

const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas';
const ATTRIB = 'Esri, HERE, Garmin, © OpenStreetMap';

export function createMap(el, opts = {}) {
  const map = L.map(el, {
    zoomControl: opts.zoomControl ?? true,
    scrollWheelZoom: opts.scrollWheelZoom ?? false,
    attributionControl: true,
    ...opts.leaflet,
  });

  // Une carte Leaflet sans vue ne s'affiche PAS du tout, et toute lecture de
  // ses bornes lève « Set map center and zoom first ». Or le cadrage réel
  // dépend de la taille du conteneur, qui vaut parfois 0 au moment de la
  // création. On pose donc d'abord une vue par défaut sur le Japon central :
  // au pire elle est grossière, jamais absente.
  map.setView([35.4, 137.5], 6);

  L.tileLayer(`${ESRI}/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
    { maxZoom: 16, attribution: ATTRIB }).addTo(map);
  L.tileLayer(`${ESRI}/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}`,
    { maxZoom: 16 }).addTo(map);

  // Une carte qui zoome sous le doigt pendant qu'on fait défiler la page est
  // une nuisance. On active la molette seulement après un clic délibéré.
  if (!opts.scrollWheelZoom) {
    map.on('click', () => map.scrollWheelZoom.enable());
    map.on('mouseout', () => map.scrollWheelZoom.disable());
  }

  return map;
}

const cityColor = (cityId) => CITIES[cityId]?.color || '#78766D';

export function stepMarker(step, { onClick } = {}) {
  const m = L.marker(step.ll, {
    icon: L.divIcon({
      className: '',
      html: `<div class="map-pin" style="background:${cityColor(step.cityId)}">${step.n}</div>`,
      iconSize: [26, 26], iconAnchor: [13, 13],
    }),
    title: CITIES[step.cityId].name,
  });
  if (onClick) m.on('click', () => onClick(step));
  return m;
}

export function excursionMarker(exc, { onClick } = {}) {
  const m = L.marker(exc.ll, {
    icon: L.divIcon({
      className: '',
      html: `<div class="map-pin map-pin--exc" style="box-shadow:inset 0 0 0 2px var(--c-exc),0 2px 6px rgb(0 0 0/.25)"></div>`,
      iconSize: [18, 18], iconAnchor: [9, 9],
    }),
    title: exc.name,
  });
  if (onClick) m.on('click', () => onClick(exc));
  return m;
}

/** Un spot du guide : petit point à la couleur de sa ville. */
export function spotMarker(spot, ll) {
  return L.circleMarker(ll, {
    radius: 5, weight: 1.5, color: '#fff',
    fillColor: cityColor(spot.cityId), fillOpacity: 1,
  });
}

/** Le tracé d'un segment, à la couleur de la ville d'arrivée. */
export function routeLine(segment, steps) {
  const from = steps.find((s) => s.id === segment.fromStepId);
  const to = steps.find((s) => s.id === segment.toStepId);
  return L.polyline([from.ll, ...(segment.via || []), to.ll], {
    color: cityColor(to.cityId),
    weight: 2.5, opacity: 0.7, lineCap: 'round',
    dashArray: segment.mode === 'shk' ? null : '2 6',
  });
}

/** Le fil pointillé d'une excursion vers son étape de rattachement. */
export function excursionLine(exc, steps) {
  const from = steps.find((s) => s.id === exc.fromStepId);
  return L.polyline([from.ll, exc.ll], {
    color: '#78766D', weight: 1.5, opacity: 0.55, dashArray: '3 6',
  });
}

/**
 * Cadre la carte sur tous les points.
 *
 * Leaflet calcule le zoom depuis la taille du conteneur. Appelé avant que la
 * mise en page ne soit faite — c'est le cas quand la carte est loin sous la
 * ligne de flottaison — il tombe sur une largeur de 0 et zoome au maximum sur
 * un point arbitraire. On recadre donc dès que le conteneur a une taille.
 */
export function fitAll(map, latlngs, padding = 46) {
  if (!latlngs.length) return;
  const el = map.getContainer();
  const bornes = L.latLngBounds(latlngs);

  const cadrer = () => {
    map.invalidateSize(true);
    map.fitBounds(bornes, { padding: [padding, padding], animate: false });
  };

  // Tant que le conteneur n'a pas de largeur, Leaflet ne peut pas calculer le
  // zoom. On réessaie quelques fois plutôt qu'une seule : sur un téléphone
  // lent, la mise en page arrive après le script. Au pire on garde la vue par
  // défaut posée par createMap, qui montre au moins le Japon.
  let restant = 12;
  const tenter = () => {
    if (el.clientWidth > 0) { cadrer(); return; }
    if (restant-- > 0) requestAnimationFrame(tenter);
  };
  tenter();
  if ('ResizeObserver' in window) new ResizeObserver(() => { if (el.clientWidth > 0) cadrer(); }).observe(el);
  addEventListener('load', tenter);
}
