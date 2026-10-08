import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SegmentedControl } from "@codegouvfr/react-dsfr/SegmentedControl";
import { ButtonsGroup } from "@codegouvfr/react-dsfr/ButtonsGroup";
import { fr, type FrIconClassName } from "@codegouvfr/react-dsfr";
import { ChampSuggestions } from "./ChampSuggestions";
import {
  chercherCommunes,
  chercherLieuxBaignade,
  COMMUNES_AVEC_DONNEES,
  type Suggestion,
  type TypeEau,
} from "../lib/recherche";

const CHAMP_PAR_TYPE = {
  potable: {
    label: "Rechercher une adresse ou une commune",
    placeholder: "Adresse, commune…",
    chercher: chercherCommunes,
  },
  baignade: {
    label: "Rechercher un lieu de baignade",
    placeholder: "Plage, lac, rivière, commune…",
    chercher: chercherLieuxBaignade,
  },
} as const;

/** Icône custom (pas d'équivalent DSFR, cf. NOTES.md), déclarée dans styles/app.css. */
const ICONE_BAIGNADE = "fr-icon-pool-line" as FrIconClassName;

export function RechercheLieu() {
  const navigate = useNavigate();
  const [typeEau, setTypeEau] = useState<TypeEau>("potable");
  const [message, setMessage] = useState<string>();
  const champ = CHAMP_PAR_TYPE[typeEau];

  function onSelection(suggestion: Suggestion) {
    if (typeEau === "baignade") {
      setMessage(`Le parcours baignade n’est pas encore disponible dans ce prototype (${suggestion.libelle}).`);
    } else if (COMMUNES_AVEC_DONNEES.includes(suggestion.id)) {
      navigate(`/commune/${suggestion.id}`);
    } else {
      setMessage(`Les données de ${suggestion.libelle} ne sont pas disponibles dans ce prototype. Essayez avec Lille.`);
    }
  }

  return (
    <div className="bloc-recherche fr-p-3w">
      <h2 className={fr.cx("fr-h4")}>Rechercher un lieu</h2>
      <SegmentedControl
        legend="Type d’eau"
        name="type-eau"
        className={fr.cx("fr-mb-3w")}
        segments={[
          {
            label: "Eau potable",
            iconId: "fr-icon-drop-line",
            nativeInputProps: {
              value: "potable",
              checked: typeEau === "potable",
              onChange: () => {
                setTypeEau("potable");
                setMessage(undefined);
              },
            },
          },
          {
            label: "Baignade",
            iconId: ICONE_BAIGNADE,
            nativeInputProps: {
              value: "baignade",
              checked: typeEau === "baignade",
              onChange: () => {
                setTypeEau("baignade");
                setMessage(undefined);
              },
            },
          },
        ]}
      />
      <ChampSuggestions
        // Nouveau champ (saisie vidée) à chaque changement de type d'eau.
        key={typeEau}
        label={champ.label}
        placeholder={champ.placeholder}
        chercher={champ.chercher}
        onSelection={onSelection}
        onSaisie={() => setMessage(undefined)}
        message={message ? { etat: "info", texte: message } : undefined}
      />
      <p className={fr.cx("fr-hr-or", "fr-my-3w")}>ou</p>
      <ButtonsGroup
        buttons={[
          {
            children: "Explorer sur la carte",
            priority: "secondary",
            iconId: "fr-icon-road-map-line",
            linkProps: { to: `/carte?type=${typeEau}` },
          },
        ]}
      />
    </div>
  );
}
