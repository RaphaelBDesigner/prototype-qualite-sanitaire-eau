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
- **Lien « Calcaire et dureté »** : c'est un `button` (il ouvre un volet ; le DSFR et le RGAA réservent les liens à la navigation). Pour qu'il se comporte exactement comme les autres liens de la FAQ, la classe `lien-bouton` reprend à l'identique les règles DSFR des liens `a[href]` : soulignement fin qui s'épaissit au survol, pas de fond gris au survol. Vérifié : styles identiques au repos, au survol et au focus.
- **Contenu des accordéons de la FAQ** (listes de liens et réponses en texte) : il est dans le conteneur natif `fr-collapse`, mais le DSFR 1.14 n'applique son retrait qu'à partir de la tablette (≥ 48em), avec une marge négative de 0.25rem. Les utilitaires DSFR `fr-px-2w fr-mx-0` sur `fr-collapse` (composant `QuestionFaq`) alignent tout le contenu exactement sur le texte du titre, à toutes les tailles d'écran (vérifié en mobile, tablette et desktop). Pas de CSS custom.
- **Fonds de section** : intro et « Mieux comprendre la qualité de l'eau » en `fr-background-alt--blue-france`, FAQ sur fond blanc. Les utilitaires de couleur DSFR sont importés dans `main.tsx` (non inclus dans `main.css` de react-dsfr).
- **Icône Eau potable** : `fr-icon-drop-line` (DSFR) à la place de `water_drop.svg`.
- **Badges des cartes** : couleur `purple-glycine`, la plus proche du rose de la maquette.
- **« Bon à savoir »** : `CallOut` en variante `blue-ecume`, la plus proche du fond bleu clair de la maquette.
- **Coins arrondis du volet** sur mobile : non repris (pas d'arrondi sur la modale DSFR).
- **FAQ** : les réponses « Comment vérifier si mon logement est raccordé… » et « À quelle fréquence… » sont des textes provisoires (illisibles sur la maquette).

## Écarts avec les maquettes — Carte et choix du secteur

- **Fonds IGN non vérifiés en local** : `data.geopf.fr` est inaccessible depuis l'environnement de développement ; l'affichage des fonds (Plan IGN, photographies aériennes, limites administratives `LIMITES_ADMINISTRATIVES_EXPRESS.LATEST`) est à vérifier sur le site publié. Les vignettes du sélecteur de fond sont de vraies tuiles IGN (Lille, zoom 12).
- **Contours des secteurs** (`src/data/udi.geojson`, préparé par `npm run corriger:udi` à partir de `donnees-sources/`) :
  - **Bordeaux (14 UDI)** : export complet `udi-bordeaux-2025.json` (WGS 84 correct, 84 UDI autour de Bordeaux, découpées par un rectangle ; les 14 utilisées sont entières) : tracés exacts ;
  - **Lille (12 UDI)** : export complet `udi-lille-2025.json` (WGS 84 correct, 64 UDI du Nord et du Pas-de-Calais ; les 12 utilisées sont entières) : tracés exacts ;
  - **Lyon (2 UDI)** : export d'origine `dgs_metropole_udi_2025_j.json`, décalé (coordonnées Web Mercator déclarées en Lambert 93 puis reprojetées, corrigé par le script) et **découpé par une zone circulaire** : pourtour arrondi. Export complet attendu (sélection « intersecte », pas de découpage).
  - Toutes les UDI sont affichées ; les plus étendues sont dessinées en premier pour garder les petites cliquables.
- **Noms, communes et états des secteurs** (`src/data/secteurs.json`) : le fichier ne contient que des codes UDI. Les noms et communes sont déduits de la position des contours (points de contrôle connus) ; les états (interdiction, restriction, aucune) sont fictifs. Lyon ne compte que deux petits secteurs périphériques, aucun ne couvrant le centre-ville.
- **Barre de recherche de la carte** : champ `Input` DSFR + bouton loupe, libellé masqué (lu par les lecteurs d'écran), au lieu du composant `SearchBar` : ce dernier intercepte Entrée et Échap, incompatibles avec la navigation clavier des suggestions. Rendu identique. Mêmes suggestions de communes que l'accueil (décision validée), pas l'API d'adresses Géoplateforme.
- **Panneau « Fond de carte »** : pas de composant « popover » DSFR. Contenu en composants DSFR (`RadioButtons` riches avec vignette, `ToggleSwitch`), ouvert par un bouton (`aria-expanded`), fermé par Échap (focus rendu au bouton) ou clic en dehors. Positionnement custom.
- **Contrôles de carte** : boutons DSFR tertiaires (zoom, réglages, retour) posés sur la carte avec un fond et une ombre DSFR. Attribution « © IGN / Géoplateforme » affichée en texte DSFR à la place du contrôle Leaflet.
- **Cartes de secteur** : `Card` DSFR horizontale en taille `small`, comme la maquette. **Exception validée** : la carte reste horizontale dès le mobile et la vignette est à droite (le DSFR ne passe en horizontal qu'à partir de la tablette, image à gauche). Classe `carte-secteur` dans `styles/app.css`.
- **Choix du secteur** : pas de boutons de zoom ni de réglages sur la carte, comme la maquette (déplacement et zoom restent possibles au doigt, à la souris et au clavier).
- **Mode Baignade sur la carte** : carte seule et alerte DSFR « Bientôt disponible » dans le panneau (décision validée).
- **Desktop** (pas de maquette) : panneau à gauche (environ un tiers), carte à droite (décision validée).

## Écarts avec les maquettes — Fiche du secteur et volets

- **Données** : résultats d'analyses fictifs (`src/lib/analyses.ts`). Pesticides (Chlorothalonil, dépassement le 09/07/2026) et Dureté (22,4 °f) reprennent les valeurs des maquettes ; les autres paramètres sont générés de façon déterministe par UDI. Coordonnées des mairies, captages et exploitants fictifs (`src/data/communes-infos.json`).
- **Détail des analyses** : aligné sur la maquette lisible `maquettes/modale-detail-analyses.pdf` (5 groupes, filtres « État » et « Paramètres », liste des paramètres). Décisions validées sur ses incohérences :
  - « Tous (n) » affiche le nombre total de paramètres (69), et non 15 ;
  - « Épichlorhydrine », présent deux fois, n'apparaît qu'une fois ;
  - « Radon » n'est rangé que dans « Radioactivité » : c'est un paramètre radiologique (valeur de référence 100 Bq/L), absent de la liste de vigilance européenne (décision d'exécution (UE) 2022/679 : 17-bêta-estradiol et nonylphénol) ;
  - Pesticides : 256 substances recherchées partout (liste fixée par chaque ARS, de l'ordre de 300 molécules selon les régions, ex. 330 en Normandie) ;
  - filtres sans paramètre homonyme : « Goût » et « Odeur » retiennent « Saveur », « Couleur » retient « Couleur » et « Aspect », « Chlore » retient chlore libre, chlore total, chlorates et chlorites, « Dureté » retient aussi calcium, magnésium, TAC et équilibre calcocarbonique.
- **Seuils** : « Limite réglementaire » pour les paramètres sanitaires, « Référence de qualité » pour les autres groupes, « Valeur indicative » pour les paramètres sous surveillance.
- **Statut des paramètres** (règle validée) : nombre de prélèvements dépassant le seuil sur la période affichée (12 mois). 0 → « Conforme » (`Badge severity="info"`), 1 → « À surveiller » (`Badge` jaune `fr-badge--yellow-tournesol`, sans icône), 2 ou plus → « Dépassement de limite » (`Badge severity="warning"`). Appliqué aux filtres « État » et à chaque indicateur d'un volet paramètre (composant `BadgeEtat`). Dans la liste du volet Analyses, seuls « À surveiller » et « Dépassement de limite » sont affichés, sans icône (demande validée). Toutes les lignes de la liste ont le même padding vertical (1,25 rem, soit 65 px de haut sans badge, proche des 68 px de la maquette) ; le badge s'ajoute sous le nom (écart de 0,25 rem) et seule la hauteur du contenu augmente. La maquette, elle, donne la même hauteur à toutes les lignes en réduisant le padding des lignes avec badge. Données (règle validée de cohérence avec la situation du secteur) : un secteur **sans restriction connue** n'a aucun paramètre au-dessus de son seuil (tout est « Conforme », bilan 2026 : 6 prélèvements conformes) ; un secteur **avec restriction ou interdiction** a Pesticides « À surveiller » (1 dépassement le 09/07/2026) et une référence de qualité « Dépassement de limite » (2 dépassements). Le bilan 2026 de la fiche est calculé à partir des analyses (4 prélèvements conformes, 2 dépassements pour ces secteurs, au lieu de 5 et 1 sur la maquette).
- **Bilan 2025** : « 12 prélèvements » dans le volet Analyses, « 6 prélèvements » dans la fiche, comme sur les deux maquettes.
- **État d'usage** : `Highlight` DSFR ; la bordure gauche prend la couleur de l'état (erreur, avertissement, information), ce que le DSFR ne propose pas en variante. Classes `etat-usage--*`.
- **Note A à D, étapes numérotées « Votre secteur », graphique d'évolution** : pas d'équivalent DSFR, composants custom aux couleurs DSFR. Le graphique a une alternative accessible (onglet Tableau) et une description textuelle.
- **Blocs des volets** (indicateurs, bilans) : cadre à filet gris (`bloc-indicateur`) ; la `Card` DSFR n'accepte pas de contenu interactif (accordéon, graphique).
- **Tableau des prélèvements** : tableau DSFR, ligne du prélèvement affiché en style « ligne sélectionnée » natif (`aria-selected`) ; la date est un bouton (clavier), la ligne entière est cliquable. Les dépassements sont signalés par un pictogramme dans la colonne Valeur (pas de colonne Résultat, trop large sur mobile).
- **Précédent / Suivant** : largeur naturelle des boutons (l'option « largeur égale » du DSFR les faisait passer sur deux lignes sur mobile).
- **Volets empilés** : une seule modale DSFR. Depuis Analyses, ouvrir un paramètre l'empile ; « Fermer », Échap et clic sur le fond reviennent à Analyses (événements interceptés avant le JS DSFR), le focus revient sur la ligne du paramètre. À la fermeture complète, le focus revient sur le bouton de la page réellement utilisé (le DSFR le rendait au premier bouton lié à la modale).
- **Contact & liens utiles** : `Tile` DSFR horizontales sans bordure ; le DSFR conserve la barre bleue en bas des tuiles et place l'icône en bas à droite (la maquette montre un filet gris et l'icône au centre).
- **« Télécharger le bilan »** : PDF fictif (`public/documents/bilan-2025.pdf`).
- **« Vérifier mon raccordement »** : alerte DSFR « bientôt disponible », fermable (décision validée).
- **Recherche de paramètre** : champ DSFR avec bouton loupe, comme la maquette ; le filtrage étant instantané, le bouton remet le focus dans le champ.

## Maquettes à compléter

- `accueil-mobile.webp` (169 px de large) est illisible : version en taille réelle attendue.
