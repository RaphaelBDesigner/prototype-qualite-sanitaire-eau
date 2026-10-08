import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { ButtonsGroup } from "@codegouvfr/react-dsfr/ButtonsGroup";
import { fr } from "@codegouvfr/react-dsfr";
import { NoteQualite } from "./NoteQualite";
import { useBoutonVolet } from "../lib/contexteVolets";
import { bilanPrelevements } from "../lib/analyses";

/** Section « Mesure de la qualité de votre eau » : bilan 2025 noté, bilan 2026 en cours. */
export function MesureQualite({ codeUdi }: { codeUdi: string }) {
  const boutonVolet = useBoutonVolet();
  const { conformes, depassements } = bilanPrelevements(codeUdi);
  return (
    <section className={fr.cx("fr-mb-6w")} aria-labelledby="titre-mesure">
      <h2 id="titre-mesure" className={fr.cx("fr-h4")}>
        Mesure de la qualité de votre eau
      </h2>
      <h3 className={fr.cx("fr-text--md", "fr-text--bold", "fr-mb-1w")}>Bilan 2025</h3>
      <NoteQualite note="A" libelle="Eau de bonne qualité" />
      <p className={fr.cx("fr-text--sm")}>6 prélèvements, aucun dépassement</p>
      <hr className={fr.cx("fr-pb-3w")} />
      <h3 className={fr.cx("fr-text--md", "fr-text--bold", "fr-mb-1w")}>
        Bilan 2026{" "}
        <Badge small noIcon as="span">
          En cours
        </Badge>
      </h3>
      <ul className={fr.cx("fr-raw-list", "fr-text--sm", "fr-mb-2w")}>
        <li className="ligne-icone">
          <span className={`${fr.cx("fr-icon-checkbox-circle-fill", "fr-icon--sm")} fr-text-default--info`} aria-hidden="true" />
          <span>
            <strong>{conformes}</strong> prélèvement{conformes > 1 ? "s" : ""} conforme{conformes > 1 ? "s" : ""}
          </span>
        </li>
        {depassements > 0 && (
          <li className="ligne-icone">
            <span className={`${fr.cx("fr-icon-warning-fill", "fr-icon--sm")} fr-text-default--warning`} aria-hidden="true" />
            <span>
              <strong>{depassements}</strong> dépassement{depassements > 1 ? "s" : ""} de limite réglementaire
            </span>
          </li>
        )}
      </ul>
      <p className={`${fr.cx("fr-text--sm")} fr-text-mention--grey`}>
        La note 2026 sera attribuée en cours d’année 2027, une fois tous les prélèvements réalisés et interprétés.
      </p>
      <ButtonsGroup
        buttons={[
          {
            children: "Voir le détail des analyses",
            priority: "secondary",
            iconId: "fr-icon-arrow-right-line",
            iconPosition: "right",
            nativeButtonProps: boutonVolet({ type: "analyses" }, "ouvrir-analyses"),
          },
        ]}
      />
    </section>
  );
}
