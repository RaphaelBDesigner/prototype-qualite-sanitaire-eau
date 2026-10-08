import { CallOut } from "@codegouvfr/react-dsfr/CallOut";
import { voletCalcaire } from "./volets";

/** Volet « Calcaire et dureté » : modale DSFR présentée en volet (cf. styles/app.css). */
export function VoletCalcaire() {
  return (
    <voletCalcaire.Component title="Calcaire et dureté" className="volet">
      <p>
        Le calcaire correspond à la présence naturelle de calcium et de magnésium dans l’eau. Sa concentration, appelée
        dureté, varie fortement d’une région à l’autre selon la nature des sols traversés.
      </p>
      <ul>
        <li>Une eau dure n’est pas dangereuse pour la santé : elle apporte même du calcium et du magnésium.</li>
        <li>Elle peut entartrer les appareils électroménagers et les canalisations avec le temps.</li>
        <li>La dureté se mesure en degrés français (°f), au-delà de 30°f, l’eau est considérée comme dure.</li>
      </ul>
      <CallOut title="Bon à savoir" titleAs="h2" colorVariant="blue-ecume">
        Un adoucisseur d’eau n’est pas obligatoire, sauf en cas de dureté très élevée et sur recommandation.
      </CallOut>
    </voletCalcaire.Component>
  );
}
