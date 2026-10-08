import { anneaux, emprise, type Secteur } from "../lib/secteurs";

type Props = {
  secteurs: Secteur[];
  idSecteur: string;
};

const LARGEUR = 100;

/** Vignette : tous les secteurs de la commune, celui de la carte mis en évidence (illustration décorative). */
export function MiniCarteSecteur({ secteurs, idSecteur }: Props) {
  const [ouest, sud, est, nord] = emprise(secteurs);
  // Projection équirectangulaire corrigée de la latitude : suffisant à l'échelle d'une agglomération.
  const facteur = Math.cos((((sud + nord) / 2) * Math.PI) / 180);
  const echelle = LARGEUR / ((est - ouest) * facteur);
  const hauteur = (nord - sud) * echelle;
  const chemin = (secteur: Secteur) =>
    anneaux(secteur)
      .map(
        (anneau) =>
          anneau
            .map(([lon, lat], i) => `${i === 0 ? "M" : "L"}${((lon - ouest) * facteur * echelle).toFixed(1)} ${((nord - lat) * echelle).toFixed(1)}`)
            .join(" ") + " Z",
      )
      .join(" ");
  // Les secteurs peuvent se chevaucher : celui de la carte est dessiné en dernier, au premier plan.
  const ordre = [...secteurs].sort((a, b) => Number(a.properties.id === idSecteur) - Number(b.properties.id === idSecteur));

  return (
    <svg className="mini-carte-secteur" viewBox={`-2 -2 ${LARGEUR + 4} ${hauteur + 4}`} aria-hidden="true" focusable="false">
      {ordre.map((secteur) => (
        <path
          key={secteur.properties.id}
          d={chemin(secteur)}
          className={secteur.properties.id === idSecteur ? "mini-carte-secteur__actif" : undefined}
        />
      ))}
    </svg>
  );
}
