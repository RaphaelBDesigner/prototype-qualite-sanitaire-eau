import lieuxBaignade from "../data/lieux-baignade.json";

export type TypeEau = "potable" | "baignade";

export type Suggestion = {
  id: string;
  libelle: string;
  detail: string;
};

/** Communes pour lesquelles le prototype contient des données (code INSEE). */
export const COMMUNES_AVEC_DONNEES = ["59350"];

const NB_MAX_SUGGESTIONS = 8;

/** Minuscules, sans accents, tirets et apostrophes remplacés par des espaces. */
export function normaliser(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[-'’]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

type CommuneCompacte = [nom: string, code: string, codePostal: string, departement: string];

let communes: Promise<CommuneCompacte[]> | undefined;

/** Le référentiel des communes (~500 Ko) n'est chargé qu'à la première recherche. */
function chargerCommunes() {
  communes ??= import("../data/communes.json").then((module) => module.default as CommuneCompacte[]);
  return communes;
}

/** Filtre par préfixe sur le nom de la commune, ou sur le code postal si la saisie est numérique. */
export async function chercherCommunes(saisie: string): Promise<Suggestion[]> {
  const requete = normaliser(saisie);
  if (requete.length < 2) return [];
  const estCodePostal = /^\d+$/.test(requete);
  const resultats: Suggestion[] = [];
  for (const [nom, code, codePostal, departement] of await chargerCommunes()) {
    const correspond = estCodePostal ? codePostal.startsWith(requete) : normaliser(nom).startsWith(requete);
    if (correspond) {
      resultats.push({ id: code, libelle: nom, detail: `${codePostal} · Département ${departement}` });
      if (resultats.length === NB_MAX_SUGGESTIONS) break;
    }
  }
  return resultats;
}

/** Filtre par préfixe sur le nom du lieu (ou l'un de ses mots) et sur la commune. */
export async function chercherLieuxBaignade(saisie: string): Promise<Suggestion[]> {
  const requete = normaliser(saisie);
  if (requete.length < 2) return [];
  return lieuxBaignade
    .filter(({ nom, commune }) => {
      const mots = normaliser(nom).split(" ");
      return (
        normaliser(nom).startsWith(requete) ||
        mots.some((mot) => mot.startsWith(requete)) ||
        normaliser(commune).startsWith(requete)
      );
    })
    .slice(0, NB_MAX_SUGGESTIONS)
    .map(({ id, nom, commune, type }) => ({ id, libelle: nom, detail: `${commune} · ${type}` }));
}
