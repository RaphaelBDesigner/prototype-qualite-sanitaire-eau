import type { Secteur } from "../lib/secteurs";
import { emprise } from "../lib/secteurs";

type Props = {
  secteurs: Secteur[];
  idSecteur: string;
};

const LARGEUR = 100;

/** Vignette : tous les secteurs de la commune, celui de la carte mis en évidence (illustration décorative). */
export function MiniCarteSecteur({ secteurs, idSecteur }: Props) {
  const [ouest, sud, est, nord] = emprise(secteurs);
  // Projection équirectangulaire corrigée de la latitude : suffisant à l'échelle d'une commune.
  const facteur = Math.cos((((sud + nord) / 2) * Math.PI) / 180);
  const echelle = LARGEUR / ((est - ouest) * facteur);
  const hauteur = (nord - sud) * echelle;
  const chemin = (secteur: Secteur) =>
    secteur.geometry.coordinates[0]
      .map(([lon, lat], i) => `${i === 0 ? "M" : "L"}${((lon - ouest) * facteur * echelle).toFixed(1)} ${((nord - lat) * echelle).toFixed(1)}`)
      .join(" ") + " Z";

  return (
    <svg className="mini-carte-secteur" viewBox={`-2 -2 ${LARGEUR + 4} ${hauteur + 4}`} aria-hidden="true" focusable="false">
      {secteurs.map((secteur) => (
        <path
          key={secteur.properties.id}
          d={chemin(secteur)}
          className={secteur.properties.id === idSecteur ? "mini-carte-secteur__actif" : undefined}
        />
      ))}
    </svg>
  );
}
