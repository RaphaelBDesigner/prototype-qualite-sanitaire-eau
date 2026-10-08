# NOTES.md — Écarts DSFR et décisions

## Composants sans équivalent DSFR

| Élément | Où | Décision |
|---|---|---|
| Suggestions de recherche (autocomplétion) | Bloc « Rechercher un lieu » | Pas de composant d'autocomplétion dans le DSFR 1.15. Liste custom selon le modèle ARIA combobox (flèches, Entrée, Échap, nombre de résultats annoncé), sous le champ `Input` DSFR, styles uniquement avec les tokens DSFR. |
| Icône « Baignade » (nageur) | Bascule Eau potable / Baignade | Aucune icône de nage dans DSFR / Remix. **Exception validée** : on garde `public/icons/pool.svg`. |
| Panneau glissant (bottom sheet) de l'écran carte | Écran carte | Pas d'équivalent DSFR. Détails à venir avec les interactions des autres pages. |
| Légende hachurée « Zone = secteur de distribution » | Carte | Symbole cartographique, SVG simple aux couleurs DSFR. |

## Décisions validées

- **Recherche** : vrai filtre par préfixe sur les communes (« Li » → Lille, Lisieux, Limoges…).
- **Mode Baignade** : les suggestions portent sur des lieux de baignade, mais le parcours qui suit n'est pas fonctionnel en baignade.
- **FAQ** : accordéons groupés (`fr-accordions-group`), fermés par défaut. Ouvrir une question referme la précédente (comportement DSFR natif).
- **« Explorer sur la carte »** : le type d'eau est transmis dans l'URL (`/carte?type=potable|baignade`).
- **« Calcaire et dureté »** : modale DSFR (`createModal`), ancrée en bas de l'écran sur mobile.
- **Visuels 16:9** : convertis en WebP (`public/images/Visuel_16_9_{2,3,4}.webp`, 30 à 40 Ko chacun au lieu de 5 à 6 Mo), recadrés comme dans l'export Figma. Le visuel de la carte « Qui s'occupe de mon eau ? » n'a pas encore été fourni.
