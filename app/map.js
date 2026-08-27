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

export function fitAll(map, latlngs, padding = 46) {
  if (latlngs.length) map.fitBounds(L.latLngBounds(latlngs), { padding: [padding, padding] });
}
