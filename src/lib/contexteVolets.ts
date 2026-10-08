import { createContext, useContext } from "react";
import { voletFiche } from "../components/volets";

export type EntreeVolet =
  | { type: "mairie" }
  | { type: "origine" }
  | { type: "analyses" }
  | { type: "parametre"; id: string };

export type ContexteVolets = {
  /** Ouvre le volet depuis la page (la pile repart de zéro) ; `idDeclencheur` reçoit le focus à la fermeture. */
  ouvrir: (entree: EntreeVolet, idDeclencheur: string) => void;
  /** Ouvre un volet par-dessus le volet courant ; `idRetour` reçoit le focus au retour. */
  empiler: (entree: EntreeVolet, idRetour: string) => void;
};

export const ContexteVolets = createContext<ContexteVolets | null>(null);

export function useVolets() {
  const contexte = useContext(ContexteVolets);
  if (!contexte) throw new Error("useVolets doit être utilisé dans <VoletsFiche>");
  return contexte;
}

/**
 * Propriétés d'un bouton de la page qui ouvre un volet. Le JS DSFR gère l'ouverture (aria-controls)
 * ; React choisit le contenu et rend le focus à ce bouton à la fermeture.
 */
export function useBoutonVolet() {
  const { ouvrir } = useVolets();
  return (entree: EntreeVolet, id: string) => ({
    id,
    type: "button" as const,
    "aria-controls": voletFiche.id,
    "data-fr-opened": false,
    onClick: () => ouvrir(entree, id),
  });
}
