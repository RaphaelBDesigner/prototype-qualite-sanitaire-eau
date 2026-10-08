import infos from "../data/communes-infos.json";

export type InfosCommune = {
  mairie: {
    telephone: string;
    email: string;
    adresse: string;
    horaires: string;
    fermeture: string;
    site: { libelle: string; url: string };
  };
  captage: string;
  traitement: { nom: string; description: string };
  exploitant: string;
  gestionnaire: { nom: string; url: string };
  habitantsParSecteur: number;
  ars: { nom: string; url: string };
  distributeur: string;
};

export function infosCommune(codeInsee: string): InfosCommune | undefined {
  return (infos as unknown as Record<string, InfosCommune>)[codeInsee];
}
