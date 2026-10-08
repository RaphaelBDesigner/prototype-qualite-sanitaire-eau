import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { ToggleSwitch } from "@codegouvfr/react-dsfr/ToggleSwitch";
import { fr } from "@codegouvfr/react-dsfr";
import { FONDS, urlVignette, type FondCarte } from "../lib/carte";

type Props = {
  id: string;
  fond: FondCarte;
  onFondChange: (fond: FondCarte) => void;
  limites: boolean;
  onLimitesChange: (limites: boolean) => void;
};

/** Panneau « Fond de carte » : boutons radio riches DSFR et interrupteur des limites administratives. */
export function PanneauFondCarte({ id, fond, onFondChange, limites, onLimitesChange }: Props) {
  return (
    <div id={id} className="panneau-fond-carte fr-p-3w" role="group" aria-label="Réglages de la carte">
      <RadioButtons
        legend={<span className={fr.cx("fr-text--bold")}>Fond de carte</span>}
        name="fond-carte"
        options={(Object.keys(FONDS) as FondCarte[]).map((cle) => ({
          label: FONDS[cle].libelle,
          hintText: "IGN",
          illustration: <img src={urlVignette(cle)} alt="" />,
          nativeInputProps: { checked: fond === cle, onChange: () => onFondChange(cle) },
        }))}
      />
      <hr className={fr.cx("fr-pb-2w")} />
      <ToggleSwitch
        label="Limites administratives"
        inputTitle="Afficher les limites administratives"
        checked={limites}
        onChange={onLimitesChange}
        showCheckedHint={false}
        labelPosition="left"
      />
    </div>
  );
}
