import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { fr } from "@codegouvfr/react-dsfr";

type Props = {
  /** Sous la carte plutôt que posée dessus. */
  horsCarte?: boolean;
  texte?: string;
};

/** Légende de la carte : symbole des zones (pas d'équivalent DSFR, cf. NOTES.md). */
export function LegendeZone({ horsCarte, texte = "Zone = secteur de distribution d’eau" }: Props) {
  return (
    <p className={cx(horsCarte ? "legende-zone" : "carte-ign__legende", fr.cx("fr-text--sm", "fr-mb-0", horsCarte && "fr-mt-1w"))}>
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
        <rect x="1" y="1" width="18" height="18" className="carte-ign__zone" />
      </svg>
      {texte}
    </p>
  );
}
