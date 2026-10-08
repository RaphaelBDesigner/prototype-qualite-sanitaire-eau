import type { Feature, FeatureCollection, Polygon } from "geojson";
import donnees from "../data/secteurs-lille.geojson?raw";

export type StatutSecteur = "interdiction" | "restriction" | "aucune";

export type ProprietesSecteur = {
  id: string;
  nom: string;
  communes: string[];
  /** Précision affichée après la commune (ex. quartiers desservis). */
  precision?: string;
  statut: StatutSecteur;
};

export type Secteur = Feature<Polygon, ProprietesSecteur>;

type CollectionSecteurs = FeatureCollection<Polygon, ProprietesSecteur> & {
  metadata: { commune: string; codeInsee: string };
};

const lille = JSON.parse(donnees) as CollectionSecteurs;

/** Communes desservies par plusieurs secteurs (UDI), indexées par code INSEE. */
const SECTEURS_PAR_COMMUNE: Record<string, CollectionSecteurs> = {
  [lille.metadata.codeInsee]: lille,
};

export function secteursDeLaCommune(codeInsee: string) {
  const collection = SECTEURS_PAR_COMMUNE[codeInsee];
  return collection ? { commune: collection.metadata.commune, secteurs: collection.features } : undefined;
}

/** Emprise [ouest, sud, est, nord] d'une liste de secteurs. */
export function emprise(secteurs: Secteur[]): [number, number, number, number] {
  const points = secteurs.flatMap((secteur) => secteur.geometry.coordinates[0]);
  const lons = points.map(([lon]) => lon);
  const lats = points.map(([, lat]) => lat);
  return [Math.min(...lons), Math.min(...lats), Math.max(...lons), Math.max(...lats)];
}

/** Code INSEE de la commune du prototype dont les secteurs contiennent ce point, si elle existe. */
export function communeContenant(lat: number, lon: number): string | undefined {
  for (const [code, collection] of Object.entries(SECTEURS_PAR_COMMUNE)) {
    if (collection.features.some((secteur) => contientPoint(secteur.geometry.coordinates[0], lon, lat))) return code;
  }
  return undefined;
}

/** Test point dans polygone (lancer de rayon). */
function contientPoint(anneau: number[][], x: number, y: number) {
  let dedans = false;
  for (let i = 0, j = anneau.length - 1; i < anneau.length; j = i++) {
    const [xi, yi] = anneau[i];
    const [xj, yj] = anneau[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) dedans = !dedans;
  }
  return dedans;
}
