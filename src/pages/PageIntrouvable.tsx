import { Link } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";

export function PageIntrouvable() {
  return (
    <div className={fr.cx("fr-container", "fr-my-6w")}>
      <h1>Page non trouvée</h1>
      <p className={fr.cx("fr-text--lead", "fr-mb-3w")}>La page que vous cherchez est introuvable.</p>
      <Link to="/" className={fr.cx("fr-btn")}>
        Page d’accueil
      </Link>
    </div>
  );
}
