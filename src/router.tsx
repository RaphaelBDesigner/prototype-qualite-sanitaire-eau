import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Accueil } from "./pages/Accueil";
import { EnConstruction } from "./pages/EnConstruction";
import { Carte } from "./pages/Carte";
import { ChoixSecteur } from "./pages/ChoixSecteur";
import { PageIntrouvable } from "./pages/PageIntrouvable";

export const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      children: [
        { index: true, element: <Accueil /> },
        { path: "carte", element: <Carte /> },
        { path: "commune/:code", element: <ChoixSecteur /> },
        { path: "secteur/:id", element: <EnConstruction titre="Fiche du secteur" /> },
        { path: "article/:slug", element: <EnConstruction titre="Article" /> },
        { path: "faq", element: <EnConstruction titre="Questions fréquentes" /> },
        { path: "accessibilite", element: <EnConstruction titre="Accessibilité" /> },
        { path: "mentions-legales", element: <EnConstruction titre="Mentions légales" /> },
        { path: "donnees-personnelles", element: <EnConstruction titre="Données personnelles" /> },
        { path: "gestion-des-cookies", element: <EnConstruction titre="Gestion des cookies" /> },
        { path: "plan-du-site", element: <EnConstruction titre="Plan du site" /> },
        { path: "*", element: <PageIntrouvable /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, "") },
);
