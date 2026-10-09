// Prépare src/data/udi.geojson (WGS 84) à partir des exports d'UDI de donnees-sources/.
//
// Le premier export est décalé (Lille tombe vers l'île d'Oléron, Bordeaux en Andalousie) :
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

// Exports complets (WGS 84), un par ville. Une UDI présente dans plusieurs fichiers prend le contour du dernier.
// Le premier export reçu (dgs_metropole_udi_2025_j.json, décalé et découpé) n'est plus utilisé ; la correction
// `decale: true` reste disponible pour un export de ce type.
const SOURCES = [
  { fichier: "udi-bordeaux-2025.json", decale: false },
  { fichier: "udi-lille-2025.json", decale: false },
  { fichier: "udi-lyon-2025.json", decale: false },
];

// Seules les UDI décrites dans src/data/secteurs.json sont gardées (taille du site).
const secteurs = JSON.parse(readFileSync(new URL("../src/data/secteurs.json", import.meta.url), "utf8"));
const codesUtiles = new Set(Object.keys(secteurs.udi));

const parCode = new Map();
for (const { fichier, decale } of SOURCES) {
  const source = JSON.parse(readFileSync(new URL(`../donnees-sources/${fichier}`, import.meta.url), "utf8"));
  const convertir = decale ? corriger : (point) => point.map(arrondi);
  for (const udi of source.features) {
    if (!codesUtiles.has(udi.properties.code_udi)) continue;
    const polygones = udi.geometry.type === "Polygon" ? [udi.geometry.coordinates] : udi.geometry.coordinates;
    parCode.set(udi.properties.code_udi, {
      type: "Feature",
      properties: { code_udi: udi.properties.code_udi },
      geometry: { type: "MultiPolygon", coordinates: polygones.map((polygone) => polygone.map((anneau) => anneau.map(convertir))) },
    });
  }
}

const sortie = { type: "FeatureCollection", features: [...parCode.values()] };
writeFileSync(new URL("../src/data/udi.geojson", import.meta.url), JSON.stringify(sortie));
console.log(`${sortie.features.length} UDI écrites dans src/data/udi.geojson`);
