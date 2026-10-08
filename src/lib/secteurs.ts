import type { Feature, FeatureCollection, MultiPolygon, Position } from "geojson";
import contours from "../data/udi.geojson?raw";
import descriptions from "../data/secteurs.json";

export type StatutSecteur = "interdiction" | "restriction" | "aucune";

export type ProprietesSecteur = {
  /** Code de l'unité de distribution (UDI). */
  id: string;
  nom: string;
  communes: string[];
  /** Précision affichée après les communes (quartiers desservis…), ou seule si aucune commune n'est connue. */
  precision?: string;
  statut: StatutSecteur;
};

export type Secteur = Feature<MultiPolygon, ProprietesSecteur>;

type Description = Omit<ProprietesSecteur, "id">;

const udi = JSON.parse(contours) as FeatureCollection<MultiPolygon, { code_udi: string }>;
const descriptionsUdi = descriptions.udi as Record<string, Description>;

const SECTEURS: Record<string, Secteur> = Object.fromEntries(
  udi.features
    .filter(({ properties }) => properties.code_udi in descriptionsUdi)
    .map(({ geometry, properties: { code_udi } }) => [
      code_udi,
      { type: "Feature", geometry, properties: { id: code_udi, ...descriptionsUdi[code_udi] } } satisfies Secteur,
    ]),
);

const COMMUNES = descriptions.communes as Record<string, { nom: string; udi: string[] }>;

/** Codes INSEE des communes disposant de données dans le prototype. */
export const COMMUNES_AVEC_DONNEES = Object.keys(COMMUNES);

/** Noms des communes du prototype, pour les messages (« Essayez avec Lille, Bordeaux ou Lyon »). */
export const NOMS_COMMUNES_AVEC_DONNEES = Object.values(COMMUNES)
  .map(({ nom }) => nom)
  .join(", ")
  .replace(/, ([^,]*)$/, " ou $1");

export function secteursDeLaCommune(codeInsee: string) {
  const commune = COMMUNES[codeInsee];
  if (!commune) return undefined;
  return { commune: commune.nom, secteurs: commune.udi.map((code) => SECTEURS[code]).filter(Boolean) };
}

/** Anneaux extérieurs de tous les polygones d'un secteur. */
export function anneaux(secteur: Secteur): Position[][] {
  return secteur.geometry.coordinates.map((polygone) => polygone[0]);
}

/** Emprise [ouest, sud, est, nord] d'une liste de secteurs. */
export function emprise(secteurs: Secteur[]): [number, number, number, number] {
  const points = secteurs.flatMap((secteur) => anneaux(secteur).flat());
  const lons = points.map(([lon]) => lon);
  const lats = points.map(([, lat]) => lat);
  return [Math.min(...lons), Math.min(...lats), Math.max(...lons), Math.max(...lats)];
}

/** Code INSEE de la commune du prototype dont un secteur contient ce point, si elle existe. */
export function communeContenant(lat: number, lon: number): string | undefined {
  return Object.entries(COMMUNES).find(([, { udi: codes }]) =>
    codes.some((code) => SECTEURS[code] && anneaux(SECTEURS[code]).some((anneau) => contientPoint(anneau, lon, lat))),
  )?.[0];
}

/** Test point dans polygone (lancer de rayon). */
function contientPoint(anneau: Position[], x: number, y: number) {
  let dedans = false;
  for (let i = 0, j = anneau.length - 1; i < anneau.length; j = i++) {
    const [xi, yi] = anneau[i];
    const [xj, yj] = anneau[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) dedans = !dedans;
  }
  return dedans;
}

/** Un secteur et sa commune de rattachement, à partir du code UDI. */
export function secteurParCode(code: string) {
  const secteur = SECTEURS[code];
  const entree = Object.entries(COMMUNES).find(([, { udi: codes }]) => codes.includes(code));
  if (!secteur || !entree) return undefined;
  const [codeCommune, { nom: commune }] = entree;
  return { secteur, codeCommune, commune };
}
