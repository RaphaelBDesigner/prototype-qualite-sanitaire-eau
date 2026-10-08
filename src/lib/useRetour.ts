import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Retour vers la page d'où l'on vient (historique du navigateur).
 * Si la page a été ouverte directement (lien partagé, rechargement), retour vers `repli`.
 */
export function useRetour(repli: string) {
  const navigate = useNavigate();
  const aUnePagePrecedente = () => ((window.history.state as { idx?: number } | null)?.idx ?? 0) > 0;
  return {
    to: repli,
    onClick: (event: MouseEvent) => {
      if (!aUnePagePrecedente()) return;
      event.preventDefault();
      navigate(-1);
    },
  };
}
