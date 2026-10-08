import { fr } from "@codegouvfr/react-dsfr";
import { BlocIndicateur } from "./BlocIndicateur";
import { parametre } from "../lib/analyses";
import type { StatutSecteur } from "../lib/secteurs";

/** Volet « Origine de cette restriction / interdiction » : les paramètres en dépassement. */
export function VoletOrigine({ codeUdi, statut }: { codeUdi: string; statut: StatutSecteur }) {
  const pesticides = parametre(codeUdi, "pesticides");
  const mesure = statut === "interdiction" ? "L’interdiction" : "La restriction";
  return (
    <>
      <p>
        {mesure} est liée au dépassement de la limite pour deux paramètres de la famille des <strong>pesticides</strong>.
      </p>
      <p className={fr.cx("fr-mb-4w")}>
        {statut === "interdiction" ? (
          <>
            <strong>Par précaution</strong>, la préfecture a interdit la consommation de l’eau jusqu’au retour de résultats
            conformes.
          </>
        ) : (
          <>
            <strong>Pas de danger immédiat</strong> : la limite réglementaire de 0,1 µg/L inclut une large marge de précaution.
            Par prudence, l’eau est déconseillée aux personnes les plus sensibles.
          </>
        )}
      </p>
      {pesticides?.indicateurs.map((indicateur) => (
        <BlocIndicateur key={indicateur.id} indicateur={indicateur} statut={statut} titreAs="h2" />
      ))}
    </>
  );
}
