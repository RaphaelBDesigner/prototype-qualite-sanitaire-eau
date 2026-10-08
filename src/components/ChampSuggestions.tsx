import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { fr } from "@codegouvfr/react-dsfr";
import { normaliser, type Suggestion } from "../lib/recherche";

type Props = {
  label: ReactNode;
  /** Libellé lu par les lecteurs d’écran mais masqué à l’écran (barre de recherche). */
  masquerLibelle?: boolean;
  placeholder: string;
  chercher: (saisie: string) => Promise<Suggestion[]>;
  onSelection: (suggestion: Suggestion) => void;
  /** Message affiché sous le champ (état DSFR « info » ou « error »). */
  message?: { etat: "info" | "error"; texte: ReactNode };
  onSaisie?: () => void;
};

/**
 * Champ de recherche DSFR avec liste de suggestions.
 * Le DSFR n'ayant pas de composant d'autocomplétion, la liste suit le modèle ARIA « combobox »
 * (https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) : flèches, Entrée, Échap.
 */
export function ChampSuggestions({ label, masquerLibelle, placeholder, chercher, onSelection, message, onSaisie }: Props) {
  const id = useId();
  const idListe = `${id}-suggestions`;
  const [saisie, setSaisie] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [ouvert, setOuvert] = useState(false);
  const [indexActif, setIndexActif] = useState(-1);
  const [annonce, setAnnonce] = useState("");
  const [aucunResultat, setAucunResultat] = useState(false);
  const derniereRequete = useRef(0);

  // Relance la recherche quand la saisie ou la source (type d'eau) change.
  useEffect(() => {
    const requete = ++derniereRequete.current;
    if (normaliser(saisie).length < 2) {
      setSuggestions([]);
      setAnnonce("");
      return;
    }
    chercher(saisie).then((resultats) => {
      if (requete !== derniereRequete.current) return;
      setSuggestions(resultats);
      setIndexActif(-1);
      setAnnonce(
        resultats.length === 0
          ? "Aucune suggestion"
          : `${resultats.length} suggestion${resultats.length > 1 ? "s" : ""} disponible${resultats.length > 1 ? "s" : ""}, utilisez les flèches pour naviguer`,
      );
    });
  }, [saisie, chercher]);

  const listeVisible = ouvert && suggestions.length > 0;

  function selectionner(suggestion: Suggestion) {
    setSaisie(suggestion.libelle);
    setOuvert(false);
    setIndexActif(-1);
    setAucunResultat(false);
    onSelection(suggestion);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setOuvert(true);
        setIndexActif((index) => (suggestions.length === 0 ? -1 : (index + 1) % suggestions.length));
        break;
      case "ArrowUp":
        event.preventDefault();
        setOuvert(true);
        setIndexActif((index) => (suggestions.length === 0 ? -1 : (index <= 0 ? suggestions.length : index) - 1));
        break;
      case "Enter":
        if (listeVisible && indexActif >= 0) {
          event.preventDefault();
          selectionner(suggestions[indexActif]);
        }
        break;
      case "Escape":
        if (listeVisible) {
          event.preventDefault();
          setOuvert(false);
          setIndexActif(-1);
        } else {
          setSaisie("");
        }
        break;
    }
  }

  // Bouton loupe ou Entrée sans suggestion active : on retient la première suggestion.
  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (suggestions.length > 0) {
      selectionner(suggestions[0]);
    } else {
      setAucunResultat(normaliser(saisie).length > 0);
    }
  }

  const etat = aucunResultat
    ? { etat: "error" as const, texte: "Aucun lieu ne correspond à votre recherche. Vérifiez l’orthographe." }
    : message;

  return (
    <form role="search" onSubmit={onSubmit} className="champ-suggestions">
      <Input
        label={label}
        hideLabel={masquerLibelle}
        state={etat?.etat ?? "default"}
        stateRelatedMessage={etat?.texte}
        nativeInputProps={{
          id,
          type: "search",
          value: saisie,
          placeholder,
          autoComplete: "off",
          role: "combobox",
          "aria-autocomplete": "list",
          "aria-expanded": listeVisible,
          "aria-controls": idListe,
          "aria-activedescendant": listeVisible && indexActif >= 0 ? `${idListe}-${indexActif}` : undefined,
          onChange: (event) => {
            setSaisie(event.target.value);
            setOuvert(true);
            setAucunResultat(false);
            onSaisie?.();
          },
          onKeyDown,
          onFocus: () => setOuvert(true),
          onBlur: () => setOuvert(false),
        }}
        addon={<Button iconId="fr-icon-search-line" title="Rechercher" type="submit" />}
      />
      <ul
        id={idListe}
        role="listbox"
        aria-label="Suggestions"
        className="champ-suggestions__liste"
        hidden={!listeVisible}
        // Garde le focus dans le champ pendant le clic sur une suggestion.
        onMouseDown={(event) => event.preventDefault()}
      >
        {suggestions.map((suggestion, index) => (
          <li
            key={suggestion.id}
            id={`${idListe}-${index}`}
            role="option"
            aria-selected={index === indexActif}
            className="champ-suggestions__option"
            onClick={() => selectionner(suggestion)}
          >
            <span className={fr.cx("fr-text--md", "fr-mb-0")}>{suggestion.libelle}</span>
            <span className={fr.cx("fr-text--xs", "fr-mb-0")}>{suggestion.detail}</span>
          </li>
        ))}
      </ul>
      <p className={fr.cx("fr-sr-only")} role="status">
        {ouvert ? annonce : ""}
      </p>
    </form>
  );
}
