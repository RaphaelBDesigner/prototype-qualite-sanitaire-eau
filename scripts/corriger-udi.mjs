// Corrige l'export des UDI (donnees-sources/dgs_metropole_udi_2025_j.json) et écrit src/data/udi.geojson en WGS 84.
//
// L'export d'origine est décalé (Lille tombe vers l'île d'Oléron, Bordeaux en Andalousie) :
// des coordonnées Web Mercator (EPSG:3857) y ont été déclarées en Lambert 93 (EPSG:2154), puis reprojetées
// en Web Mercator. On inverse cette double conversion : Web Mercator → degrés → Lambert 93 (mètres)
// = coordonnées Web Mercator d'origine → degrés WGS 84.
import { readFileSync, writeFileSync } from "node:fs";

const R = 6378137; // sphère Web Mercator
const versDegres = ([x, y]) => [(x / R) * (180 / Math.PI), Math.atan(Math.sinh(y / R)) * (180 / Math.PI)];

// Lambert 93 (conique conforme sécante, ellipsoïde GRS80).
const a = 6378137;
const f = 1 / 298.257222101;
const e = Math.sqrt(2 * f - f * f);
const rad = (deg) => (deg * Math.PI) / 180;
const m = (p) => Math.cos(p) / Math.sqrt(1 - (e * Math.sin(p)) ** 2);
const t = (p) => Math.tan(Math.PI / 4 - p / 2) / ((1 - e * Math.sin(p)) / (1 + e * Math.sin(p))) ** (e / 2);
const [p1, p2, p0, l0] = [44, 49, 46.5, 3].map(rad);
const n = (Math.log(m(p1)) - Math.log(m(p2))) / (Math.log(t(p1)) - Math.log(t(p2)));
const F = m(p1) / (n * t(p1) ** n);
const rho = (p) => a * F * t(p) ** n;
const rho0 = rho(p0);
const versLambert93 = ([lon, lat]) => {
  const theta = n * (rad(lon) - l0);
  const r = rho(rad(lat));
  return [700000 + r * Math.sin(theta), 6600000 + rho0 - r * Math.cos(theta)];
};

const arrondi = (v) => Math.round(v * 1e5) / 1e5; // ≈ 1 m
const corriger = (point) => versDegres(versLambert93(versDegres(point))).map(arrondi);

const source = JSON.parse(readFileSync(new URL("../donnees-sources/dgs_metropole_udi_2025_j.json", import.meta.url), "utf8"));
const sortie = {
  type: "FeatureCollection",
  features: source.features.map((udi) => ({
    type: "Feature",
    properties: udi.properties,
    geometry: {
      type: "MultiPolygon",
      coordinates: udi.geometry.coordinates.map((polygone) => polygone.map((anneau) => anneau.map(corriger))),
    },
  })),
};
writeFileSync(new URL("../src/data/udi.geojson", import.meta.url), JSON.stringify(sortie));
console.log(`${sortie.features.length} UDI écrites dans src/data/udi.geojson`);
