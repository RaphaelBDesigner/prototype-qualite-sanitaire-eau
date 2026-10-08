import { fr } from "@codegouvfr/react-dsfr";
import { LIBELLES_NOTES, type Note } from "../lib/analyses";

const NOTES: Note[] = ["A", "B", "C", "D"];

/** Note de qualité A à D (pas d'équivalent DSFR, cf. NOTES.md). */
export function NoteQualite({ note, libelle = LIBELLES_NOTES[note] }: { note: Note; libelle?: string }) {
  return (
    <p className={fr.cx("fr-mb-1w")}>
      <span className="note-qualite" aria-hidden="true">
        {NOTES.map((n) => (
          <span key={n} className={`note-qualite__lettre note-qualite__lettre--${n.toLowerCase()}${n === note ? " note-qualite__lettre--active" : ""}`}>
            {n}
          </span>
        ))}
      </span>
      <span className={fr.cx("fr-sr-only")}>Note {note} sur une échelle de A à D : </span>
      <span className="note-qualite__libelle">{libelle}</span>
    </p>
  );
}
