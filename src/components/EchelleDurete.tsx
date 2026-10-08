import { fr } from "@codegouvfr/react-dsfr";
import { ECHELLE_DURETE, formaterValeur } from "../lib/analyses";

/** Échelle de dureté : tableau DSFR, la ligne de la valeur affichée est mise en évidence (style « ligne sélectionnée »). */
export function EchelleDurete({ valeur }: { valeur: number }) {
  const actif = ECHELLE_DURETE.findIndex((niveau) => valeur < niveau.max);
  return (
    <div className={fr.cx("fr-mb-3w")}>
      <h4 className={fr.cx("fr-text--md", "fr-text--bold", "fr-mb-1w")}>Échelle de dureté</h4>
      <div className={fr.cx("fr-table", "fr-table--sm", "fr-table--no-caption", "fr-mb-0")}>
        <div className="fr-table__wrapper">
          <div className="fr-table__container">
            <div className="fr-table__content">
              <table>
                <caption>Échelle de dureté de l’eau, en degrés français</caption>
                <thead className={fr.cx("fr-sr-only")}>
                  <tr>
                    <th scope="col">Niveau</th>
                    <th scope="col">Dureté</th>
                  </tr>
                </thead>
                <tbody>
                  {ECHELLE_DURETE.map((niveau, i) => (
                    <tr key={niveau.libelle} aria-selected={i === actif} className={i === actif ? fr.cx("fr-text--bold") : undefined}>
                      <td>
                        {niveau.libelle}
                        {i === actif && <span className={fr.cx("fr-sr-only")}> (valeur mesurée : {formaterValeur(valeur)} °f)</span>}
                      </td>
                      <td>{niveau.plage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
