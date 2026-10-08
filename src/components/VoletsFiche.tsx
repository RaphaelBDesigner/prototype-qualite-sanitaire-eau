import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { voletFiche } from "./volets";
import { ContexteVolets, type EntreeVolet } from "../lib/contexteVolets";
import { VoletMairie } from "./VoletMairie";
import { VoletOrigine } from "./VoletOrigine";
import { VoletAnalyses } from "./VoletAnalyses";
import { VoletParametre } from "./VoletParametre";
import { parametre } from "../lib/analyses";
import type { StatutSecteur } from "../lib/secteurs";
import type { InfosCommune } from "../lib/communes";

type Props = {
  codeUdi: string;
  statut: StatutSecteur;
  infos: InfosCommune;
  children: ReactNode;
};

type Niveau = { entree: EntreeVolet; idRetour?: string };

/**
 * Volets de la fiche : une seule modale DSFR (focus piégé, Échap, clic sur le fond, retour du focus)
 * dont le contenu suit une pile. Depuis Analyses, ouvrir un paramètre l'empile ; « Fermer », Échap
 * ou un clic sur le fond reviennent alors à Analyses au lieu de tout fermer.
 */
export function VoletsFiche({ codeUdi, statut, infos, children }: Props) {
  const [pile, setPile] = useState<Niveau[]>([]);
  const focusApresRetour = useRef<string | undefined>(undefined);
  const declencheur = useRef<string | undefined>(undefined);
  const courant = pile[pile.length - 1];

  const ouvrir = useCallback((entree: EntreeVolet, idDeclencheur: string) => {
    declencheur.current = idDeclencheur;
    setPile([{ entree }]);
  }, []);

  // Plusieurs boutons de la page ouvrent la même modale : le DSFR rend le focus au premier d'entre eux.
  // À la fermeture, on le rend au bouton réellement utilisé.
  useEffect(() => {
    const modale = document.getElementById(voletFiche.id);
    const onFermeture = () => {
      const id = declencheur.current;
      if (id) setTimeout(() => document.getElementById(id)?.focus());
    };
    modale?.addEventListener("dsfr.conceal", onFermeture);
    return () => modale?.removeEventListener("dsfr.conceal", onFermeture);
  }, []);
  const empiler = useCallback((entree: EntreeVolet, idRetour: string) => {
    setPile((p) => [...p, { entree, idRetour }]);
  }, []);
  const depiler = useCallback(() => {
    setPile((p) => {
      focusApresRetour.current = p[p.length - 1]?.idRetour;
      return p.slice(0, -1);
    });
  }, []);

  // Contenu remplacé : retour en haut du volet, puis focus sur l'élément d'origine au retour.
  useEffect(() => {
    const modale = document.getElementById(voletFiche.id);
    modale?.querySelector(".fr-modal__body")?.scrollTo({ top: 0 });
    const id = focusApresRetour.current;
    focusApresRetour.current = undefined;
    if (id) document.getElementById(id)?.focus();
    else if (pile.length > 1) modale?.querySelector<HTMLElement>(".fr-modal__title")?.focus();
  }, [pile]);

  // Avec plusieurs niveaux, Fermer / Échap / clic sur le fond reviennent au niveau précédent :
  // on intercepte ces événements avant le JS DSFR (phase de capture).
  useEffect(() => {
    if (pile.length < 2) return;
    const modale = document.getElementById(voletFiche.id);
    if (!modale) return;
    const onClick = (event: MouseEvent) => {
      const cible = event.target as HTMLElement;
      if (cible === modale || cible.closest(".fr-btn--close")) {
        event.stopPropagation();
        event.preventDefault();
        depiler();
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !modale.classList.contains("fr-modal--opened")) return;
      // Comme le DSFR : Échap dans un champ ne ferme pas le volet.
      if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName ?? "")) return;
      event.stopPropagation();
      depiler();
    };
    modale.addEventListener("click", onClick, { capture: true });
    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => {
      modale.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("keydown", onKeyDown, { capture: true });
    };
  }, [pile.length, depiler]);

  const contexte = useMemo(() => ({ ouvrir, empiler }), [ouvrir, empiler]);
  const { titre, contenu } = rendu(courant?.entree, { codeUdi, statut, infos });

  return (
    <ContexteVolets.Provider value={contexte}>
      {children}
      <voletFiche.Component
        title={titre}
        className="volet"
        titleProps={{ tabIndex: -1 }}
      >
        {contenu}
      </voletFiche.Component>
    </ContexteVolets.Provider>
  );
}

function rendu(entree: EntreeVolet | undefined, { codeUdi, statut, infos }: Omit<Props, "children">) {
  switch (entree?.type) {
    case "mairie":
      return { titre: "Suivre les informations locales", contenu: <VoletMairie mairie={infos.mairie} /> };
    case "origine":
      return {
        titre: `Origine de cette ${statut === "interdiction" ? "interdiction" : "restriction"}`,
        contenu: <VoletOrigine statut={statut} />,
      };
    case "analyses":
      return { titre: "Détails des analyses", contenu: <VoletAnalyses codeUdi={codeUdi} /> };
    case "parametre": {
      const p = parametre(codeUdi, entree.id);
      return p ? { titre: p.nom, contenu: <VoletParametre parametre={p} statut={statut} /> } : { titre: "Paramètre", contenu: <p>Paramètre introuvable.</p> };
    }
    default:
      // Contenu minimal avant la première ouverture (la modale DSFR exige un titre et un contenu).
      return { titre: "Détails", contenu: <p /> };
  }
}
