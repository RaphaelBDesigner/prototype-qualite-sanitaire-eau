import { Card } from "@codegouvfr/react-dsfr/Card";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { fr } from "@codegouvfr/react-dsfr";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { MiniCarteSecteur } from "./MiniCarteSecteur";
import type { Secteur, StatutSecteur } from "../lib/secteurs";

const BADGES: Partial<Record<StatutSecteur, { libelle: string; severite: "error" | "warning" }>> = {
  interdiction: { libelle: "Interdiction d’usage", severite: "error" },
  restriction: { libelle: "Restriction d’usage", severite: "warning" },
};

type Props = {
  secteur: Secteur;
  secteurs: Secteur[];
};

/**
 * Carte DSFR horizontale d'un secteur de distribution (UDI), entièrement cliquable.
 * Comme la maquette mobile, elle reste horizontale sur mobile, avec la vignette à droite (exception validée, cf. NOTES.md).
 */
export function CarteSecteur({ secteur, secteurs }: Props) {
  const { id, nom, communes, precision, statut } = secteur.properties;
  const badge = BADGES[statut];
  return (
    <Card
      horizontal
      size="small"
      title={nom}
      titleAs="h3"
      desc={
        communes.length > 0 ? (
          <>
            <strong>{communes.join(", ")}</strong>
            {precision && ` (${precision})`}
          </>
        ) : (
          precision
        )
      }
      end={
        badge && (
          <Badge severity={badge.severite}>
            {badge.libelle}
          </Badge>
        )
      }
      imageComponent={<MiniCarteSecteur secteurs={secteurs} idSecteur={id} />}
      enlargeLink
      linkProps={{ to: `/secteur/${id}` }}
      className={cx(fr.cx("fr-mb-3w"), "carte-secteur")}
    />
  );
}
