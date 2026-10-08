import { createModal } from "@codegouvfr/react-dsfr/Modal";

/** Modales DSFR présentées en volets (cf. styles/app.css et NOTES.md). */
export const voletCalcaire = createModal({ id: "volet-calcaire", isOpenedByDefault: false });

/** Volets de la fiche du secteur : une seule modale dont le contenu suit une pile (cf. VoletsFiche). */
export const voletFiche = createModal({ id: "volet-fiche", isOpenedByDefault: false });
