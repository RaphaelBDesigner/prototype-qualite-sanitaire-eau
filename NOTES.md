# NOTES.md — Écarts DSFR et décisions

## Composants sans équivalent DSFR

| Élément | Où | Décision |
|---|---|---|
| Suggestions de recherche (autocomplétion) | Bloc « Rechercher un lieu » | Pas de composant d'autocomplétion dans le DSFR 1.15. Liste custom selon le modèle ARIA combobox (flèches, Entrée, Échap, nombre de résultats annoncé), sous le champ `Input` DSFR, styles uniquement avec les tokens DSFR. |
| Icône « Baignade » (nageur) | Bascule Eau potable / Baignade | Aucune icône de nage dans DSFR / Remix. **Exception validée** : on garde `public/icons/pool.svg`. |
| Panneau glissant (bottom sheet) de l'écran carte | Écran carte, choix du secteur | Pas d'équivalent DSFR. Composant custom (poignée, contenu défilant), styles avec les tokens DSFR. |
| Légende hachurée « Zone = secteur de distribution » | Carte | Symbole cartographique, SVG simple aux couleurs DSFR. |
| Volet latéral sur desktop | Tous les volets (Mairie, Origine, Analyses, Paramètre, Calcaire) | Pas de volet latéral dans le DSFR. **Exception validée** : modale DSFR (`createModal` : focus piégé, Échap, clic sur le fond, ARIA) avec une surcharge CSS minimale pour l'ancrer à droite sur desktop et l'animer (depuis le bas sur mobile, depuis la droite sur desktop). |
| Note A B C D | Fiche UDI, Analyses, Paramètre | Pas d'équivalent DSFR. Composant custom, couleurs DSFR. |
| Repères numérotés 1 à 4 | Fiche UDI, « Votre secteur » | Pas d'équivalent DSFR. Liste ordonnée custom, couleurs DSFR. |
| Graphique d'évolution | Volet Paramètre | DSFR Chart ne gère a priori ni le seuil en pointillés ni la ligne verticale du prélèvement affiché (à confirmer à l'installation). Graphique SVG custom, couleurs DSFR. Le tableau sert d'alternative accessible. |

## Décisions validées

### Accueil
- **Logo** : `Header` avec `homeLinkProps` vers `/`.
- **Recherche** : vrai filtre par préfixe sur les communes (« Li » → Lille, Lisieux, Limoges…). Seules les communes présentes dans les données fictives mènent à une fiche ; les autres affichent « Données non disponibles dans ce prototype ».
- **Mode Baignade** : les suggestions portent sur des lieux de baignade, mais le parcours qui suit n'est pas fonctionnel en baignade.
- **Bascule Eau potable / Baignade** : `SegmentedControl` ; change le libellé, le texte d'aide et le texte d'exemple du champ.
- **« Explorer sur la carte »** : le type d'eau est transmis dans l'URL (`/carte?type=potable|baignade`).
- **Cartes articles** : `Card` avec `enlargeLink` (survol DSFR natif).
- **FAQ** : accordéons groupés (`fr-accordions-group`), fermés par défaut. Ouvrir une question referme la précédente (comportement DSFR natif).
- **« Calcaire et dureté »** : volet (modale DSFR), bloc « Bon à savoir » en `CallOut`.
- **Carte IGN** : déplacement, double-clic, pincement et clavier natifs Leaflet ; boutons +/– en `Button` tertiaires DSFR (contrôle de zoom Leaflet désactivé).

### Choix du secteur (commune à plusieurs UDI)
- Clic sur une zone de la carte ou sur une `Card` de secteur → fiche du secteur.
- **« Retour » et flèche ← sur la carte** : ramènent à la page d'où l'on vient (historique de navigation).

### Fiche UDI
- État (interdiction, restriction, aucune) selon le secteur : `Highlight` + `Badge`, données fictives par UDI.
- **« Changer d'adresse »** : ramène au choix du secteur.
- **« Suivre les infos locales » et « Votre mairie »** : ouvrent le volet Mairie (`button` en `fr-link`, `Tile` avec `buttonProps`).
- **« Vérifier mon raccordement »** : `Alert` info petite, fermable, « bientôt disponible ».
- **FAQ** : accordéons DSFR.

### Volets
- Fermeture par « Fermer », Échap ou clic sur le fond.
- **Navigation entre volets** : une seule modale dont le contenu suit une pile. Depuis Analyses, ouvrir un paramètre puis le fermer (bouton, Échap ou clic sur le fond) revient à Analyses ; le focus revient sur la ligne cliquée.
- **Mairie** : téléphone (`tel:`) et e-mail (`mailto:`) cliquables ; site de la mairie dans un nouvel onglet, avec titre « … – nouvelle fenêtre ».
- **Analyses** : recherche en direct (`Input`), filtres État (exclusifs entre eux) et Famille (plusieurs possibles) en `Tag` sélectionnables, cumulables ; compteur de résultats annoncé (`role="status"`) ; chaque ligne ouvre le paramètre.
- **Paramètre** : « Évolution sur 12 mois » en `Accordion` ; Graphique / Tableau en `SegmentedControl` comme la maquette ; Précédent / Suivant déplacent le prélèvement affiché et mettent à jour la conclusion sanitaire (`CallOut`) ; sélection d'une ligne du tableau DSFR (bouton radio + style `aria-selected` natif).
- **Dureté** : la ligne de l'échelle correspondant à la valeur mesurée est mise en évidence (style de ligne sélectionnée du tableau DSFR).

## Assets

- **Visuels 16:9** : convertis en WebP (`public/images/Visuel_16_9_{1,2,3,4}.webp`, 30 à 70 Ko chacun au lieu de 5 à 6 Mo), recadrés comme dans l'export Figma. Ordre des cartes de l'accueil : 1 « Qui s'occupe de mon eau ? », 2 « Quels contrôles pour l'eau potable ? », 3 « Qu'est-ce que le classement des eaux de baignade ? », 4 « Quels contrôles pour l'eau de baignade ? ».

## Socle technique

- **Version DSFR** : `@codegouvfr/react-dsfr` 1.35 embarque le DSFR **1.14.2** (et non 1.15.x comme indiqué dans `CLAUDE.md`). À mettre à jour quand react-dsfr passera en 1.15.
- **Communes** : `src/data/communes.json` est généré depuis le référentiel officiel `@etalab/decoupage-administratif` (`npm run generer:communes`), trié par population. Il n'est chargé qu'à la première saisie (≈ 490 Ko compressé). L'API Géoplateforme est réservée à la recherche d'adresse sur la carte.
- **Routes non encore construites** (carte, choix du secteur, articles, FAQ, pages du footer) : page « en construction ».

## Écarts avec les maquettes — Accueil

- **Intitulé du service** : « Qualité sanitaire des eaux » (validé), avec l'accroche « Suivez la qualité de l'eau en France ». Le texte du footer garde « Qualité de l'eau est le service public… ».
- **Liens du footer** : le composant DSFR affiche le nom de domaine (`eaufrance.fr`, `vigieau.gouv.fr`) et non « EauFrance », « VigiEau ». L'ordre des liens du bas est celui du composant (Plan du site, Accessibilité, Mentions légales, puis les autres).
- **Contrôle segmenté Eau potable / Baignade** : sur toute la largeur du bloc, deux options 50/50 (demande validée). **Exception** à la règle « pas de CSS custom sur les composants DSFR » : classe `segmented-pleine-largeur` dans `styles/app.css`.
- **Lien « Calcaire et dureté »** : c'est un `button` (il ouvre un volet) ; il reprend le soulignement DSFR des liens via la classe `lien-bouton`, qui réutilise les variables `--underline-*` du DSFR.
- **Liens dans les accordéons de la FAQ** : le contenu est bien dans le conteneur natif `fr-collapse`, mais le DSFR 1.14 n'applique son retrait qu'à partir de la tablette (≥ 48em). Sur mobile, les liens sont alignés sur le titre avec les utilitaires DSFR `fr-px-2w fr-px-md-0` (pas de CSS custom). Sur desktop, le retrait natif du DSFR place les liens 4 px avant le texte du titre.
- **Fonds de section** : intro et « Mieux comprendre la qualité de l'eau » en `fr-background-alt--blue-france`, FAQ sur fond blanc. Les utilitaires de couleur DSFR sont importés dans `main.tsx` (non inclus dans `main.css` de react-dsfr).
- **Icône Eau potable** : `fr-icon-drop-line` (DSFR) à la place de `water_drop.svg`.
- **Badges des cartes** : couleur `purple-glycine`, la plus proche du rose de la maquette.
- **« Bon à savoir »** : `CallOut` en variante `blue-ecume`, la plus proche du fond bleu clair de la maquette.
- **Coins arrondis du volet** sur mobile : non repris (pas d'arrondi sur la modale DSFR).
- **FAQ** : les réponses « Comment vérifier si mon logement est raccordé… » et « À quelle fréquence… » sont des textes provisoires (illisibles sur la maquette).

## Maquettes à compléter

- `accueil-mobile.webp` (169 px de large) et `modale-detail-analyses.webp` (125 px de large) sont illisibles : versions en taille réelle attendues.
