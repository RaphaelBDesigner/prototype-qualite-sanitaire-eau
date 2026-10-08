import { fr } from "@codegouvfr/react-dsfr";
import { BlocIndicateur } from "./BlocIndicateur";
import { EchelleDurete } from "./EchelleDurete";
import { NoteQualite } from "./NoteQualite";
import type { Parametre } from "../lib/analyses";
import type { StatutSecteur } from "../lib/secteurs";

/** Volet d'un paramètre : bilan annuel (familles), puis un bloc par indicateur suivi. */
export function VoletParametre({ parametre, statut }: { parametre: Parametre; statut: StatutSecteur }) {
  const { bilan } = parametre;
  return (
    <>
      <p className={fr.cx("fr-mb-4w")}>{parametre.description}</p>
      {bilan && (
        <section className="bloc-indicateur fr-p-3w fr-mb-3w" aria-labelledby="bilan-parametre">
          <h2 id="bilan-parametre" className={fr.cx("fr-h6", "fr-mb-1w")}>
            Bilan annuel 2025
          </h2>
          <NoteQualite note={bilan.note} />
          <ul className={fr.cx("fr-raw-list", "fr-text--sm", "fr-mt-2w", "fr-mb-0")}>
            <li>
              Nombre de prélèvements : <strong>{bilan.prelevements}</strong>
            </li>
            <li>
              Conformité : <strong>{bilan.conformite} %</strong>
            </li>
            <li>
              Nombre de substances recherchées : <strong>{bilan.substances}</strong>
            </li>
            <li>
              Limite réglementaire : <strong>{bilan.limite}</strong>
            </li>
            <li>
              Valeur maximale : <strong>{bilan.maximum}</strong>
            </li>
          </ul>
        </section>
      )}
      {parametre.indicateurs.map((indicateur) => (
        <BlocIndicateur
          key={indicateur.id}
          indicateur={indicateur}
          statut={statut}
          titreAs="h2"
          complement={parametre.id === "durete" ? (mesure) => <EchelleDurete valeur={mesure.valeur} /> : undefined}
        />
      ))}
    </>
  );
}
