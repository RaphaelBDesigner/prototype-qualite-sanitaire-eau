import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonsGroup } from "@codegouvfr/react-dsfr/ButtonsGroup";
import { fr } from "@codegouvfr/react-dsfr";
import { BasculeTypeEau } from "./BasculeTypeEau";
import { ChampSuggestions } from "./ChampSuggestions";
import {
  chercherCommunes,
  chercherLieuxBaignade,
  type Suggestion,
  type TypeEau,
} from "../lib/recherche";
import { COMMUNES_AVEC_DONNEES, NOMS_COMMUNES_AVEC_DONNEES, routeCommune } from "../lib/secteurs";

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

export function RechercheLieu() {
  const navigate = useNavigate();
  const [typeEau, setTypeEau] = useState<TypeEau>("potable");
  const [message, setMessage] = useState<string>();
  const champ = CHAMP_PAR_TYPE[typeEau];

  function onSelection(suggestion: Suggestion) {
    if (typeEau === "baignade") {
      setMessage(`Le parcours baignade n’est pas encore disponible dans ce prototype (${suggestion.libelle}).`);
    } else if (COMMUNES_AVEC_DONNEES.includes(suggestion.id)) {
      navigate(routeCommune(suggestion.id));
    } else {
      setMessage(`Les données de ${suggestion.libelle} ne sont pas disponibles dans ce prototype. Essayez avec ${NOMS_COMMUNES_AVEC_DONNEES}.`);
    }
  }

  return (
    <div className="bloc-recherche fr-p-3w">
      <h2 className={fr.cx("fr-h4")}>Rechercher un lieu</h2>
      <BasculeTypeEau
        valeur={typeEau}
        onChange={(type) => {
          setTypeEau(type);
          setMessage(undefined);
        }}
        className={fr.cx("fr-mb-3w")}
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
