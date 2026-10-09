import { useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { fr } from "@codegouvfr/react-dsfr";
import { EcranCarte } from "../components/EcranCarte";
import { CarteIgn } from "../components/CarteIgn";
import { CarteSecteur } from "../components/CarteSecteur";
import { LegendeZone } from "../components/LegendeZone";
import { ZonesSecteurs } from "../components/ZonesSecteurs";
import { EnConstruction } from "./EnConstruction";
import { emprise, secteursDeLaCommune } from "../lib/secteurs";
import { useRetour } from "../lib/useRetour";

export function ChoixSecteur() {
  const { code = "" } = useParams();
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
          <ZonesSecteurs secteurs={secteurs} />
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
