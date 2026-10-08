import { useId, useMemo, useRef, useState } from "react";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Tag } from "@codegouvfr/react-dsfr/Tag";
import { BadgeEtat } from "./BadgeEtat";
import { Tooltip } from "@codegouvfr/react-dsfr/Tooltip";
import { ButtonsGroup } from "@codegouvfr/react-dsfr/ButtonsGroup";
import { fr } from "@codegouvfr/react-dsfr";
import { NoteQualite } from "./NoteQualite";
import { useVolets } from "../lib/contexteVolets";
import { etatParametre, FILTRES, GROUPES, parametresDeLUdi, type EtatParametre, type Filtre } from "../lib/analyses";
import { normaliser } from "../lib/recherche";

type FiltreEtat = "tous" | Exclude<EtatParametre, "conforme">;

/** Volet « Détails des analyses » : recherche en direct, filtres État et Paramètres cumulables, liste des paramètres. */
export function VoletAnalyses({ codeUdi }: { codeUdi: string }) {
  const id = useId();
  const { empiler } = useVolets();
  const champ = useRef<HTMLInputElement>(null);
  const [recherche, setRecherche] = useState("");
  const [filtreEtat, setFiltreEtat] = useState<FiltreEtat>("tous");
  const [filtres, setFiltres] = useState<Filtre[]>([]);

  const parametres = useMemo(
    () => parametresDeLUdi(codeUdi).map((parametre) => ({ parametre, etat: etatParametre(parametre) })),
    [codeUdi],
  );
  const nbParEtat = (etat: EtatParametre) => parametres.filter((p) => p.etat === etat).length;

  const resultats = parametres.filter(
    ({ parametre, etat }) =>
      (recherche === "" || normaliser(parametre.nom).includes(normaliser(recherche))) &&
      (filtreEtat === "tous" || etat === filtreEtat) &&
      (filtres.length === 0 || filtres.some((filtre) => parametre.filtres?.includes(filtre))),
  );

  const basculerFiltre = (filtre: Filtre) =>
    setFiltres((f) => (f.includes(filtre) ? f.filter((x) => x !== filtre) : [...f, filtre]));

  return (
    <>
      <h2 className={fr.cx("fr-h6", "fr-mb-2w")}>Qualité globale de l’eau</h2>
      <section className="bloc-indicateur fr-p-3w fr-mb-2w" aria-labelledby={`${id}-bilan`}>
        <h3 id={`${id}-bilan`} className={fr.cx("fr-text--lg", "fr-text--bold", "fr-mb-0")}>
          Bilan 2025
        </h3>
        <p className={fr.cx("fr-text--sm", "fr-mb-2w")}>Basé sur 12 prélèvements (janv.-déc. 2025)</p>
        <NoteQualite note="A" libelle="Eau de bonne qualité" />
        <p className={fr.cx("fr-text--sm", "fr-mb-0")}>
          L’eau distribuée est de bonne qualité et respecte les exigences sanitaires. Elle peut être consommée et utilisée
          normalement, sans restriction.
        </p>
      </section>
      <ButtonsGroup
        buttons={[
          {
            children: "Télécharger un bilan",
            priority: "secondary",
            iconId: "fr-icon-download-line",
            linkProps: {
              href: `${import.meta.env.BASE_URL}documents/bilan-2025.pdf`,
              download: "bilan-qualite-eau-2025.pdf",
              title: "Télécharger le bilan 2025 (PDF)",
            },
          },
        ]}
      />
      <hr className={fr.cx("fr-mt-1w", "fr-pb-3w")} />

      <h2 className={fr.cx("fr-h6", "fr-mb-2w")}>Rechercher les derniers résultats d’un paramètre</h2>
      <Input
        label="Nom du paramètre"
        hideLabel
        nativeInputProps={{
          ref: champ,
          type: "search",
          value: recherche,
          placeholder: "Recherche",
          onChange: (e) => setRecherche(e.target.value),
        }}
        // Le filtrage est instantané : le bouton (présent sur la maquette) remet le focus dans le champ.
        addon={<Button iconId="fr-icon-search-line" title="Rechercher" type="button" onClick={() => champ.current?.focus()} />}
      />

      <p id={`${id}-etat`} className={`${fr.cx("fr-text--sm", "fr-mb-1w")} fr-text-mention--grey`}>
        État
      </p>
      <ul className={fr.cx("fr-tags-group")} role="group" aria-labelledby={`${id}-etat`}>
        {(
          [
            ["tous", `Tous (${parametres.length})`],
            ["depassement", `Dépassement de limite (${nbParEtat("depassement")})`],
            ["surveiller", `À surveiller (${nbParEtat("surveiller")})`],
          ] as [FiltreEtat, string][]
        ).map(([valeur, libelle]) => (
          <li key={valeur}>
            <Tag small pressed={filtreEtat === valeur} nativeButtonProps={{ onClick: () => setFiltreEtat(valeur) }}>
              {libelle}
            </Tag>
          </li>
        ))}
      </ul>
      <hr className={fr.cx("fr-pb-2w")} />

      <p id={`${id}-parametres`} className={`${fr.cx("fr-text--sm", "fr-mb-1w")} fr-text-mention--grey`}>
        Paramètres
      </p>
      <ul className={fr.cx("fr-tags-group")} role="group" aria-labelledby={`${id}-parametres`}>
        {FILTRES.map((filtre) => (
          <li key={filtre}>
            <Tag small pressed={filtres.includes(filtre)} nativeButtonProps={{ onClick: () => basculerFiltre(filtre) }}>
              {filtre}
            </Tag>
          </li>
        ))}
      </ul>

      <p className={fr.cx("fr-text--bold", "fr-mt-1w")} role="status">
        {resultats.length} résultat{resultats.length > 1 ? "s" : ""}
      </p>

      {resultats.length === 0 && <p>Aucun paramètre ne correspond à votre recherche.</p>}

      {GROUPES.map((groupe) => {
        const lignes = resultats.filter(({ parametre }) => parametre.groupe === groupe.id);
        if (lignes.length === 0) return null;
        return (
          <section key={groupe.id} className="groupe-parametres fr-mb-3w" aria-labelledby={`${id}-${groupe.id}`}>
            <div className="groupe-parametres__titre fr-py-3v fr-px-2w">
              <h3 id={`${id}-${groupe.id}`} className={fr.cx("fr-text--sm", "fr-text--bold", "fr-mb-0")}>
                {groupe.titre}
              </h3>
              <Tooltip kind="hover" title={groupe.aide} />
            </div>
            <ul className={fr.cx("fr-raw-list")}>
              {lignes.map(({ parametre, etat }) => {
                const idLigne = `parametre-${parametre.id}`;
                return (
                  <li key={parametre.id}>
                    <button
                      type="button"
                      id={idLigne}
                      className="ligne-parametre"
                      onClick={() => empiler({ type: "parametre", id: parametre.id }, idLigne)}
                    >
                      <span className="ligne-parametre__texte fr-text--sm fr-mb-0">
                        <span>
                          {parametre.nom}
                          {parametre.nbSubstances && parametre.nbSubstances > 1 && (
                            <span className="fr-text-mention--grey"> ({parametre.nbSubstances} paramètres)</span>
                          )}
                        </span>
                        {/* Dans la liste, seuls les paramètres à surveiller ou en dépassement ont un badge, sans icône. */}
                        {etat !== "conforme" && <BadgeEtat etat={etat} sansIcone />}
                      </span>
                      <span className={fr.cx("fr-icon-arrow-right-line")} aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </>
  );
}
