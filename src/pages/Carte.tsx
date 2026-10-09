import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CircleMarker } from "react-leaflet";
import type { Map as CarteLeaflet } from "leaflet";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { fr } from "@codegouvfr/react-dsfr";
import { EcranCarte } from "../components/EcranCarte";
import { CarteIgn } from "../components/CarteIgn";
import { BasculeTypeEau } from "../components/BasculeTypeEau";
import { RechercheCarte } from "../components/RechercheCarte";
import { ZonesSecteurs } from "../components/ZonesSecteurs";
import { LegendeZone } from "../components/LegendeZone";
import { TOUS_LES_SECTEURS } from "../lib/secteurs";
import { VUE_FRANCE } from "../lib/carte";
import type { TypeEau } from "../lib/recherche";

/** Zoom à partir duquel les secteurs de distribution s'affichent (une ville et ses alentours). */
const ZOOM_SECTEURS = 11;

export function Carte() {
  const [parametres, setParametres] = useSearchParams();
  const typeEau: TypeEau = parametres.get("type") === "baignade" ? "baignade" : "potable";
  const [carte, setCarte] = useState<CarteLeaflet>();
  const [zoom, setZoom] = useState(VUE_FRANCE.zoom);
  const [position, setPosition] = useState<[number, number]>();
  const secteursVisibles = typeEau === "potable" && zoom >= ZOOM_SECTEURS;

  useEffect(() => {
    if (!carte) return;
    const suivreZoom = () => setZoom(carte.getZoom());
    suivreZoom();
    carte.on("zoomend", suivreZoom);
    return () => {
      carte.off("zoomend", suivreZoom);
    };
  }, [carte]);

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
          <CarteIgn onPrete={setCarte} surCarte={secteursVisibles && <LegendeZone aGauche />}>
            {secteursVisibles && <ZonesSecteurs secteurs={TOUS_LES_SECTEURS} />}
            {position && <CircleMarker center={position} radius={8} className="carte-ign__position" />}
          </CarteIgn>
        }
        panneau={
          typeEau === "potable" ? (
            <>
              <p className={fr.cx("fr-message", "fr-message--info", "fr-mb-2w")} aria-live="polite">
                {secteursVisibles
                  ? "Cliquez sur un secteur pour consulter la qualité de son eau."
                  : "Zoomez sur une ville pour afficher les secteurs de distribution."}
              </p>
              <RechercheCarte onLocalisation={onLocalisation} />
            </>
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
