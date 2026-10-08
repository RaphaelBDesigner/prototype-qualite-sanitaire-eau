# CLAUDE.md — Prototype front DSFR + carte IGN

## Contexte du projet
Prototype **front-end uniquement** (aucun back-end, aucune API maison) d'un service public, conforme au **Système de Design de l'État (DSFR)**.
Objectif : reproduire fidèlement les maquettes PNG du dossier `/maquettes`, avec les **vrais composants DSFR** et leurs **interactions natives**, plus une **carte IGN fonctionnelle**.

## Stack imposée
- **Vite + React + TypeScript**
- **@codegouvfr/react-dsfr** pour tous les composants (il embarque le CSS/JS officiel `@gouvfr/dsfr`, version 1.15.x)
- **Leaflet** (+ `react-leaflet`) pour la carte, tuiles **Géoplateforme IGN** (gratuites, sans clé)
- Données : fichiers JSON/GeoJSON statiques dans `/src/data` (mock). Pas de fetch vers un serveur maison.
- Déploiement : GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`), `base` Vite réglé sur le nom du repo.

## Règles DSFR — NON NÉGOCIABLES
1. **Toujours utiliser un composant DSFR existant** avant d'écrire du HTML/CSS custom. Vérifier dans la doc officielle : https://www.systeme-de-design.gouv.fr et le storybook react-dsfr : https://components.react-dsfr.codegouv.studio
2. **Ne jamais réinventer** : bouton, champ, select, case à cocher, radio, toggle, onglets, accordéon, modale, alerte, badge, tag, carte (Card), tuile, fil d'Ariane, pagination, tableau, stepper, header, footer, menu latéral, recherche → composants DSFR.
3. **Pas de CSS custom sur les composants DSFR.** Pour la mise en page : grille DSFR (`fr-container`, `fr-grid-row`, `fr-col-*`), utilitaires d'espacement (`fr-mt-4w`, `fr-p-2w`…). Couleurs uniquement via les tokens DSFR (`fr.colors` / variables CSS `--background-*`, `--text-*`).
4. **Icônes** : uniquement les icônes DSFR / Remix (`fr-icon-*`, `ri-*`).
5. **Typographie** : Marianne (fournie par le DSFR). Ne pas importer d'autre police.
6. **Header et Footer officiels** obligatoires (bloc Marianne, intitulé du service, liens obligatoires du footer).
7. **Mode sombre** : activer le paramètre d'affichage DSFR (clair/sombre/système) — la carte doit rester lisible.
8. Si une maquette montre un élément **sans équivalent DSFR**, le signaler dans `NOTES.md` et proposer le composant DSFR le plus proche avant de coder un composant custom.

## Interactions à respecter (comportements natifs DSFR)
- **Modales** : ouverture/fermeture via `createModal()` de react-dsfr, fermeture par Échap et clic sur l'overlay, focus piégé, retour du focus sur le déclencheur.
- **Accordéons / onglets / menu de navigation** : comportements JS DSFR natifs (pas de réimplémentation maison).
- **Formulaires** : états `error` / `success` / `disabled` des composants (`state`, `stateRelatedMessage`), validation côté client, messages d'erreur DSFR sous les champs.
- **Alertes / notices** : fermables quand la maquette le montre.
- **Header** : menu burger mobile, recherche, accès rapides — fonctionnels.
- **Stepper** : navigation réelle entre étapes si parcours multi-étapes.
- **Responsive** : mobile (< 576px), tablette, desktop selon les breakpoints DSFR.
- **Accessibilité (RGAA)** : navigation clavier complète, focus visible, `aria-*` corrects, textes alternatifs, contrastes. Aucun `div` cliquable : utiliser `button` ou `a`.

## Carte IGN (Géoplateforme)
- Fond par défaut **Plan IGN** (WMTS, sans clé) :
  ```
  https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&TILEMATRIXSET=PM&FORMAT=image/png&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}
  ```
- Fond alternatif **Photographies aériennes** : `LAYER=ORTHOIMAGERY.ORTHOPHOTOS`, `FORMAT=image/jpeg`.
- Attribution obligatoire : `© IGN / Géoplateforme`.
- Fonctionnalités attendues (adapter selon les maquettes) :
  - zoom, déplacement, sélecteur de fond de carte (boutons/segmented control DSFR, pas le contrôle Leaflet par défaut si la maquette montre autre chose)
  - marqueurs depuis `/src/data/*.geojson`, popup au clic stylée avec une Card/contenu DSFR
  - synchronisation liste ↔ carte si la maquette en montre une (clic sur un élément de liste = centrage + ouverture popup)
  - recherche d'adresse via l'API d'autocomplétion Géoplateforme (`https://data.geopf.fr/geocodage/completion/`) branchée sur le composant SearchBar DSFR
  - accessibilité : la carte n'est jamais la seule façon d'accéder à l'info (liste équivalente disponible)
- Contrôles de carte restylés avec les tokens DSFR.

## Méthode de travail
1. **Avant de coder un écran** : ouvrir la maquette PNG correspondante dans `/maquettes`, lister les composants DSFR identifiés et les interactions, et me les présenter.
2. Un écran = une route (`react-router`). Un composant métier = un fichier dans `/src/components`.
3. Après chaque écran : lancer `npm run build` et `npm run lint`, corriger les erreurs.
4. Comparer visuellement le rendu à la maquette ; signaler les écarts dans `NOTES.md`.
5. Commits petits et explicites (en français), une branche par écran, PR vers `main`.

## Ce qu'il ne faut PAS faire
- Pas de Tailwind, Bootstrap, MUI, shadcn ou autre librairie UI.
- Pas de back-end, pas de base de données, pas d'authentification réelle.
- Pas de couleurs, ombres ou arrondis inventés.
- Pas de composant custom quand un composant DSFR existe.
