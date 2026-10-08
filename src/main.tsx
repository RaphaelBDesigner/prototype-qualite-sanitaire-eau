import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
import { Link, RouterProvider } from "react-router-dom";
import "@codegouvfr/react-dsfr/main.css";
// Utilitaires de couleur DSFR (fr-background-alt--*…), non inclus dans main.css.
import "@codegouvfr/react-dsfr/dsfr/utility/colors/colors.main.min.css";
import "./styles/app.css";
import { router } from "./router";

startReactDsfr({ defaultColorScheme: "system", Link });

declare module "@codegouvfr/react-dsfr/spa" {
  interface RegisterLink {
    Link: typeof Link;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
