import { fr } from "@codegouvfr/react-dsfr";
import { RechercheLieu } from "../components/RechercheLieu";
import { ArticlesQualite } from "../components/ArticlesQualite";
import { FaqAccueil } from "../components/FaqAccueil";
import { VoletCalcaire } from "../components/VoletCalcaire";

export function Accueil() {
  return (
    <>
      <section className="accueil-intro">
        <div className={fr.cx("fr-container", "fr-py-6w")}>
          <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters", "fr-grid-row--middle")}>
            <div className={fr.cx("fr-col-12", "fr-col-lg-6")}>
              <h1>Résultats du contrôle sanitaire des eaux</h1>
              <p>
                Accédez aux résultats officiels des contrôles sanitaires pour l’<strong>eau potable</strong> et les{" "}
                <strong>eaux de baignade</strong> des lacs, rivières et plages, en France métropolitaine et dans les
                outre-mer.
              </p>
            </div>
            <div className={fr.cx("fr-col-12", "fr-col-lg-6")}>
              <RechercheLieu />
            </div>
          </div>
        </div>
      </section>
      <ArticlesQualite />
      <FaqAccueil />
      <VoletCalcaire />
    </>
  );
}
