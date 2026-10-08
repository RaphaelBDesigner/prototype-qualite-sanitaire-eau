import { useId, useState, type ReactNode } from "react";
import { BadgeEtat } from "./BadgeEtat";
import { SegmentedControl } from "@codegouvfr/react-dsfr/SegmentedControl";
import { ButtonsGroup } from "@codegouvfr/react-dsfr/ButtonsGroup";
import { CallOut } from "@codegouvfr/react-dsfr/CallOut";
import { fr } from "@codegouvfr/react-dsfr";
import { QuestionFaq } from "./QuestionFaq";
import { GraphiqueEvolution } from "./GraphiqueEvolution";
import { TableauPrelevements } from "./TableauPrelevements";
import { depasse, etatIndicateur, formaterDate, formaterValeur, type Indicateur, type Mesure } from "../lib/analyses";
import { conclusionPrelevement } from "../lib/conclusions";
import type { StatutSecteur } from "../lib/secteurs";

const LIBELLES_SEUIL = { limite: "Limite réglementaire", reference: "Référence de qualité", indicative: "Valeur indicative" };

type Props = {
  indicateur: Indicateur;
  statut: StatutSecteur;
  /** Contenu affiché avant l'évolution (ex. échelle de dureté), selon le prélèvement affiché. */
  complement?: (mesure: Mesure) => ReactNode;
  titreAs?: "h2" | "h3";
};

/** Bloc d'un indicateur : dernière valeur, puis « Évolution sur 12 mois » (graphique / tableau, prélèvement affiché, conclusion). */
export function BlocIndicateur({ indicateur, statut, complement, titreAs: Titre = "h3" }: Props) {
  const id = useId();
  const { mesures, limite, unite } = indicateur;
  const [index, setIndex] = useState(mesures.length - 1);
  const [vue, setVue] = useState<"graphique" | "tableau">("graphique");
  const derniere = mesures[mesures.length - 1];
  const affichee = mesures[index];

  return (
    <section className="bloc-indicateur fr-p-3w fr-mb-3w" aria-labelledby={`${id}-titre`}>
      <Titre id={`${id}-titre`} className={fr.cx("fr-h6", "fr-mb-0")}>
        {indicateur.nom}
      </Titre>
      <p className={`${fr.cx("fr-text--sm", "fr-mb-2w")} fr-text-mention--grey`}>
        {limite === undefined ? "Pas de limite réglementaire" : `${LIBELLES_SEUIL[indicateur.seuil ?? "limite"]} : ≤ ${formaterValeur(limite)} ${unite}`}
      </p>
      <p className={fr.cx("fr-text--lg", "fr-text--bold", "fr-mb-1w")}>
        {formaterValeur(derniere.valeur)} {unite}{" "}
        <BadgeEtat etat={etatIndicateur(indicateur)} className={fr.cx("fr-ml-1w")} />
      </p>
      <p className={`${fr.cx("fr-text--sm", "fr-mb-2w")} fr-text-mention--grey`}>Dernier prélèvement du {formaterDate(derniere.date)}</p>
      <p>{indicateur.description}</p>
      {complement?.(affichee)}
      <div className={fr.cx("fr-accordions-group")}>
        <QuestionFaq label="Évolution sur 12 mois" titleAs="h4">
          <SegmentedControl
            hideLegend
            legend={`Affichage de l’évolution de ${indicateur.nom}`}
            name={`${id}-vue`}
            className={`segmented-pleine-largeur ${fr.cx("fr-mb-3w")}`}
            segments={[
              { label: "Graphique", nativeInputProps: { checked: vue === "graphique", onChange: () => setVue("graphique") } },
              { label: "Tableau", nativeInputProps: { checked: vue === "tableau", onChange: () => setVue("tableau") } },
            ]}
          />
          {vue === "graphique" ? (
            <GraphiqueEvolution indicateur={indicateur} index={index} />
          ) : (
            <TableauPrelevements indicateur={indicateur} index={index} onSelection={setIndex} />
          )}
          <ButtonsGroup
            className={fr.cx("fr-mt-3w")}
            inlineLayoutWhen="always"
            buttons={[
              {
                children: "Précédent",
                priority: "secondary",
                iconId: "fr-icon-arrow-left-line",
                disabled: index === 0,
                onClick: () => setIndex((i) => i - 1),
                title: "Afficher le prélèvement précédent",
              },
              {
                children: "Suivant",
                priority: "secondary",
                iconId: "fr-icon-arrow-right-line",
                iconPosition: "right",
                disabled: index === mesures.length - 1,
                onClick: () => setIndex((i) => i + 1),
                title: "Afficher le prélèvement suivant",
              },
            ]}
          />
          <div aria-live="polite">
            <CallOut
              title={`Conclusion sanitaire du ${formaterDate(affichee.date)}`}
              titleAs="h5"
              colorVariant="blue-ecume"
              bodyAs="div"
              classes={{ title: fr.cx("fr-text--lg") }}
            >
              {conclusionPrelevement(depasse(indicateur, affichee), statut).map((phrase) => (
                <p key={phrase} className={fr.cx("fr-text--sm", "fr-mb-1w")}>
                  {phrase}
                </p>
              ))}
            </CallOut>
          </div>
        </QuestionFaq>
      </div>
    </section>
  );
}
