import { fr } from "@codegouvfr/react-dsfr";
import { depasse, formaterValeur, type Indicateur } from "../lib/analyses";

const LARGEUR = 320;
const HAUTEUR = 170;
const MARGE = { gauche: 34, droite: 10, haut: 10, bas: 24 };

const MOIS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

function etiquette(dateIso: string, selectionnee: boolean) {
  const [annee, mois, jour] = dateIso.split("-");
  return selectionnee ? `${jour}/${mois}` : `${MOIS[Number(mois) - 1]}${annee.slice(2)}`;
}

/** Pas « rond » pour l'axe des ordonnées. */
function pasAxe(maximum: number) {
  const brut = maximum / 4;
  const puissance = 10 ** Math.floor(Math.log10(brut));
  return [1, 2, 2.5, 5, 10].map((m) => m * puissance).find((p) => p >= brut) ?? brut;
}

type Props = { indicateur: Indicateur; index: number };

/**
 * Graphique d'évolution (SVG, couleurs DSFR) : valeurs mesurées, limite réglementaire en pointillés
 * et prélèvement affiché. Le DSFR n'a pas de graphique annoté (cf. NOTES.md) ; le tableau sert d'alternative.
 */
export function GraphiqueEvolution({ indicateur, index }: Props) {
  const { mesures, limite, unite } = indicateur;
  const maxValeur = Math.max(...mesures.map((m) => m.valeur), limite ?? 0) * 1.1 || 1;
  const pas = pasAxe(maxValeur);
  const haut = Math.ceil(maxValeur / pas) * pas;
  const graduations = Array.from({ length: Math.round(haut / pas) + 1 }, (_, i) => i * pas);
  const largeurUtile = LARGEUR - MARGE.gauche - MARGE.droite;
  const hauteurUtile = HAUTEUR - MARGE.haut - MARGE.bas;
  const x = (i: number) => MARGE.gauche + (mesures.length === 1 ? largeurUtile / 2 : (i * largeurUtile) / (mesures.length - 1));
  const y = (v: number) => MARGE.haut + hauteurUtile - (v / haut) * hauteurUtile;
  const decimales = pas < 0.1 ? 2 : pas < 1 ? 1 : 0;
  const description = `Évolution de ${indicateur.nom} sur ${mesures.length} prélèvements, de ${formaterValeur(Math.min(...mesures.map((m) => m.valeur)))} à ${formaterValeur(Math.max(...mesures.map((m) => m.valeur)))} ${unite}${limite !== undefined ? `, limite réglementaire ${formaterValeur(limite)} ${unite}` : ""}. Le détail figure dans l’onglet Tableau.`;

  return (
    <figure className={fr.cx("fr-m-0")}>
      <svg className="graphique-evolution" viewBox={`0 0 ${LARGEUR} ${HAUTEUR}`} role="img" aria-label={description}>
        {graduations.map((g) => (
          <g key={g}>
            <line className="graphique-evolution__grille" x1={MARGE.gauche} x2={LARGEUR - MARGE.droite} y1={y(g)} y2={y(g)} />
            <text className="graphique-evolution__texte" x={MARGE.gauche - 6} y={y(g) + 3} textAnchor="end">
              {g.toLocaleString("fr-FR", { minimumFractionDigits: decimales, maximumFractionDigits: decimales })}
            </text>
          </g>
        ))}
        {limite !== undefined && limite > 0 && (
          <line className="graphique-evolution__limite" x1={MARGE.gauche} x2={LARGEUR - MARGE.droite} y1={y(limite)} y2={y(limite)} />
        )}
        <line className="graphique-evolution__selection" x1={x(index)} x2={x(index)} y1={MARGE.haut} y2={MARGE.haut + hauteurUtile} />
        <polyline className="graphique-evolution__courbe" points={mesures.map((m, i) => `${x(i)},${y(m.valeur)}`).join(" ")} />
        {mesures.map((m, i) => (
          <circle
            key={m.date}
            cx={x(i)}
            cy={y(m.valeur)}
            r={i === index ? 4 : 3}
            className={depasse(indicateur, m) ? "graphique-evolution__point graphique-evolution__point--depassement" : "graphique-evolution__point"}
          />
        ))}
        {mesures.map((m, i) => (
          <text
            key={m.date}
            className={i === index ? "graphique-evolution__texte graphique-evolution__texte--actif" : "graphique-evolution__texte"}
            x={x(i)}
            y={HAUTEUR - 6}
            textAnchor={i === 0 ? "start" : i === mesures.length - 1 ? "end" : "middle"}
          >
            {etiquette(m.date, i === index)}
          </text>
        ))}
      </svg>
      <ul className={fr.cx("fr-raw-list", "fr-text--sm", "fr-mt-2w")} aria-hidden="true">
        <li className="legende-graphique">
          <span className="legende-graphique__symbole legende-graphique__symbole--valeur" />
          Valeur mesurée
        </li>
        {limite !== undefined && limite > 0 && (
          <li className="legende-graphique">
            <span className="legende-graphique__symbole legende-graphique__symbole--limite" />
            Limite réglementaire ({formaterValeur(limite)} {unite})
          </li>
        )}
        <li className="legende-graphique">
          <span className="legende-graphique__symbole legende-graphique__symbole--selection" />
          Prélèvement affiché
        </li>
      </ul>
    </figure>
  );
}
