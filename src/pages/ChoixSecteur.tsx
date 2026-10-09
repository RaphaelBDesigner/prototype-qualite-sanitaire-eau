import { useMemo } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { GeoJSON } from "react-leaflet";
import type { Layer, PathOptions } from "leaflet";
import type { Feature, FeatureCollection } from "geojson";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { fr } from "@codegouvfr/react-dsfr";
import { EcranCarte } from "../components/EcranCarte";
import { CarteIgn } from "../components/CarteIgn";
import { CarteSecteur } from "../components/CarteSecteur";
import { LegendeZone } from "../components/LegendeZone";
import { EnConstruction } from "./EnConstruction";
import { emprise, secteursDeLaCommune, type ProprietesSecteur, type Secteur } from "../lib/secteurs";
import { useRetour } from "../lib/useRetour";

const STYLE_ZONE: PathOptions = { className: "carte-ign__zone" };

/** Surface approximative (emprise) d'un secteur, pour l'ordre d'affichage. */
function etendue(secteur: Secteur) {
  const [ouest, sud, est, nord] = emprise([secteur]);
  return (est - ouest) * (nord - sud);
}

export function ChoixSecteur() {
  const { code = "" } = useParams();
  const navigate = useNavigate();
  const retour = useRetour("/carte");
  const donnees = secteursDeLaCommune(code);

  const empriseCarte = useMemo(() => {
    if (!donnees) return undefined;
    const [ouest, sud, est, nord] = emprise(donnees.secteurs);
    return [
      [sud, ouest],
      [nord, est],
    ] as [[number, number], [number, number]];
  }, [donnees]);

  if (!donnees) return <EnConstruction titre="Données non disponibles pour cette commune" />;
  if (donnees.secteurs.length === 1) return <Navigate to={`/secteur/${donnees.secteurs[0].properties.id}`} replace />;
  const { commune, secteurs } = donnees;
  // Les UDI peuvent se chevaucher : les plus étendues sont dessinées d'abord, pour garder les petites cliquables.
  const secteursParTaille = [...secteurs].sort((a, b) => etendue(b) - etendue(a));

  // Clic sur une zone : même destination que la carte du secteur correspondant (alternative clavier : la liste).
  const surChaqueZone = (zone: Feature, couche: Layer) => {
    const { id, nom } = zone.properties as ProprietesSecteur;
    couche.bindTooltip(nom, { sticky: true });
    couche.on("click", () => navigate(`/secteur/${id}`));
  };

  return (
    <EcranCarte
      carte={
        <CarteIgn
          // Nouvelle carte (emprise et zones) à chaque changement de commune.
          key={code}
          className="carte-ign--secteurs"
          sansControles
          emprise={empriseCarte}
          surCarte={
            <>
              <div className="carte-ign__retour">
                <Button
                  iconId="fr-icon-arrow-left-line"
                  priority="tertiary"
                  title="Retour"
                  linkProps={{ to: retour.to, onClick: retour.onClick }}
                />
              </div>
              <LegendeZone />
            </>
          }
        >
          <GeoJSON data={{ type: "FeatureCollection", features: secteursParTaille } as FeatureCollection} style={STYLE_ZONE} onEachFeature={surChaqueZone} />
        </CarteIgn>
      }
      panneau={
        <>
          <Link
            to={retour.to}
            onClick={retour.onClick}
            className={fr.cx("fr-link", "fr-icon-arrow-left-line", "fr-link--icon-left", "fr-mb-3w")}
          >
            Retour
          </Link>
          <h1 className={fr.cx("fr-h5", "fr-mt-3w", "fr-mb-2w")}>{commune}</h1>
          <p>Choisissez votre secteur de distribution.</p>
          {secteurs.map((secteur) => (
            <CarteSecteur key={secteur.properties.id} secteur={secteur} secteurs={secteurs} />
          ))}
        </>
      }
    />
  );
}
