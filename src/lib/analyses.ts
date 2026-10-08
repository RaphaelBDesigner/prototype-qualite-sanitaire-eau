/**
 * Résultats d'analyses du prototype (données fictives).
 * Pesticides et Dureté reprennent les valeurs des maquettes ; les autres paramètres sont générés
 * de façon déterministe à partir du code de l'UDI, pour que chaque secteur ait ses propres valeurs.
 */

export type Groupe = "sanitaire" | "reference" | "caracteristique" | "radioactivite";

export type EtatParametre = "depassement" | "surveiller" | "conforme";

export type Mesure = { date: string; valeur: number };

export type Indicateur = {
  id: string;
  nom: string;
  unite: string;
  /** Limite réglementaire (valeur maximale), absente pour les paramètres sans limite. */
  limite?: number;
  description: string;
  mesures: Mesure[];
};

export type Parametre = {
  id: string;
  nom: string;
  groupe: Groupe;
  famille?: string;
  description: string;
  /** Une famille (ex. Pesticides) regroupe plusieurs substances suivies individuellement. */
  nbSubstances?: number;
  indicateurs: Indicateur[];
  /** Bilan annuel affiché en tête du volet d'une famille. */
  bilan?: { note: Note; prelevements: number; conformite: number; substances: number; limite: string; maximum: string };
};

export type Note = "A" | "B" | "C" | "D";

export const LIBELLES_NOTES: Record<Note, string> = {
  A: "Très bonne qualité",
  B: "Bonne qualité",
  C: "Qualité moyenne",
  D: "Qualité insuffisante",
};

export const GROUPES: { id: Groupe; titre: string; aide: string }[] = [
  {
    id: "sanitaire",
    titre: "Paramètres sanitaires",
    aide: "Paramètres pouvant avoir un effet sur la santé : ils doivent respecter une limite réglementaire.",
  },
  {
    id: "reference",
    titre: "Références de qualité",
    aide: "Indicateurs du bon fonctionnement des installations, sans effet direct sur la santé.",
  },
  {
    id: "caracteristique",
    titre: "Caractéristiques de l’eau",
    aide: "Propriétés naturelles de l’eau (minéralisation, acidité, température…).",
  },
  { id: "radioactivite", titre: "Radioactivité", aide: "Indicateurs de radioactivité naturelle ou artificielle de l’eau." },
];

/** Dates des prélèvements des 12 derniers mois (format ISO). */
export const DATES_PRELEVEMENTS = ["2025-11-12", "2026-01-14", "2026-03-11", "2026-05-13", "2026-06-10", "2026-07-09"];

const serie = (valeurs: number[]): Mesure[] => valeurs.map((valeur, i) => ({ date: DATES_PRELEVEMENTS[i], valeur }));

/** Générateur pseudo-aléatoire déterministe (mulberry32). */
function aleatoire(graine: string) {
  let a = [...graine].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 2654435761), 1779033703) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Definition = {
  nom: string;
  groupe: Groupe;
  famille?: string;
  unite: string;
  limite?: number;
  /** Valeur typique, autour de laquelle les mesures sont générées. */
  typique: number;
  description: string;
  nbSubstances?: number;
};

const DEFINITIONS: Definition[] = [
  { nom: "Nitrates", groupe: "sanitaire", famille: "Nitrates", unite: "mg/L", limite: 50, typique: 18, description: "Issus principalement des engrais agricoles et des rejets d’eaux usées." },
  { nom: "Nitrites", groupe: "sanitaire", famille: "Nitrates", unite: "mg/L", limite: 0.5, typique: 0.02, description: "Forme intermédiaire de l’azote, surveillée en sortie de traitement." },
  { nom: "PFAS (20 substances)", groupe: "sanitaire", famille: "PFAS", unite: "µg/L", limite: 0.1, typique: 0.03, description: "Somme de 20 substances perfluoroalkylées, persistantes dans l’environnement.", nbSubstances: 20 },
  { nom: "Plomb", groupe: "sanitaire", famille: "Plomb", unite: "µg/L", limite: 10, typique: 1.5, description: "Provient surtout des anciennes canalisations en plomb." },
  { nom: "Arsenic", groupe: "sanitaire", famille: "Métaux", unite: "µg/L", limite: 10, typique: 2, description: "Élément naturellement présent dans certains sols." },
  { nom: "Cadmium", groupe: "sanitaire", famille: "Métaux", unite: "µg/L", limite: 5, typique: 0.2, description: "Métal pouvant provenir de rejets industriels." },
  { nom: "Chrome", groupe: "sanitaire", famille: "Métaux", unite: "µg/L", limite: 25, typique: 1, description: "Métal d’origine naturelle ou industrielle." },
  { nom: "Cuivre", groupe: "sanitaire", famille: "Métaux", unite: "mg/L", limite: 2, typique: 0.05, description: "Provient principalement des canalisations intérieures en cuivre." },
  { nom: "Mercure", groupe: "sanitaire", famille: "Métaux", unite: "µg/L", limite: 1, typique: 0.05, description: "Métal toxique, rarement détecté dans l’eau du robinet." },
  { nom: "Nickel", groupe: "sanitaire", famille: "Métaux", unite: "µg/L", limite: 20, typique: 2, description: "Peut provenir de la robinetterie." },
  { nom: "Sélénium", groupe: "sanitaire", famille: "Métaux", unite: "µg/L", limite: 20, typique: 1, description: "Élément présent naturellement dans certaines nappes." },
  { nom: "Antimoine", groupe: "sanitaire", famille: "Métaux", unite: "µg/L", limite: 10, typique: 0.5, description: "Peut provenir de certains matériaux au contact de l’eau." },
  { nom: "Bore", groupe: "sanitaire", unite: "mg/L", limite: 1.5, typique: 0.05, description: "Élément d’origine naturelle ou issu de détergents." },
  { nom: "Fluorures", groupe: "sanitaire", unite: "mg/L", limite: 1.5, typique: 0.2, description: "Présents naturellement dans certaines eaux souterraines." },
  { nom: "Cyanures totaux", groupe: "sanitaire", unite: "µg/L", limite: 50, typique: 2, description: "Composés pouvant provenir de rejets industriels." },
  { nom: "Bromates", groupe: "sanitaire", unite: "µg/L", limite: 10, typique: 2, description: "Sous-produits de la désinfection de l’eau par l’ozone." },
  { nom: "Trihalométhanes (4 paramètres)", groupe: "sanitaire", unite: "µg/L", limite: 100, typique: 15, description: "Sous-produits de la chloration de l’eau.", nbSubstances: 4 },
  { nom: "Chlorure de vinyle", groupe: "sanitaire", unite: "µg/L", limite: 0.5, typique: 0.05, description: "Peut migrer depuis certaines anciennes canalisations en PVC." },
  { nom: "Benzène", groupe: "sanitaire", unite: "µg/L", limite: 1, typique: 0.05, description: "Composé organique d’origine industrielle." },
  { nom: "Tétrachloroéthylène et trichloroéthylène", groupe: "sanitaire", unite: "µg/L", limite: 10, typique: 0.5, description: "Solvants chlorés d’origine industrielle." },
  { nom: "Hydrocarbures aromatiques polycycliques (HAP)", groupe: "sanitaire", unite: "µg/L", limite: 0.1, typique: 0.005, description: "Issus de combustions incomplètes.", nbSubstances: 4 },
  { nom: "Acrylamide", groupe: "sanitaire", unite: "µg/L", limite: 0.1, typique: 0.01, description: "Résidu possible de produits de traitement de l’eau." },
  { nom: "Microcystines", groupe: "sanitaire", unite: "µg/L", limite: 1, typique: 0.05, description: "Toxines produites par certaines cyanobactéries." },
  { nom: "Escherichia coli", groupe: "sanitaire", famille: "Bactéries", unite: "n/100 mL", limite: 0, typique: 0, description: "Bactérie indicatrice d’une contamination fécale." },
  { nom: "Entérocoques intestinaux", groupe: "sanitaire", famille: "Bactéries", unite: "n/100 mL", limite: 0, typique: 0, description: "Bactéries indicatrices d’une contamination fécale." },
  { nom: "Uranium", groupe: "sanitaire", unite: "µg/L", limite: 30, typique: 1, description: "Élément radioactif naturel présent dans certaines roches." },

  { nom: "Chlore libre", groupe: "reference", famille: "Chlore", unite: "mg/L", typique: 0.2, description: "Désinfectant résiduel garantissant la qualité de l’eau jusqu’au robinet." },
  { nom: "Chlore total", groupe: "reference", famille: "Chlore", unite: "mg/L", typique: 0.3, description: "Chlore libre et chlore combiné." },
  { nom: "Turbidité", groupe: "reference", unite: "NFU", limite: 2, typique: 0.3, description: "Mesure de la limpidité de l’eau." },
  { nom: "Couleur", groupe: "reference", unite: "mg/L Pt", limite: 15, typique: 2, description: "Coloration de l’eau, souvent liée à la matière organique." },
  { nom: "Aluminium", groupe: "reference", famille: "Métaux", unite: "µg/L", limite: 200, typique: 20, description: "Peut provenir des produits de traitement de l’eau." },
  { nom: "Ammonium", groupe: "reference", unite: "mg/L", limite: 0.1, typique: 0.02, description: "Indicateur d’une pollution organique." },
  { nom: "Fer total", groupe: "reference", famille: "Métaux", unite: "µg/L", limite: 200, typique: 15, description: "Peut colorer l’eau et provenir des canalisations." },
  { nom: "Manganèse", groupe: "reference", famille: "Métaux", unite: "µg/L", limite: 50, typique: 3, description: "Élément naturel pouvant colorer l’eau." },
  { nom: "Sulfates", groupe: "reference", unite: "mg/L", limite: 250, typique: 45, description: "Sels minéraux d’origine naturelle." },
  { nom: "Chlorures", groupe: "reference", unite: "mg/L", limite: 250, typique: 40, description: "Sels minéraux donnant un goût salé au-delà d’un certain seuil." },
  { nom: "Carbone organique total", groupe: "reference", unite: "mg/L", limite: 2, typique: 1, description: "Quantité de matière organique dans l’eau." },
  { nom: "Bactéries coliformes", groupe: "reference", famille: "Bactéries", unite: "n/100 mL", limite: 0, typique: 0, description: "Indicateur de l’efficacité du traitement." },
  { nom: "Bactéries sulfito-réductrices", groupe: "reference", famille: "Bactéries", unite: "n/100 mL", limite: 0, typique: 0, description: "Indicateur de l’efficacité de la filtration." },
  { nom: "Germes revivifiables à 22 °C", groupe: "reference", famille: "Bactéries", unite: "n/mL", typique: 3, description: "Flore bactérienne générale de l’eau." },
  { nom: "Germes revivifiables à 36 °C", groupe: "reference", famille: "Bactéries", unite: "n/mL", typique: 1, description: "Flore bactérienne générale de l’eau." },
  { nom: "Conductivité à 25 °C", groupe: "reference", unite: "µS/cm", limite: 1100, typique: 620, description: "Mesure de la minéralisation de l’eau." },
  { nom: "Sodium", groupe: "reference", unite: "mg/L", limite: 200, typique: 22, description: "Sel minéral naturellement présent dans l’eau." },

  { nom: "Calcium", groupe: "caracteristique", famille: "Dureté", unite: "mg/L", typique: 105, description: "Principal responsable du calcaire." },
  { nom: "Magnésium", groupe: "caracteristique", famille: "Dureté", unite: "mg/L", typique: 9, description: "Minéral contribuant à la dureté de l’eau." },
  { nom: "Potassium", groupe: "caracteristique", unite: "mg/L", typique: 4, description: "Sel minéral naturellement présent dans l’eau." },
  { nom: "pH", groupe: "caracteristique", unite: "unité pH", typique: 7.4, description: "Mesure de l’acidité de l’eau (entre 6,5 et 9 pour une eau de bonne qualité)." },
  { nom: "Température de l’eau", groupe: "caracteristique", unite: "°C", typique: 14, description: "Température mesurée au moment du prélèvement." },
  { nom: "Titre alcalimétrique complet (TAC)", groupe: "caracteristique", unite: "°f", typique: 24, description: "Teneur en bicarbonates, liée au pouvoir tampon de l’eau." },
  { nom: "Hydrogénocarbonates", groupe: "caracteristique", unite: "mg/L", typique: 290, description: "Sels minéraux d’origine naturelle." },

  { nom: "Tritium", groupe: "radioactivite", unite: "Bq/L", limite: 100, typique: 5, description: "Isotope radioactif de l’hydrogène." },
  { nom: "Activité alpha globale", groupe: "radioactivite", unite: "Bq/L", limite: 0.1, typique: 0.03, description: "Indicateur de radioactivité naturelle." },
  { nom: "Activité bêta globale résiduelle", groupe: "radioactivite", unite: "Bq/L", limite: 1, typique: 0.1, description: "Indicateur de radioactivité." },
  { nom: "Dose indicative", groupe: "radioactivite", unite: "mSv/an", limite: 0.1, typique: 0.01, description: "Exposition annuelle estimée liée à la consommation de l’eau." },
];

const identifiant = (nom: string) =>
  nom
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Pesticides : valeurs des maquettes (dépassement le 09/07/2026). */
const PESTICIDES: Parametre = {
  id: "pesticides",
  nom: "Pesticides",
  groupe: "sanitaire",
  famille: "Pesticides",
  nbSubstances: 256,
  description:
    "Résidus de produits phytosanitaires (herbicides, fongicides) et de leurs dérivés de dégradation.",
  bilan: { note: "A", prelevements: 5, conformite: 100, substances: 256, limite: "0,1 µg/L", maximum: "0 µg/L" },
  indicateurs: [
    {
      id: "chlorothalonil-r417888",
      nom: "Chlorothalonil R417888",
      unite: "µg/L",
      limite: 0.1,
      description: "Résidu de dégradation d’un fongicide agricole, recherché car jugé préoccupant pour la santé.",
      mesures: serie([0.037, 0.022, 0.037, 0.037, 0.06, 0.147]),
    },
    {
      id: "chlorothalonil-4-hydroxy",
      nom: "Chlorothalonil-4-hydroxy",
      unite: "µg/L",
      limite: 0.1,
      description: "Résidu de dégradation d’un fongicide agricole, recherché car jugé préoccupant pour la santé.",
      mesures: serie([0.041, 0.035, 0.048, 0.052, 0.071, 0.147]),
    },
  ],
};

/** Dureté : valeurs proches de la maquette (22,4 °f). */
const DURETE: Parametre = {
  id: "durete",
  nom: "Dureté",
  groupe: "caracteristique",
  famille: "Dureté",
  description: "Quantité de calcium et de magnésium dans l’eau. Une eau dure n’est pas dangereuse pour la santé.",
  indicateurs: [
    {
      id: "durete",
      nom: "Dureté",
      unite: "°f",
      description: "Quantité de calcium et de magnésium dans l’eau. Une eau dure n’est pas dangereuse pour la santé.",
      mesures: serie([23.1, 22.8, 21.9, 22.6, 23.4, 22.4]),
    },
  ],
};

/** Échelle de dureté (°f), utilisée par le volet Dureté. */
export const ECHELLE_DURETE = [
  { libelle: "Très douce", plage: "moins de 7 °f", max: 7 },
  { libelle: "Douce", plage: "7 à 15 °f", max: 15 },
  { libelle: "Moyennement dure", plage: "15 à 25 °f", max: 25 },
  { libelle: "Dure", plage: "25 à 42 °f", max: 42 },
  { libelle: "Très dure", plage: "plus de 42 °f", max: Infinity },
];

function generer(definition: Definition, codeUdi: string): Parametre {
  const id = identifiant(definition.nom);
  const hasard = aleatoire(`${codeUdi}-${id}`);
  const { typique, limite } = definition;
  const valeurs = DATES_PRELEVEMENTS.map(() => {
    if (typique === 0) return 0;
    const v = typique * (0.6 + hasard() * 0.8);
    // Valeurs « à surveiller » : quelques paramètres approchent la limite (sans la dépasser).
    return limite !== undefined && v > limite * 0.95 ? limite * 0.9 : v;
  });
  const precision = typique >= 10 ? 1 : typique >= 1 ? 2 : 3;
  return {
    id,
    nom: definition.nom,
    groupe: definition.groupe,
    famille: definition.famille,
    nbSubstances: definition.nbSubstances,
    description: definition.description,
    indicateurs: [
      {
        id,
        nom: definition.nom,
        unite: definition.unite,
        limite,
        description: definition.description,
        mesures: serie(valeurs.map((v) => Number(v.toFixed(precision)))),
      },
    ],
  };
}

const cache = new Map<string, Parametre[]>();

/** Tous les paramètres analysés pour une UDI. */
export function parametresDeLUdi(codeUdi: string): Parametre[] {
  const enCache = cache.get(codeUdi);
  if (enCache) return enCache;
  const generes = DEFINITIONS.map((definition) => generer(definition, codeUdi));
  // Un paramètre « à surveiller » par UDI, choisi de façon déterministe parmi ceux qui ont une limite.
  const candidats = generes.filter((p) => p.indicateurs[0].limite);
  const surveille = candidats[Math.floor(aleatoire(codeUdi)() * candidats.length)];
  const mesures = surveille.indicateurs[0].mesures;
  mesures[mesures.length - 1] = { ...mesures[mesures.length - 1], valeur: Number(((surveille.indicateurs[0].limite ?? 0) * 0.85).toPrecision(2)) };
  const parametres = [PESTICIDES, ...generes, DURETE];
  cache.set(codeUdi, parametres);
  return parametres;
}

export function parametre(codeUdi: string, idParametre: string) {
  return parametresDeLUdi(codeUdi).find((p) => p.id === idParametre);
}

const derniere = (indicateur: Indicateur) => indicateur.mesures[indicateur.mesures.length - 1];

export function depasse(indicateur: Indicateur, mesure: Mesure) {
  return indicateur.limite !== undefined && mesure.valeur > indicateur.limite;
}

/** État d'un paramètre d'après son dernier prélèvement. */
export function etatParametre(parametre: Parametre): EtatParametre {
  if (parametre.indicateurs.some((indicateur) => depasse(indicateur, derniere(indicateur)))) return "depassement";
  const proche = parametre.indicateurs.some(
    (indicateur) => indicateur.limite !== undefined && indicateur.limite > 0 && derniere(indicateur).valeur >= indicateur.limite * 0.8,
  );
  return proche ? "surveiller" : "conforme";
}

export const FAMILLES = ["Nitrates", "Pesticides", "PFAS", "Dureté", "Chlore", "Plomb", "Bactéries", "Métaux"];

/** Format français : virgule décimale. */
export function formaterValeur(valeur: number) {
  return valeur.toLocaleString("fr-FR", { maximumFractionDigits: 3 });
}

export function formaterDate(dateIso: string, format: "court" | "long" = "court") {
  const date = new Date(`${dateIso}T12:00:00`);
  return format === "long"
    ? date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : date.toLocaleDateString("fr-FR");
}
