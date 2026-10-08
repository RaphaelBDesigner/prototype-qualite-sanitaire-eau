// Génère src/data/communes.json à partir du référentiel officiel des communes
// (@etalab/decoupage-administratif). Format compact : [nom, codeInsee, codePostal, departement].
// Les communes sont triées par population décroissante pour proposer d'abord les plus peuplées.
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const source = require.resolve("@etalab/decoupage-administratif/data/communes.json");
const communes = JSON.parse(readFileSync(source, "utf8"))
  .filter((c) => c.type === "commune-actuelle")
  .sort((a, b) => (b.population ?? 0) - (a.population ?? 0))
  .map((c) => [c.nom, c.code, c.codesPostaux?.[0] ?? "", c.departement]);

writeFileSync(new URL("../src/data/communes.json", import.meta.url), JSON.stringify(communes));
console.log(`${communes.length} communes écrites dans src/data/communes.json`);
