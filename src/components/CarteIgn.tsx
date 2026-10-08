import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import type { LatLngBoundsExpression, Map as CarteLeaflet } from "leaflet";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { PanneauFondCarte } from "./PanneauFondCarte";
import { ATTRIBUTION_IGN, FONDS, URL_LIMITES_ADMINISTRATIVES, VUE_FRANCE, type FondCarte } from "../lib/carte";
import "leaflet/dist/leaflet.css";

type Props = {
  /** Couches Leaflet (polygones, marqueurs…), rendues dans la carte. */
  children?: ReactNode;
  /** Éléments posés sur la carte (bouton retour, légende…). */
  surCarte?: ReactNode;
  /** Emprise à afficher au chargement ; à défaut, la France métropolitaine. */
  emprise?: LatLngBoundsExpression;
  onPrete?: (carte: CarteLeaflet) => void;
  /** Masque les boutons de zoom et de réglages (écran du choix du secteur, comme la maquette). */
  sansControles?: boolean;
  className?: string;
};

/**
 * Carte IGN (Leaflet + Géoplateforme). Le contrôle de zoom Leaflet est remplacé par des boutons DSFR ;
 * déplacement, double-clic, pincement et clavier restent ceux de Leaflet.
 */
export function CarteIgn({ children, surCarte, emprise, onPrete, sansControles, className }: Props) {
  const idPanneau = useId();
  const [carte, setCarte] = useState<CarteLeaflet | null>(null);
  const [fond, setFond] = useState<FondCarte>("plan");
  const [limites, setLimites] = useState(false);
  const [reglagesOuverts, setReglagesOuverts] = useState(false);
  const zoneReglages = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (carte) onPrete?.(carte);
  }, [carte, onPrete]);

  // Panneau des réglages : fermeture par Échap (focus rendu au bouton) et par clic en dehors.
  useEffect(() => {
    if (!reglagesOuverts) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setReglagesOuverts(false);
      zoneReglages.current?.querySelector<HTMLButtonElement>("button[aria-expanded]")?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!zoneReglages.current?.contains(event.target as Node)) setReglagesOuverts(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [reglagesOuverts]);

  return (
    <div className={["carte-ign", className].filter(Boolean).join(" ")}>
      <MapContainer
        ref={setCarte}
        className="carte-ign__carte"
        center={emprise ? undefined : VUE_FRANCE.centre}
        zoom={emprise ? undefined : VUE_FRANCE.zoom}
        bounds={emprise}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer key={fond} url={FONDS[fond].url} attribution={ATTRIBUTION_IGN} maxZoom={19} />
        {limites && <TileLayer url={URL_LIMITES_ADMINISTRATIVES} opacity={0.8} maxZoom={19} />}
        {children}
      </MapContainer>
      {/* Attribution obligatoire, hors du contrôle Leaflet pour garder la typographie DSFR. */}
      <p className="carte-ign__attribution fr-text--xs fr-mb-0">{ATTRIBUTION_IGN}</p>
      {!sansControles && (
        <div className="carte-ign__controles">
          <div className="carte-ign__zoom">
            <Button iconId="fr-icon-add-line" priority="tertiary" title="Zoomer" onClick={() => carte?.zoomIn()} />
            <Button iconId="fr-icon-subtract-line" priority="tertiary" title="Dézoomer" onClick={() => carte?.zoomOut()} />
          </div>
          <div ref={zoneReglages} className="carte-ign__reglages">
            <Button
              iconId="fr-icon-equalizer-line"
              priority="tertiary"
              title="Réglages de la carte"
              nativeButtonProps={{ "aria-expanded": reglagesOuverts, "aria-controls": idPanneau }}
              onClick={() => setReglagesOuverts((ouvert) => !ouvert)}
            />
            {reglagesOuverts && (
              <PanneauFondCarte
                id={idPanneau}
                fond={fond}
                onFondChange={setFond}
                limites={limites}
                onLimitesChange={setLimites}
              />
            )}
          </div>
        </div>
      )}
      {surCarte}
    </div>
  );
}
