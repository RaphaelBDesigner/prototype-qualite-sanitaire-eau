import { useState } from "react";
import { Highlight } from "@codegouvfr/react-dsfr/Highlight";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { ButtonsGroup } from "@codegouvfr/react-dsfr/ButtonsGroup";
import { fr } from "@codegouvfr/react-dsfr";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { useBoutonVolet } from "../lib/contexteVolets";
import type { StatutSecteur } from "../lib/secteurs";

type Usage = { nom: string; description: string; autorisation: "interdit" | "deconseille" | "autorise" };

const BADGES_USAGE = {
  interdit: { libelle: "Interdit", severite: "error" },
  deconseille: { libelle: "Déconseillé", severite: "warning" },
  autorise: { libelle: "Autorisé", severite: "success" },
} as const;

const ETATS: Record<
  StatutSecteur,
  { badge: { libelle: string; severite: "error" | "warning" | "info" }; depuis?: string; concernes?: string[]; usages?: Usage[]; conclusion: string }
> = {
  interdiction: {
    badge: { libelle: "Interdiction d’usage", severite: "error" },
    depuis: "Depuis le 2 août 2026 sur décision de la préfecture.",
    concernes: ["Toute la population"],
    usages: [
      { nom: "Alimentaire", description: "Boire, cuisiner, préparer les biberons et se brosser les dents.", autorisation: "interdit" },
      { nom: "Hygiène et entretien", description: "Se doucher, laver les aliments, faire la vaisselle, la lessive et le ménage.", autorisation: "interdit" },
    ],
    conclusion: "Tous les usages de l’eau distribuée sont interdits.",
  },
  restriction: {
    badge: { libelle: "Restriction d’usage", severite: "warning" },
    depuis: "Depuis le 2 août 2026 sur décision de la préfecture.",
    concernes: ["Nourrissons", "Femmes enceintes ou allaitantes", "Personnes dialysées"],
    usages: [
      { nom: "Alimentaire", description: "Boire, cuisiner, préparer les biberons et se brosser les dents.", autorisation: "deconseille" },
      { nom: "Hygiène et entretien", description: "Se doucher, laver les aliments, faire la vaisselle, la lessive et le ménage.", autorisation: "autorise" },
    ],
    conclusion: "Population générale : l’eau du robinet peut être utilisée sans restriction.",
  },
  aucune: {
    badge: { libelle: "Aucune restriction connue", severite: "info" },
    conclusion: "L’eau du robinet peut être utilisée sans restriction.",
  },
};

/** État d'usage de l'eau du secteur : mise en avant DSFR, bordure à la couleur de l'état (cf. NOTES.md). */
export function EtatUsage({ statut }: { statut: StatutSecteur }) {
  const boutonVolet = useBoutonVolet();
  const [raccordement, setRaccordement] = useState(false);
  const etat = ETATS[statut];

  return (
    <Highlight bodyAs="div" className={cx("etat-usage", `etat-usage--${statut}`, fr.cx("fr-mb-6w", "fr-ml-0"))} classes={{ content: "etat-usage__contenu" }}>
      <Badge severity={etat.badge.severite} className={fr.cx("fr-mb-2w")}>
        {etat.badge.libelle}
      </Badge>
      {etat.depuis && <p className={`${fr.cx("fr-text--sm")} fr-text-mention--grey`}>{etat.depuis}</p>}
      {etat.concernes && (
        <>
          <h2 className={fr.cx("fr-text--md", "fr-text--bold", "fr-mb-1w")}>Qui est concerné ?</h2>
          <ul className={fr.cx("fr-text--sm")}>
            {etat.concernes.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </>
      )}
      {etat.usages?.map((usage) => (
        <div key={usage.nom} className={fr.cx("fr-mb-2w")}>
          <div className="etat-usage__usage">
            <h2 className={fr.cx("fr-text--md", "fr-text--bold", "fr-mb-0")}>{usage.nom}</h2>
            <Badge small severity={BADGES_USAGE[usage.autorisation].severite} noIcon>
              {BADGES_USAGE[usage.autorisation].libelle}
            </Badge>
          </div>
          <p className={fr.cx("fr-text--sm", "fr-mb-0")}>{usage.description}</p>
        </div>
      ))}
      <p className={fr.cx("fr-text--sm")}>{etat.conclusion}</p>
      <hr className={fr.cx("fr-pb-3w")} />
      <p className={fr.cx("fr-text--sm")}>
        Les consignes de votre mairie restent prioritaires.{" "}
        <button className={cx(fr.cx("fr-link", "fr-text--sm", "fr-icon-arrow-right-line", "fr-link--icon-right"), "lien-bouton")} {...boutonVolet({ type: "mairie" }, "ouvrir-mairie-etat")}>
          Suivre les infos locales
        </button>
      </p>
      <p className={fr.cx("fr-text--sm", "fr-mb-0")}>
        Ces informations concernent les foyers raccordés au réseau public.{" "}
        <button
          type="button"
          className={cx(fr.cx("fr-link", "fr-text--sm", "fr-icon-arrow-right-line", "fr-link--icon-right"), "lien-bouton")}
          aria-expanded={raccordement}
          onClick={() => setRaccordement(true)}
        >
          Vérifier mon raccordement
        </button>
      </p>
      <div role="status">
        {raccordement && (
          <Alert
            small
            severity="info"
            description="La vérification du raccordement sera bientôt disponible."
            closable
            onClose={() => setRaccordement(false)}
            className={fr.cx("fr-mt-2w")}
          />
        )}
      </div>
      {statut !== "aucune" && (
        <>
          <hr className={fr.cx("fr-mt-3w", "fr-pb-3w")} />
          <ButtonsGroup
            buttons={[
              {
                children: `Origine de cette ${statut === "interdiction" ? "interdiction" : "restriction"}`,
                priority: "secondary",
                nativeButtonProps: boutonVolet({ type: "origine" }, "ouvrir-origine"),
              },
            ]}
          />
        </>
      )}
    </Highlight>
  );
}
