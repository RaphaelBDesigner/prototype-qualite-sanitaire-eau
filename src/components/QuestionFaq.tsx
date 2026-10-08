import type { ReactNode } from "react";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { fr } from "@codegouvfr/react-dsfr";

/**
 * Accordéon DSFR des FAQ (accueil, fiche du secteur). Le DSFR 1.14 ne décale le contenu (conteneur fr-collapse) qu'à partir
 * de la tablette, avec une marge négative de 0.25rem : les utilitaires fr-px-2w et fr-mx-0 appliquent
 * le même retrait (1rem) à toutes les tailles d’écran,
 * pour aligner tout le contenu sur le texte du titre.
 */
export function QuestionFaq({ label, children, titleAs = "h3" }: { label: string; children: NonNullable<ReactNode>; titleAs?: "h3" | "h4" }) {
  return (
    <Accordion label={label} titleAs={titleAs} classes={{ collapse: fr.cx("fr-px-2w", "fr-mx-0") }}>
      {children}
    </Accordion>
  );
}
