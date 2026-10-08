/**
 * Résultats d'analyses du prototype (données fictives).
 * Pesticides et Dureté reprennent les valeurs des maquettes ; les autres paramètres sont générés
 * de façon déterministe à partir du code de l'UDI, pour que chaque secteur ait ses propres valeurs.
 */

export type Groupe = "sanitaire" | "reference" | "caracteristique" | "radioactivite" | "surveillance";

/** Filtres « Paramètres » du volet Analyses (maquette). */
export const FILTRES = ["Nitrates", "Pesticides", "PFAS", "Dureté", "Goût", "Odeur", "Couleur", "Chlore"] as const;
export type Filtre = (typeof FILTRES)[number];

export type EtatParametre = "depassement" | "surveiller" | "conforme";

export type Mesure = { date: string; valeur: number };

export type Indicateur = {
  id: string;
  nom: string;
  unite: string;
  /** Seuil (valeur maximale), absent pour les paramètres sans seuil. */
  limite?: number;
  /** Nature du seuil : limite réglementaire (défaut), référence de qualité ou valeur indicative. */
  seuil?: "limite" | "reference" | "indicative";
  description: string;
  mesures: Mesure[];
};

export type Parametre = {
  id: string;
  nom: string;
  groupe: Groupe;
  filtres?: Filtre[];
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
  {
    id: "surveillance",
    titre: "Paramètres sous surveillance",
    aide: "Substances émergentes suivies par précaution (liste de vigilance européenne), avec une valeur indicative et non une limite réglementaire.",
  },
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
  /** Filtres « Paramètres » du volet Analyses qui retiennent ce paramètre. */
  filtres?: Filtre[];
  unite: string;
  limite?: number;
  /** Valeur typique, autour de laquelle les mesures sont générées. */
  typique: number;
  description: string;
  nbSubstances?: number;
};

// Liste et groupes repris de la maquette « Détails des analyses » (maquettes/modale-detail-analyses.pdf).
// Limites, références de qualité et valeurs indicatives : ordres de grandeur réglementaires, valeurs mesurées fictives.
const DEFINITIONS: Definition[] = [
  { nom: "Bactériologie", groupe: "sanitaire", unite: "n/100 mL", limite: 0, typique: 0, nbSubstances: 2, description: "Recherche d’Escherichia coli et d’entérocoques, bactéries indicatrices d’une contamination fécale." },
  { nom: "PFAS", groupe: "sanitaire", filtres: ["PFAS"], unite: "µg/L", limite: 0.1, typique: 0.03, nbSubstances: 20, description: "Somme de 20 substances perfluoroalkylées, très persistantes dans l’environnement." },
  { nom: "Nitrates", groupe: "sanitaire", filtres: ["Nitrates"], unite: "mg/L", limite: 50, typique: 18, description: "Issus principalement des engrais agricoles et des rejets d’eaux usées." },
  { nom: "Nitrites", groupe: "sanitaire", filtres: ["Nitrates"], unite: "mg/L", limite: 0.5, typique: 0.02, description: "Forme intermédiaire de l’azote, surveillée en sortie de traitement." },
  { nom: "Nitrates/50 + Nitrites/3", groupe: "sanitaire", filtres: ["Nitrates"], unite: "sans unité", limite: 1, typique: 0.4, nbSubstances: 2, description: "Indicateur combinant nitrates et nitrites, qui doit rester inférieur à 1." },
  { nom: "Plomb", groupe: "sanitaire", unite: "µg/L", limite: 10, typique: 1.5, description: "Provient surtout des anciennes canalisations en plomb." },
  { nom: "Fluorures", groupe: "sanitaire", unite: "mg/L", limite: 1.5, typique: 0.2, description: "Présents naturellement dans certaines eaux souterraines." },
  { nom: "Turbidité", groupe: "sanitaire", unite: "NFU", limite: 1, typique: 0.2, description: "Mesure de la limpidité de l’eau en sortie de traitement." },
  { nom: "Trihalométhanes (THM4)", groupe: "sanitaire", unite: "µg/L", limite: 100, typique: 15, nbSubstances: 4, description: "Sous-produits de la chloration de l’eau." },
  { nom: "1,2-dichloroéthane", groupe: "sanitaire", unite: "µg/L", limite: 3, typique: 0.1, description: "Solvant chloré d’origine industrielle." },
  { nom: "AHA (acides haloacétiques)", groupe: "sanitaire", unite: "µg/L", limite: 60, typique: 5, nbSubstances: 5, description: "Sous-produits de la désinfection de l’eau." },
  { nom: "Acrylamide", groupe: "sanitaire", unite: "µg/L", limite: 0.1, typique: 0.01, description: "Résidu possible de produits de traitement de l’eau." },
  { nom: "Antimoine", groupe: "sanitaire", unite: "µg/L", limite: 10, typique: 0.5, description: "Peut provenir de certains matériaux au contact de l’eau." },
  { nom: "Arsenic", groupe: "sanitaire", unite: "µg/L", limite: 10, typique: 2, description: "Élément naturellement présent dans certains sols." },
  { nom: "Benzo(a)pyrène", groupe: "sanitaire", unite: "µg/L", limite: 0.01, typique: 0.001, description: "Hydrocarbure issu de combustions incomplètes." },
  { nom: "Benzène", groupe: "sanitaire", unite: "µg/L", limite: 1, typique: 0.05, description: "Composé organique d’origine industrielle." },
  { nom: "Bisphénol A", groupe: "sanitaire", unite: "µg/L", limite: 2.5, typique: 0.05, description: "Perturbateur endocrinien pouvant migrer depuis certains matériaux." },
  { nom: "Bore", groupe: "sanitaire", unite: "mg/L", limite: 1.5, typique: 0.05, description: "Élément d’origine naturelle ou issu de détergents." },
  { nom: "Bromates", groupe: "sanitaire", unite: "µg/L", limite: 10, typique: 2, description: "Sous-produits de la désinfection de l’eau par l’ozone." },
  { nom: "Cadmium", groupe: "sanitaire", unite: "µg/L", limite: 5, typique: 0.2, description: "Métal pouvant provenir de rejets industriels." },
  { nom: "Chlorates", groupe: "sanitaire", filtres: ["Chlore"], unite: "µg/L", limite: 250, typique: 30, description: "Sous-produits de la désinfection au dioxyde de chlore." },
  { nom: "Chlorites", groupe: "sanitaire", filtres: ["Chlore"], unite: "µg/L", limite: 250, typique: 20, description: "Sous-produits de la désinfection au dioxyde de chlore." },
  { nom: "Chlorure de vinyle", groupe: "sanitaire", unite: "µg/L", limite: 0.5, typique: 0.05, description: "Peut migrer depuis certaines anciennes canalisations en PVC." },
  { nom: "Chrome total et hexavalent", groupe: "sanitaire", unite: "µg/L", limite: 25, typique: 1, nbSubstances: 2, description: "Métal d’origine naturelle ou industrielle." },
  { nom: "Cuivre", groupe: "sanitaire", unite: "mg/L", limite: 2, typique: 0.05, description: "Provient principalement des canalisations intérieures en cuivre." },
  { nom: "Cyanures totaux", groupe: "sanitaire", unite: "µg/L", limite: 50, typique: 2, description: "Composés pouvant provenir de rejets industriels." },
  { nom: "HAP (HPAT4)", groupe: "sanitaire", unite: "µg/L", limite: 0.1, typique: 0.005, nbSubstances: 4, description: "Hydrocarbures aromatiques polycycliques, issus de combustions incomplètes." },
  { nom: "Mercure", groupe: "sanitaire", unite: "µg/L", limite: 1, typique: 0.05, description: "Métal toxique, rarement détecté dans l’eau du robinet." },
  { nom: "Microcystines totales", groupe: "sanitaire", unite: "µg/L", limite: 1, typique: 0.05, description: "Toxines produites par certaines cyanobactéries." },
  { nom: "Nickel", groupe: "sanitaire", unite: "µg/L", limite: 20, typique: 2, description: "Peut provenir de la robinetterie." },
  { nom: "Sélénium", groupe: "sanitaire", unite: "µg/L", limite: 20, typique: 1, description: "Élément présent naturellement dans certaines nappes." },
  { nom: "Tri + tétrachloroéthylène", groupe: "sanitaire", unite: "µg/L", limite: 10, typique: 0.5, nbSubstances: 2, description: "Solvants chlorés d’origine industrielle." },
  { nom: "Uranium", groupe: "sanitaire", unite: "µg/L", limite: 30, typique: 1, description: "Élément radioactif naturel présent dans certaines roches." },
  { nom: "Épichlorhydrine", groupe: "sanitaire", unite: "µg/L", limite: 0.1, typique: 0.01, description: "Résidu possible de certains revêtements de canalisations." },

  { nom: "Chlore libre", groupe: "reference", filtres: ["Chlore"], unite: "mg/L", typique: 0.2, description: "Désinfectant résiduel garantissant la qualité de l’eau jusqu’au robinet." },
  { nom: "Saveur", groupe: "reference", filtres: ["Goût", "Odeur"], unite: "taux de dilution", limite: 3, typique: 1, description: "Goût et odeur de l’eau, évalués par un panel (taux de dilution avant disparition)." },
  { nom: "Aluminium total", groupe: "reference", unite: "µg/L", limite: 200, typique: 20, description: "Peut provenir des produits de traitement de l’eau." },
  { nom: "Ammonium", groupe: "reference", unite: "mg/L", limite: 0.1, typique: 0.02, description: "Indicateur d’une pollution organique." },
  { nom: "Aspect", groupe: "reference", filtres: ["Couleur"], unite: "classe (0 = normal)", typique: 0, description: "Examen visuel de l’eau : limpidité, présence de particules." },
  { nom: "Bactéries coliformes", groupe: "reference", unite: "n/100 mL", limite: 0, typique: 0, description: "Indicateur de l’efficacité du traitement." },
  { nom: "Bactéries et spores sulfito-réductrices", groupe: "reference", unite: "n/100 mL", limite: 0, typique: 0, description: "Indicateur de l’efficacité de la filtration." },
  { nom: "Baryum", groupe: "reference", unite: "mg/L", limite: 0.7, typique: 0.05, description: "Élément d’origine naturelle." },
  { nom: "Carbone organique total", groupe: "reference", unite: "mg/L", limite: 2, typique: 1, description: "Quantité de matière organique dans l’eau." },
  { nom: "Chlore total", groupe: "reference", filtres: ["Chlore"], unite: "mg/L", typique: 0.3, description: "Chlore libre et chlore combiné." },
  { nom: "Chlorures", groupe: "reference", unite: "mg/L", limite: 250, typique: 40, description: "Sels minéraux donnant un goût salé au-delà d’un certain seuil." },
  { nom: "Couleur", groupe: "reference", filtres: ["Couleur"], unite: "mg/L Pt", limite: 15, typique: 2, description: "Coloration de l’eau, souvent liée à la matière organique." },
  { nom: "Fer total", groupe: "reference", unite: "µg/L", limite: 200, typique: 15, description: "Peut colorer l’eau et provenir des canalisations." },
  { nom: "Germes revivifiables à 22 °C", groupe: "reference", unite: "n/mL", typique: 3, description: "Flore bactérienne générale de l’eau." },
  { nom: "Germes revivifiables à 36 °C", groupe: "reference", unite: "n/mL", typique: 1, description: "Flore bactérienne générale de l’eau." },
  { nom: "Manganèse total", groupe: "reference", unite: "µg/L", limite: 50, typique: 3, description: "Élément naturel pouvant colorer l’eau." },

  { nom: "Calcium", groupe: "caracteristique", filtres: ["Dureté"], unite: "mg/L", typique: 105, description: "Principal responsable du calcaire." },
  { nom: "Conductivité à 25 °C", groupe: "caracteristique", unite: "µS/cm", limite: 1100, typique: 620, description: "Mesure de la minéralisation de l’eau." },
  { nom: "Magnésium", groupe: "caracteristique", filtres: ["Dureté"], unite: "mg/L", typique: 9, description: "Minéral contribuant à la dureté de l’eau." },
  { nom: "Sodium", groupe: "caracteristique", unite: "mg/L", limite: 200, typique: 22, description: "Sel minéral naturellement présent dans l’eau." },
  { nom: "Température de l’eau", groupe: "caracteristique", unite: "°C", limite: 25, typique: 14, description: "Température mesurée au moment du prélèvement." },
  { nom: "Titre alcalimétrique complet (TAC)", groupe: "caracteristique", filtres: ["Dureté"], unite: "°f", typique: 24, description: "Teneur en bicarbonates, liée au pouvoir tampon de l’eau." },
  { nom: "pH", groupe: "caracteristique", unite: "unité pH", typique: 7.4, description: "Mesure de l’acidité de l’eau (entre 6,5 et 9 pour une eau de bonne qualité)." },
  { nom: "Équilibre calcocarbonique", groupe: "caracteristique", filtres: ["Dureté"], unite: "indice de saturation", typique: 0.1, description: "Indique si l’eau est entartrante ou agressive pour les canalisations." },

  { nom: "Tritium", groupe: "radioactivite", unite: "Bq/L", limite: 100, typique: 5, description: "Isotope radioactif de l’hydrogène." },
  { nom: "Activité alpha globale", groupe: "radioactivite", unite: "Bq/L", limite: 0.1, typique: 0.03, description: "Indicateur de radioactivité naturelle." },
  { nom: "Activité bêta globale", groupe: "radioactivite", unite: "Bq/L", limite: 1, typique: 0.1, description: "Indicateur de radioactivité." },
  { nom: "Dose indicative", groupe: "radioactivite", unite: "mSv/an", limite: 0.1, typique: 0.01, description: "Exposition annuelle estimée liée à la consommation de l’eau." },
  { nom: "Radionucléides", groupe: "radioactivite", unite: "Bq/L", typique: 0.05, description: "Recherche de radionucléides spécifiques lorsque les indicateurs globaux sont élevés." },
  { nom: "Radon", groupe: "radioactivite", unite: "Bq/L", limite: 100, typique: 15, description: "Gaz radioactif naturel, présent dans certaines eaux souterraines (valeur de référence : 100 Bq/L)." },

  { nom: "Perchlorates", groupe: "surveillance", unite: "µg/L", limite: 15, typique: 2, description: "Ions d’origine industrielle ou militaire, suivis par précaution." },
  { nom: "17-bêta-estradiol", groupe: "surveillance", unite: "ng/L", limite: 1, typique: 0.1, description: "Hormone, perturbateur endocrinien inscrit sur la liste de vigilance européenne (valeur indicative : 1 ng/L)." },
  { nom: "Nonylphénol", groupe: "surveillance", unite: "ng/L", limite: 300, typique: 20, description: "Perturbateur endocrinien inscrit sur la liste de vigilance européenne (valeur indicative : 300 ng/L)." },
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
  filtres: ["Pesticides"],
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
  filtres: ["Dureté"],
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
    filtres: definition.filtres,
    nbSubstances: definition.nbSubstances,
    description: definition.description,
    indicateurs: [
      {
        id,
        nom: definition.nom,
        unite: definition.unite,
        limite,
        seuil: definition.groupe === "sanitaire" ? "limite" : definition.groupe === "surveillance" ? "indicative" : "reference",
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
  // Ordre de la maquette : Pesticides en tête des paramètres sanitaires, Dureté en tête des caractéristiques.
  const indexCalcium = generes.findIndex((p) => p.id === "calcium");
  const parametres = [PESTICIDES, ...generes.slice(0, indexCalcium), DURETE, ...generes.slice(indexCalcium)];
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
