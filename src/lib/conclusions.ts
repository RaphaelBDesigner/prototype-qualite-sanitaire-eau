import type { StatutSecteur } from "./secteurs";

/** Textes des conclusions sanitaires de l'ARS (fictifs, d'après les maquettes). */
export function conclusionPrelevement(depassement: boolean, statut: StatutSecteur): string[] {
  if (!depassement) {
    return ["L’Agence Régionale de Santé (ARS) considère que l’eau distribuée est conforme aux exigences de qualité pour ce paramètre."];
  }
  switch (statut) {
    case "interdiction":
      return [
        "L’Agence Régionale de Santé (ARS) considère que l’eau distribuée présente une non-conformité nécessitant une restriction d’usage.",
        "La consommation de l’eau est interdite jusqu’à la mise en conformité et l’obtention de résultats satisfaisants.",
      ];
    case "restriction":
      return [
        "L’Agence Régionale de Santé (ARS) considère que la qualité de l’eau distribuée ne remet pas en cause son utilisation par la population générale pour la consommation humaine.",
        "Toutefois, par mesure de précaution, une limitation locale s’applique aux nourrissons et aux personnes dialysées.",
      ];
    default:
      return [
        "L’Agence Régionale de Santé (ARS) considère que ce dépassement ponctuel ne remet pas en cause l’utilisation de l’eau par la population.",
        "Un prélèvement de contrôle a été programmé.",
      ];
  }
}
