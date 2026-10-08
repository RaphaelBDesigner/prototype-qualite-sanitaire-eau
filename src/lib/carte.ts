/** Fonds et couches de la Géoplateforme IGN (WMTS, sans clé). */

export type FondCarte = "plan" | "photos";

function urlWmts(couche: string, format: "image/png" | "image/jpeg") {
  return (
    "https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0" +
    `&LAYER=${couche}&STYLE=normal&TILEMATRIXSET=PM&FORMAT=${format}` +
    "&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}"
  );
}

export const FONDS: Record<FondCarte, { libelle: string; url: string }> = {
  plan: { libelle: "Par défaut", url: urlWmts("GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2", "image/png") },
  photos: { libelle: "Photographies aériennes", url: urlWmts("ORTHOIMAGERY.ORTHOPHOTOS", "image/jpeg") },
};

export const URL_LIMITES_ADMINISTRATIVES = urlWmts("LIMITES_ADMINISTRATIVES_EXPRESS.LATEST", "image/png");

export const ATTRIBUTION_IGN = "© IGN / Géoplateforme";

/** Une tuile précise (Lille, zoom 12) pour les vignettes du sélecteur de fond. */
export function urlVignette(fond: FondCarte) {
  return FONDS[fond].url.replace("{z}", "12").replace("{x}", "2082").replace("{y}", "1377");
}

/** Vue initiale : France métropolitaine. */
export const VUE_FRANCE = { centre: [46.6, 2.4] as [number, number], zoom: 5 };
