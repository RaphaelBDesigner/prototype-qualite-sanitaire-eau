import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Link } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";

export function EnConstruction({ titre }: { titre: string }) {
  return (
    <div className={fr.cx("fr-container", "fr-my-6w")}>
      <h1>{titre}</h1>
      <Alert
        severity="info"
        title="Page en construction"
        description="Cette page n’est pas encore disponible dans ce prototype."
        className={fr.cx("fr-mb-4w")}
      />
      <Link to="/" className={fr.cx("fr-link", "fr-icon-arrow-left-line", "fr-link--icon-left")}>
        Retour à l’accueil
      </Link>
    </div>
  );
}
