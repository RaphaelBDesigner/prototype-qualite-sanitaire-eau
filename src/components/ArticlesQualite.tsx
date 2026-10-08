import { Card } from "@codegouvfr/react-dsfr/Card";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { fr } from "@codegouvfr/react-dsfr";

const ARTICLES = [
  {
    slug: "qui-s-occupe-de-mon-eau",
    theme: "Eau potable",
    titre: "Qui s’occupe de mon eau ?",
    description:
      "De la rivière ou de la nappe jusqu’au robinet, découvrez qui gère chaque étape du parcours de l’eau.",
    image: "Visuel_16_9_1.webp",
  },
  {
    slug: "controles-eau-potable",
    theme: "Eau potable",
    titre: "Quels contrôles pour l’eau potable ?",
    description:
      "Consultez les dernières informations concernant les contrôles, les recommandations et les actions mises en place pour assurer le respect des normes sanitaires.",
    image: "Visuel_16_9_2.webp",
  },
  {
    slug: "classement-eaux-de-baignade",
    theme: "Eau de baignade",
    titre: "Qu’est-ce que le classement des eaux de baignade ?",
    description:
      "Excellente, bonne, suffisante, insuffisante : ce classement résume quatre ans d’analyses d’un site. Apprenez à lire ces catégories, à repérer les alertes cyanobactéries et quand un site est déconseillé.",
    image: "Visuel_16_9_3.webp",
  },
  {
    slug: "controles-eau-de-baignade",
    theme: "Eau de baignade",
    titre: "Quels contrôles pour l’eau de baignade ?",
    description:
      "Avant chaque saison, l’ARS analyse l’eau des sites de baignade toutes les deux semaines. Bactéries, météo, apports des rivières : découvrez ce qui est mesuré et pourquoi la qualité peut varier d’un jour à l’autre.",
    image: "Visuel_16_9_4.webp",
  },
];

export function ArticlesQualite() {
  return (
    <section className="fr-background-alt--blue-france" aria-labelledby="titre-articles">
      <div className={fr.cx("fr-container", "fr-py-6w")}>
        <h2 id="titre-articles">Mieux comprendre la qualité de l’eau</h2>
        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
          {ARTICLES.map((article) => (
            <div key={article.slug} className={fr.cx("fr-col-12", "fr-col-md-6", "fr-col-lg-3")}>
              <Card
                title={article.titre}
                titleAs="h3"
                desc={article.description}
                imageUrl={`${import.meta.env.BASE_URL}images/${article.image}`}
                imageAlt=""
                badge={
                  <Badge small noIcon className={fr.cx("fr-badge--purple-glycine")}>
                    {article.theme}
                  </Badge>
                }
                enlargeLink
                linkProps={{ to: `/article/${article.slug}` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
