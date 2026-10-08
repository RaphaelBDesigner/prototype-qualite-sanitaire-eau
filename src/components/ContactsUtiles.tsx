import { Tile } from "@codegouvfr/react-dsfr/Tile";
import { fr } from "@codegouvfr/react-dsfr";
import { useBoutonVolet } from "../lib/contexteVolets";
import type { InfosCommune } from "../lib/communes";

/** Section « Contact & liens utiles » : tuiles DSFR horizontales. */
export function ContactsUtiles({ infos }: { infos: InfosCommune }) {
  const boutonVolet = useBoutonVolet();
  const externe = (url: string, nom: string) => ({ href: url, target: "_blank", rel: "noopener noreferrer", title: `${nom} - nouvelle fenêtre` });
  return (
    <section className={fr.cx("fr-mb-6w")} aria-labelledby="titre-contacts">
      <h2 id="titre-contacts" className={fr.cx("fr-h4")}>
        Contact & liens utiles
      </h2>
      <ul className={`${fr.cx("fr-raw-list")} liste-tuiles`}>
        <li>
          <Tile
            title="Votre mairie"
            titleAs="h3"
            desc="Questions sur la restriction"
            orientation="horizontal"
            small
            noBorder
            noBackground
            enlargeLinkOrButton
            buttonProps={boutonVolet({ type: "mairie" }, "ouvrir-mairie-contacts")}
          />
        </li>
        <li>
          <Tile
            title="Distributeur"
            titleAs="h3"
            desc="Raccordement, facture, pression"
            orientation="horizontal"
            small
            noBorder
            noBackground
            enlargeLinkOrButton
            linkProps={externe(infos.distributeur, "Distributeur")}
          />
        </li>
        <li>
          <Tile
            title={infos.ars.nom}
            titleAs="h3"
            desc="Résultats officiels du contrôle"
            orientation="horizontal"
            small
            noBorder
            noBackground
            enlargeLinkOrButton
            linkProps={externe(infos.ars.url, infos.ars.nom)}
          />
        </li>
      </ul>
    </section>
  );
}
