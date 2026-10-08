import { useMemo } from "react";
import { GeoJSON } from "react-leaflet";
import type { FeatureCollection } from "geojson";
import { fr } from "@codegouvfr/react-dsfr";
import { CarteIgn } from "./CarteIgn";
import { LegendeZone } from "./LegendeZone";
import { emprise, type Secteur } from "../lib/secteurs";
import type { InfosCommune } from "../lib/communes";

type Props = { secteur: Secteur; infos: InfosCommune };

/** Section « Votre secteur » : carte du réseau, puis les étapes de l'eau jusqu'au robinet. */
export function VotreSecteur({ secteur, infos }: Props) {
  const empriseCarte = useMemo(() => {
    const [ouest, sud, est, nord] = emprise([secteur]);
    return [
      [sud, ouest],
      [nord, est],
    ] as [[number, number], [number, number]];
  }, [secteur]);

  return (
    <section className={fr.cx("fr-mb-6w")} aria-labelledby="titre-secteur">
      <h2 id="titre-secteur" className={fr.cx("fr-h4")}>
        Votre secteur
      </h2>
      <div className="carte-fiche">
        <CarteIgn key={secteur.properties.id} emprise={empriseCarte} sansControles className="carte-ign--fiche">
          <GeoJSON data={{ type: "FeatureCollection", features: [secteur] } as FeatureCollection} style={{ className: "carte-ign__zone" }} />
        </CarteIgn>
      </div>
      <LegendeZone horsCarte texte="Zone = réseau de distribution d’eau" />
      <ol className="etapes-eau fr-mt-3w">
        <li>
          <p className={`${fr.cx("fr-text--sm", "fr-mb-0")} fr-text-mention--grey`}>Origine de l’eau (captage)</p>
          <p className={fr.cx("fr-text--bold")}>{infos.captage}</p>
        </li>
        <li>
          <p className={`${fr.cx("fr-text--sm", "fr-mb-0")} fr-text-mention--grey`}>Traitement appliqué</p>
          <p className={fr.cx("fr-text--bold", "fr-mb-1w")}>{infos.traitement.nom}</p>
          <p className={fr.cx("fr-text--sm")}>{infos.traitement.description}</p>
        </li>
        <li>
          <p className={`${fr.cx("fr-text--sm", "fr-mb-0")} fr-text-mention--grey`}>Distribution</p>
          <p className={fr.cx("fr-text--sm", "fr-mb-0")}>Maîtrise d’ouvrage / exploitant</p>
          <p className={fr.cx("fr-text--bold", "fr-mb-1w")}>{infos.exploitant}</p>
          <p className={fr.cx("fr-text--sm", "fr-mb-0")}>Gestionnaire distribution</p>
          <p>
            <a className={fr.cx("fr-link")} href={infos.gestionnaire.url} target="_blank" rel="noopener noreferrer" title={`${infos.gestionnaire.nom} - nouvelle fenêtre`}>
              {infos.gestionnaire.nom}
            </a>
          </p>
        </li>
        <li>
          <p className={`${fr.cx("fr-text--sm", "fr-mb-0")} fr-text-mention--grey`}>Votre robinet</p>
          <p className={fr.cx("fr-text--bold", "fr-mb-0")}>≈ {infos.habitantsParSecteur.toLocaleString("fr-FR")} habitants desservis</p>
        </li>
      </ol>
    </section>
  );
}
