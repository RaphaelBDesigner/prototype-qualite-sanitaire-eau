/** Légende de la carte : symbole des zones (pas d'équivalent DSFR, cf. NOTES.md). */
export function LegendeZone() {
  return (
    <p className="carte-ign__legende fr-text--sm fr-mb-0">
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
        <rect x="1" y="1" width="18" height="18" className="carte-ign__zone" />
      </svg>
      Zone = secteur de distribution d’eau
    </p>
  );
}
