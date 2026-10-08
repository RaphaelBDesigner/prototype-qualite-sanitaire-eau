import { SegmentedControl } from "@codegouvfr/react-dsfr/SegmentedControl";
import type { FrIconClassName } from "@codegouvfr/react-dsfr";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import type { TypeEau } from "../lib/recherche";

/** Icône custom (pas d'équivalent DSFR, cf. NOTES.md), déclarée dans styles/app.css. */
const ICONE_BAIGNADE = "fr-icon-pool-line" as FrIconClassName;

type Props = {
  valeur: TypeEau;
  onChange: (type: TypeEau) => void;
  /** Masque la légende « Type d’eau » à l’écran (elle reste lue par les lecteurs d’écran). */
  masquerLegende?: boolean;
  className?: string;
};

/** Bascule Eau potable / Baignade : contrôle segmenté DSFR, en pleine largeur (exception validée, cf. NOTES.md). */
export function BasculeTypeEau({ valeur, onChange, masquerLegende, className }: Props) {
  const segment = (type: TypeEau) => ({
    value: type,
    checked: valeur === type,
    onChange: () => onChange(type),
  });
  return (
    <SegmentedControl
      {...(masquerLegende ? { hideLegend: true as const } : {})}
      legend="Type d’eau"
      name="type-eau"
      className={cx("segmented-pleine-largeur", className)}
      segments={[
        { label: "Eau potable", iconId: "fr-icon-drop-line", nativeInputProps: segment("potable") },
        { label: "Baignade", iconId: ICONE_BAIGNADE, nativeInputProps: segment("baignade") },
      ]}
    />
  );
}
