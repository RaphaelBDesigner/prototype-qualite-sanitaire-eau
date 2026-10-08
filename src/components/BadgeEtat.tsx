import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { fr } from "@codegouvfr/react-dsfr";
import type { EtatParametre } from "../lib/analyses";

/**
 * Statut d'un paramètre selon le nombre de dépassements sur la période affichée :
 * 0 → Conforme (info), 1 → À surveiller (jaune tournesol, sans icône), 2 ou plus → Dépassement de limite (warning).
 */
export function BadgeEtat({ etat, className, sansIcone }: { etat: EtatParametre; className?: string; sansIcone?: boolean }) {
  switch (etat) {
    case "conforme":
      return (
        <Badge small severity="info" noIcon={sansIcone} as="span" className={className}>
          Conforme
        </Badge>
      );
    case "surveiller":
      return (
        <Badge small noIcon as="span" className={`${fr.cx("fr-badge--yellow-tournesol")}${className ? ` ${className}` : ""}`}>
          À surveiller
        </Badge>
      );
    default:
      return (
        <Badge small severity="warning" noIcon={sansIcone} as="span" className={className}>
          Dépassement de limite
        </Badge>
      );
  }
}
