import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonsGroup } from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { fr } from "@codegouvfr/react-dsfr";
import { ChampSuggestions } from "./ChampSuggestions";
import { chercherCommunes, COMMUNES_AVEC_DONNEES, type Suggestion } from "../lib/recherche";
import { communeContenant } from "../lib/secteurs";

type Props = {
  /** Appelé avec la position de l'utilisateur, pour centrer la carte et poser un marqueur. */
  onLocalisation: (lat: number, lon: number) => void;
};

type Message = { severite: "info" | "error"; texte: string };

/** Panneau de l'écran carte en eau potable : recherche de commune et géolocalisation. */
export function RechercheCarte({ onLocalisation }: Props) {
  const navigate = useNavigate();
  const [messageRecherche, setMessageRecherche] = useState<string>();
  const [messagePosition, setMessagePosition] = useState<Message>();
  const [localisationEnCours, setLocalisationEnCours] = useState(false);

  function onSelection(suggestion: Suggestion) {
    if (COMMUNES_AVEC_DONNEES.includes(suggestion.id)) navigate(`/commune/${suggestion.id}`);
    else setMessageRecherche(`Les données de ${suggestion.libelle} ne sont pas disponibles dans ce prototype. Essayez avec Lille.`);
  }

  function utiliserMaPosition() {
    setMessagePosition(undefined);
    if (!("geolocation" in navigator)) {
      setMessagePosition({ severite: "error", texte: "Votre navigateur ne permet pas la géolocalisation." });
      return;
    }
    setLocalisationEnCours(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocalisationEnCours(false);
        onLocalisation(coords.latitude, coords.longitude);
        const commune = communeContenant(coords.latitude, coords.longitude);
        if (commune) navigate(`/commune/${commune}`);
        else
          setMessagePosition({
            severite: "info",
            texte: "Les données de votre commune ne sont pas disponibles dans ce prototype. Essayez avec Lille.",
          });
      },
      (erreur) => {
        setLocalisationEnCours(false);
        setMessagePosition({
          severite: "error",
          texte:
            erreur.code === erreur.PERMISSION_DENIED
              ? "Vous avez refusé l’accès à votre position. Autorisez-le dans votre navigateur ou recherchez votre commune."
              : "Votre position n’a pas pu être déterminée. Recherchez votre commune.",
        });
      },
      { timeout: 10000 },
    );
  }

  return (
    <>
      <ChampSuggestions
        label="Rechercher une commune"
        masquerLibelle
        placeholder="Recherche"
        chercher={chercherCommunes}
        onSelection={onSelection}
        onSaisie={() => setMessageRecherche(undefined)}
        message={messageRecherche ? { etat: "info", texte: messageRecherche } : undefined}
      />
      <ButtonsGroup
        buttons={[
          {
            children: localisationEnCours ? "Localisation en cours…" : "Utiliser ma position",
            priority: "secondary",
            iconId: "fr-icon-focus-3-line",
            disabled: localisationEnCours,
            onClick: utiliserMaPosition,
          },
        ]}
      />
      <div role="status">
        {messagePosition && (
          <Alert
            small
            severity={messagePosition.severite}
            description={messagePosition.texte}
            className={fr.cx("fr-mt-1w")}
          />
        )}
      </div>
    </>
  );
}
