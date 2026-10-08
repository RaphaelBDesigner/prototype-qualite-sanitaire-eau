import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { fr } from "@codegouvfr/react-dsfr";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { Link } from "react-router-dom";
import { voletCalcaire } from "./volets";

const CLASSES_LIEN = fr.cx("fr-link", "fr-icon-arrow-right-line", "fr-link--icon-right");

function LienArticle({ slug, children }: { slug: string; children: string }) {
  return (
    <li className={fr.cx("fr-mb-2w")}>
      <Link to={`/article/${slug}`} className={CLASSES_LIEN}>
        {children}
      </Link>
    </li>
  );
}

export function FaqAccueil() {
  return (
    <section className={fr.cx("fr-container", "fr-py-6w")} aria-labelledby="titre-faq">
      <h2 id="titre-faq">Questions fréquentes</h2>
      <div className={fr.cx("fr-accordions-group", "fr-mb-4w")}>
        <Accordion label="Eau potable : les sujets qui intéressent" titleAs="h3">
          <ul className={fr.cx("fr-raw-list")}>
            <li className={fr.cx("fr-mb-2w")}>
              <button type="button" className={cx(CLASSES_LIEN, "lien-bouton")} {...voletCalcaire.buttonProps}>
                Calcaire et dureté
              </button>
            </li>
            <LienArticle slug="pfas">PFAS</LienArticle>
            <LienArticle slug="pesticides">Pesticides</LienArticle>
            <LienArticle slug="plomb">Plomb</LienArticle>
          </ul>
        </Accordion>
        <Accordion label="Eau de baignade : les sujets qui intéressent" titleAs="h3">
          <ul className={fr.cx("fr-raw-list")}>
            <LienArticle slug="cyanobacteries">Cyanobactéries</LienArticle>
            <LienArticle slug="bacteries-fecales">Bactéries fécales</LienArticle>
            <LienArticle slug="pollution-apres-la-pluie">Pollution après la pluie</LienArticle>
            <LienArticle slug="algues-vertes">Algues vertes</LienArticle>
          </ul>
        </Accordion>
        <Accordion label="Qui contrôle la qualité de l’eau en France ?" titleAs="h3">
          <p>
            Les Agences Régionales de Santé (ARS) réalisent le contrôle sanitaire réglementaire, en complément de la
            surveillance permanente assurée par l’exploitant du réseau (commune, régie ou opérateur privé),
            conformément au Code de la santé publique et à la réglementation européenne.
          </p>
        </Accordion>
        <Accordion label="Comment vérifier si mon logement est raccordé au réseau public ?" titleAs="h3">
          <p>
            Votre facture d’eau mentionne le service d’eau qui vous dessert. En cas de doute, notamment si vous utilisez
            un puits ou un forage, renseignez-vous auprès de votre mairie.
          </p>
        </Accordion>
        <Accordion label="À quelle fréquence les données sont-elles mises à jour ?" titleAs="h3">
          <p>
            Les résultats sont publiés après chaque prélèvement analysé par l’ARS. La fréquence des prélèvements dépend
            de la taille du réseau : de quelques analyses par an à plusieurs par jour pour les grandes villes.
          </p>
        </Accordion>
      </div>
      <Link to="/faq" className={CLASSES_LIEN}>
        Voir toutes les questions
      </Link>
    </section>
  );
}
