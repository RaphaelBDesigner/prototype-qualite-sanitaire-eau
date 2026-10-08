import { ButtonsGroup } from "@codegouvfr/react-dsfr/ButtonsGroup";
import { fr } from "@codegouvfr/react-dsfr";
import type { InfosCommune } from "../lib/communes";

/** Volet « Suivre les informations locales » : coordonnées de la mairie. */
export function VoletMairie({ mairie }: { mairie: InfosCommune["mairie"] }) {
  const lienTel = `tel:${mairie.telephone.replace(/\s/g, "")}`;
  return (
    <>
      <p>
        Pour vérifier les <strong>informations à jour</strong> sur la restriction (usages, horaires, durée ou levée),{" "}
        <strong>contactez votre mairie</strong>, qui dispose des dernières informations.
      </p>
      <h2 className={fr.cx("fr-h5", "fr-mb-3w")}>Votre mairie</h2>
      <dl className="liste-coordonnees">
        <div>
          <dt>Téléphone</dt>
          <dd>
            <a className={fr.cx("fr-link", "fr-text--bold")} href={lienTel}>
              {mairie.telephone}
            </a>
          </dd>
        </div>
        <div>
          <dt>E-mail</dt>
          <dd>
            <a className={fr.cx("fr-link", "fr-text--bold")} href={`mailto:${mairie.email}`}>
              {mairie.email}
            </a>
          </dd>
        </div>
        <div>
          <dt>Adresse</dt>
          <dd className={fr.cx("fr-text--bold")}>{mairie.adresse}</dd>
          <dt className={fr.cx("fr-mt-2w")}>Horaires</dt>
          <dd>
            <span className={fr.cx("fr-text--bold")}>{mairie.horaires}</span>
            <br />
            {mairie.fermeture}
          </dd>
        </div>
      </dl>
      <ButtonsGroup
        buttons={[
          {
            children: mairie.site.libelle,
            priority: "secondary",
            linkProps: {
              href: mairie.site.url,
              target: "_blank",
              rel: "noopener noreferrer",
              title: `${mairie.site.libelle} - nouvelle fenêtre`,
            },
          },
        ]}
      />
    </>
  );
}
