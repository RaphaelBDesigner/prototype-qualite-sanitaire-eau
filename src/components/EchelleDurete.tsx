import { fr } from "@codegouvfr/react-dsfr";
import { ECHELLE_DURETE, formaterValeur } from "../lib/analyses";

/**
 * Échelle de dureté, comme la maquette : séparateur, titre, puis une liste de niveaux sans bordures
 * (libellé à gauche, plage à droite). La ligne de la valeur affichée est mise en évidence.
 * Tableau sémantique (niveau / plage) mis en forme avec les tokens DSFR (cf. NOTES.md).
 */
export function EchelleDurete({ valeur }: { valeur: number }) {
  const actif = ECHELLE_DURETE.findIndex((niveau) => valeur < niveau.max);
  return (
    <div className={fr.cx("fr-mb-3w")}>
      <hr className={fr.cx("fr-pb-3w")} />
      <h4 className={fr.cx("fr-text--md", "fr-text--bold", "fr-mb-1w")}>Échelle de dureté</h4>
      <table className="echelle-durete">
        <caption className={fr.cx("fr-sr-only")}>Échelle de dureté de l’eau, en degrés français</caption>
        <thead className={fr.cx("fr-sr-only")}>
          <tr>
            <th scope="col">Niveau</th>
            <th scope="col">Dureté</th>
          </tr>
        </thead>
        <tbody>
          {ECHELLE_DURETE.map((niveau, i) => (
            <tr key={niveau.libelle} className={i === actif ? "echelle-durete__actif" : undefined} aria-current={i === actif ? "true" : undefined}>
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
  );
}
