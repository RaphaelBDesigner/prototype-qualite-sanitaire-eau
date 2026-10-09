import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { GeoJSON } from "react-leaflet";
import type { Layer, PathOptions } from "leaflet";
import type { Feature, FeatureCollection } from "geojson";
import { emprise, type ProprietesSecteur, type Secteur } from "../lib/secteurs";

const STYLE_ZONE: PathOptions = { className: "carte-ign__zone" };

/** Surface approximative (emprise) d'un secteur, pour l'ordre d'affichage. */
function etendue(secteur: Secteur) {
  const [ouest, sud, est, nord] = emprise([secteur]);
  return (est - ouest) * (nord - sud);
}

/**
 * Zones des secteurs de distribution sur la carte : nom au survol, clic vers la fiche du secteur
 * (alternative accessible : recherche et listes de secteurs). Les UDI peuvent se chevaucher :
 * les plus étendues sont dessinées d'abord, pour garder les petites cliquables.
 */
export function ZonesSecteurs({ secteurs }: { secteurs: Secteur[] }) {
  const navigate = useNavigate();
  const donnees = useMemo(
    () => ({ type: "FeatureCollection", features: [...secteurs].sort((a, b) => etendue(b) - etendue(a)) }) as FeatureCollection,
    [secteurs],
  );
  const surChaqueZone = (zone: Feature, couche: Layer) => {
    const { id, nom } = zone.properties as ProprietesSecteur;
    couche.bindTooltip(nom, { sticky: true });
    couche.on("click", () => navigate(`/secteur/${id}`));
  };
  return <GeoJSON data={donnees} style={STYLE_ZONE} onEachFeature={surChaqueZone} />;
}
