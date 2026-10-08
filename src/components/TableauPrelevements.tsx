import { fr } from "@codegouvfr/react-dsfr";
import { depasse, formaterDate, formaterValeur, type Indicateur } from "../lib/analyses";

type Props = {
  indicateur: Indicateur;
  index: number;
  onSelection: (index: number) => void;
};

/**
 * Tableau DSFR des prélèvements. La ligne du prélèvement affiché porte le style « ligne sélectionnée »
 * natif (aria-selected). Un clic sur la ligne la sélectionne ; au clavier, la date est un bouton.
 */
export function TableauPrelevements({ indicateur, index, onSelection }: Props) {
  return (
    <div className={fr.cx("fr-table", "fr-table--sm", "fr-mb-0")}>
      <div className="fr-table__wrapper">
        <div className="fr-table__container">
          <div className="fr-table__content">
            <table>
              <caption className={fr.cx("fr-sr-only")}>Prélèvements de {indicateur.nom} sur 12 mois</caption>
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Valeur ({indicateur.unite})</th>
                </tr>
              </thead>
              <tbody>
                {indicateur.mesures.map((mesure, i) => (
                  <tr key={mesure.date} aria-selected={i === index} onClick={() => onSelection(i)} className="tableau-prelevements__ligne">
                    <th scope="row">
                      <button
                        type="button"
                        className={fr.cx("fr-link", "fr-text--sm")}
                        aria-pressed={i === index}
                        title={`Afficher le prélèvement du ${formaterDate(mesure.date)}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          onSelection(i);
                        }}
                      >
                        {formaterDate(mesure.date)}
                      </button>
                    </th>
                    <td>
                      {formaterValeur(mesure.valeur)}
                      {depasse(indicateur, mesure) && (
                        <>
                          {" "}
                          <span className={`${fr.cx("fr-icon-warning-fill", "fr-icon--sm")} fr-text-default--warning`} aria-hidden="true" />
                          <span className={fr.cx("fr-sr-only")}> (dépassement de la limite)</span>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
