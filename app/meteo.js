// Météo en direct des cinq villes.
//
// Open-Meteo : pas de clé, CORS ouvert, une seule requête pour les cinq
// coordonnées. Le hors-ligne étant une contrainte du site, le dernier relevé
// est gardé en localStorage et les normales de saison servent de plancher :
// la page affiche toujours quelque chose, même sans réseau.
//
// Un mot sur ce qu'on affiche : à plus de deux semaines du départ, aucune
// prévision n'existe. Ce qu'on montre alors, c'est le temps qu'il fait
// LÀ-BAS EN CE MOMENT — ça ne sert à rien pour la valise, mais ça donne le
// contact. Les normales de saison, elles, servent à faire les bagages.

import { CITIES, STEPS } from '../data/trip.js';
import { METEO } from '../data/pratique.js';

const CACHE_KEY = 'jp2026_meteo';
const MAX_AGE = 30 * 60 * 1000; // une demi-heure

// Codes WMO → ce qu'on en dit, en français.
const WMO = {
  0: ['Ciel dégagé', '☀'],
  1: ['Plutôt dégagé', '🌤'], 2: ['Nuages épars', '⛅'], 3: ['Couvert', '☁'],
  45: ['Brouillard', '🌫'], 48: ['Brouillard givrant', '🌫'],
  51: ['Bruine légère', '🌦'], 53: ['Bruine', '🌦'], 55: ['Bruine dense', '🌦'],
  61: ['Pluie faible', '🌧'], 63: ['Pluie', '🌧'], 65: ['Forte pluie', '🌧'],
  66: ['Pluie verglaçante', '🌧'], 67: ['Pluie verglaçante', '🌧'],
  71: ['Neige faible', '🌨'], 73: ['Neige', '🌨'], 75: ['Fortes chutes', '🌨'],
  77: ['Grésil', '🌨'],
  80: ['Averses', '🌦'], 81: ['Averses', '🌦'], 82: ['Fortes averses', '⛈'],
  85: ['Averses de neige', '🌨'], 86: ['Averses de neige', '🌨'],
  95: ['Orage', '⛈'], 96: ['Orage grêleux', '⛈'], 99: ['Orage grêleux', '⛈'],
};

/** Une ville par étape, sans doublon — Tokyo n'apparaît qu'une fois. */
export function meteoCities() {
  const seen = new Set();
  return STEPS.filter((s) => !seen.has(s.cityId) && seen.add(s.cityId))
    .map((s) => ({ cityId: s.cityId, ...CITIES[s.cityId], ll: s.ll }));
}

function readCache() {
  try {
    const raw = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (raw && Date.now() - raw.at < MAX_AGE) return raw;
    return raw; // périmé, mais toujours mieux que rien hors-ligne
  } catch { return null; }
}

/**
 * Renvoie { at, fresh, cities: { cityId: { temp, code, label, icon } } }
 * ou null si on n'a jamais rien pu récupérer.
 */
export async function fetchMeteo() {
  const cities = meteoCities();
  const cached = readCache();
  if (cached && Date.now() - cached.at < MAX_AGE) return { ...cached, fresh: true };

  // On demande aussi les 7 jours de prévision : sur place, ce qui décide de la
  // journée n'est pas la température de l'instant mais l'amplitude et la pluie.
  const url = 'https://api.open-meteo.com/v1/forecast?' + new URLSearchParams({
    latitude: cities.map((c) => c.ll[0]).join(','),
    longitude: cities.map((c) => c.ll[1]).join(','),
    current: 'temperature_2m,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunset',
    forecast_days: '7',
    timezone: 'Asia/Tokyo',
  });

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    // Une seule ville renvoie un objet, plusieurs renvoient un tableau.
    const rows = Array.isArray(json) ? json : [json];

    const out = {};
    rows.forEach((row, i) => {
      const c = cities[i];
      if (!c || !row.current) return;
      const code = row.current.weather_code;
      const [label, icon] = WMO[code] || ['—', '·'];

      // Les prévisions, indexées par date : la page du jour n'a plus qu'à
      // demander la sienne.
      const jours = {};
      const d = row.daily;
      if (d?.time) {
        d.time.forEach((date, k) => {
          const cd = d.weather_code?.[k];
          const [lab, ic] = WMO[cd] || ['—', '·'];
          jours[date] = {
            code: cd, label: lab, icon: ic,
            max: Math.round(d.temperature_2m_max?.[k]),
            min: Math.round(d.temperature_2m_min?.[k]),
            pluie: d.precipitation_probability_max?.[k] ?? null,
            coucher: d.sunset?.[k]?.slice(11, 16) || null,
          };
        });
      }

      out[c.cityId] = { temp: Math.round(row.current.temperature_2m), code, label, icon, jours };
    });

    const payload = { at: Date.now(), cities: out };
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(payload)); } catch {}
    return { ...payload, fresh: true };
  } catch {
    return cached ? { ...cached, fresh: false } : null;
  }
}

/** L'heure qu'il est au Japon, pour situer le relevé. */
export function heureJapon() {
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tokyo',
  }).format(new Date());
}

export function normale(cityId) {
  return METEO[cityId];
}

/**
 * La météo d'une journée précise, pour une ville.
 *
 * Renvoie `{ source: 'prevision' | 'normale', ... }` : au-delà de la fenêtre
 * de prévision (7 jours), il n'existe aucune prévision — on rend alors les
 * normales de saison, et on le dit. Annoncer une prévision qu'on n'a pas
 * serait pire que ne rien annoncer : on ferait la valise dessus.
 */
export async function meteoDuJour(cityId, date) {
  const normales = METEO[cityId];
  const data = await fetchMeteo();
  const prev = data?.cities?.[cityId]?.jours?.[date];
  if (prev && Number.isFinite(prev.max)) {
    return { source: 'prevision', fresh: !!data.fresh, ...prev };
  }
  return {
    source: 'normale', fresh: false,
    max: normales?.max, min: normales?.min,
    label: normales?.note, icon: '·', pluie: null, coucher: null,
  };
}
