import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { CallOut } from "@codegouvfr/react-dsfr/CallOut";
import { fr } from "@codegouvfr/react-dsfr";
import { EnConstruction } from "./EnConstruction";
import { VoletsFiche } from "../components/VoletsFiche";
import { EtatUsage } from "../components/EtatUsage";
import { MesureQualite } from "../components/MesureQualite";
import { VotreSecteur } from "../components/VotreSecteur";
import { ContactsUtiles } from "../components/ContactsUtiles";
import { QuestionFaq } from "../components/QuestionFaq";
import { secteurParCode, type StatutSecteur } from "../lib/secteurs";
import { infosCommune } from "../lib/communes";

const CONCLUSIONS: Record<StatutSecteur, ReactNode> = {
  interdiction: (
    <>
      Au regard des résultats obtenus lors du prélèvement, l’eau présente une non-conformité nécessitant une restriction
      d’usage. <strong>La consommation de l’eau est interdite jusqu’à la mise en conformité et l’obtention de résultats
      satisfaisants.</strong>
    </>
  ),
  restriction: (
    <>
      L’Agence Régionale de Santé (ARS) considère que la qualité de l’eau distribuée <strong>ne remet pas en cause son
      utilisation par la population générale</strong> pour la consommation humaine. Toutefois, par mesure de précaution, une
      restriction d’usage locale s’applique aux nourrissons, femmes enceintes ou allaitantes et aux personnes dialysées.
    </>
  ),
  aucune: <>Eau d’alimentation conforme aux exigences de qualité en vigueur pour l’ensemble des paramètres mesurés.</>,
};

export function FicheSecteur() {
  const { id = "" } = useParams();
  const trouve = secteurParCode(id);
  const infos = trouve && infosCommune(trouve.codeCommune);
  if (!trouve || !infos) return <EnConstruction titre="Secteur introuvable" />;
  const { secteur, codeCommune } = trouve;
  const { nom, communes, precision, statut } = secteur.properties;

  return (
    <VoletsFiche codeUdi={id} statut={statut} infos={infos}>
      <div className={fr.cx("fr-container", "fr-pt-3w", "fr-pb-6w")}>
        <div className={fr.cx("fr-grid-row")}>
          <div className={fr.cx("fr-col-12", "fr-col-lg-8")}>
            <Link to={`/commune/${codeCommune}`} className={fr.cx("fr-link", "fr-icon-arrow-left-line", "fr-link--icon-left")}>
              Changer d’adresse
            </Link>
            <h1 className={fr.cx("fr-mt-3w", "fr-mb-1w")}>{nom}</h1>
            <p className={fr.cx("fr-text--sm", "fr-mb-4w")}>
              {communes.length > 0 ? (
                <>
                  Communes : <strong>{communes.join(", ")}</strong>
                  {precision && ` (${precision})`}
                </>
              ) : (
                precision
              )}
            </p>

            <EtatUsage statut={statut} />

            <section className={fr.cx("fr-mb-6w")} aria-labelledby="titre-suivi">
              <h2 id="titre-suivi" className={fr.cx("fr-h4")}>
                Suivi sanitaire
              </h2>
              <CallOut
                title="Dernière conclusion sanitaire"
                titleAs="h3"
                colorVariant="blue-ecume"
                bodyAs="div"
                classes={{ title: fr.cx("fr-text--lg") }}
              >
                <p className={fr.cx("fr-text--sm", "fr-mb-0")}>{CONCLUSIONS[statut]}</p>
                <p className={`${fr.cx("fr-text--xs", "fr-mt-2w", "fr-mb-0")} fr-text-mention--grey`}>
                  <em>
                    Cette conclusion porte sur le prélèvement du 9 juillet 2026. Une évaluation sur une période plus longue (2 à
                    3 mois) est envisagée à l’avenir.
                  </em>
                </p>
              </CallOut>
            </section>

            <MesureQualite codeUdi={id} />

            <VotreSecteur secteur={secteur} infos={infos} />

            <section className={fr.cx("fr-mb-6w")} aria-labelledby="titre-faq-fiche">
              <h2 id="titre-faq-fiche" className={fr.cx("fr-h4")}>
                Questions fréquentes
              </h2>
              <div className={fr.cx("fr-accordions-group")}>
                <QuestionFaq label="Qu’est-ce qu’un prélèvement ?">
                  <p>
                    Un prélèvement est un échantillon d’eau recueilli au robinet ou sur le réseau par un agent habilité, puis
                    analysé par un laboratoire agréé par le ministère chargé de la santé.
                  </p>
                </QuestionFaq>
                <QuestionFaq label="D’où viennent ces données ?">
                  <p>
                    Elles proviennent du contrôle sanitaire réalisé par les Agences régionales de santé (ARS), en complément de
                    la surveillance assurée par l’exploitant du réseau.
                  </p>
                </QuestionFaq>
                <QuestionFaq label="Que se passe-t-il en cas d’alerte ?">
                  <p>
                    En cas de dépassement, l’ARS évalue le risque, informe la mairie et l’exploitant et peut proposer au préfet
                    une restriction d’usage. Votre mairie relaie alors les consignes à suivre.
                  </p>
                </QuestionFaq>
                <QuestionFaq label="Pourquoi les unités des indicateurs analysés sont-elles différentes ?">
                  <p>
                    Chaque paramètre est exprimé dans l’unité adaptée à sa concentration habituelle : milligrammes par litre
                    pour les sels minéraux, microgrammes par litre pour les substances présentes à l’état de traces, nombre de
                    bactéries pour 100 mL…
                  </p>
                </QuestionFaq>
                <QuestionFaq label="Que signifient µg/L, mg/L… ?">
                  <p>
                    1 mg/L correspond à un milligramme (un millième de gramme) par litre d’eau. 1 µg/L correspond à un
                    microgramme par litre, soit mille fois moins.
                  </p>
                </QuestionFaq>
              </div>
            </section>

            <ContactsUtiles infos={infos} />
          </div>
        </div>
      </div>
    </VoletsFiche>
  );
}
