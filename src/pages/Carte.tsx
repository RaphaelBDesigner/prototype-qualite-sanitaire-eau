import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CircleMarker } from "react-leaflet";
import type { Map as CarteLeaflet } from "leaflet";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { fr } from "@codegouvfr/react-dsfr";
import { EcranCarte } from "../components/EcranCarte";
import { CarteIgn } from "../components/CarteIgn";
import { BasculeTypeEau } from "../components/BasculeTypeEau";
import { RechercheCarte } from "../components/RechercheCarte";
import type { TypeEau } from "../lib/recherche";

export function Carte() {
  const [parametres, setParametres] = useSearchParams();
  const typeEau: TypeEau = parametres.get("type") === "baignade" ? "baignade" : "potable";
  const [carte, setCarte] = useState<CarteLeaflet>();
  const [position, setPosition] = useState<[number, number]>();

  const onLocalisation = useCallback(
    (lat: number, lon: number) => {
      setPosition([lat, lon]);
      carte?.setView([lat, lon], 13);
    },
    [carte],
  );

  return (
    <>
      <h1 className={fr.cx("fr-sr-only")}>Carte de la qualité de l’eau</h1>
      <EcranCarte
        entete={
          <div className={fr.cx("fr-container", "fr-py-2w")}>
            <BasculeTypeEau
              valeur={typeEau}
              masquerLegende
              onChange={(type) => setParametres({ type }, { replace: true })}
            />
          </div>
        }
        carte={
          <CarteIgn onPrete={setCarte}>
            {position && (
              <CircleMarker center={position} radius={8} className="carte-ign__position" />
            )}
          </CarteIgn>
        }
        panneau={
          typeEau === "potable" ? (
            <RechercheCarte onLocalisation={onLocalisation} />
          ) : (
            <Alert
              severity="info"
              title="Bientôt disponible"
              description="Les résultats des eaux de baignade seront bientôt consultables sur la carte."
            />
          )
        }
      />
    </>
  );
}
