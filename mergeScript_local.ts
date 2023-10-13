import { transformLinkPaths } from "./script/transformLinkPaths";
import { transformPath } from "./script/transformPath";

// mettiamo un log che poi andremo a togliere per controllare che lo script mergeScript venga chiamato dal post-merge hook:
console.log("the mergeScript was called");

// crea una cartella test-git-scripts/mds/
// crea la funzione che trasforma passando la tupla di configurazione a transformPath:
// il primo valore della tupla è il path sul quale bisogna effettuar la trasformazione
// il secondo valore della tupla è il percorso in cui deve essere cambiato il link
const tuple: [string, string] = ["/assets/", "/mds/"];
// crea la funzione di trasformazione
const transformer = transformPath(tuple);
// la directory in qui il test deve essere passato è la cartella dove sono contenuti i file md in questo esempio:
const dir = "./mds/";
try {
  transformLinkPaths(dir, transformer);
} catch (error) {
  console.log(error);
}
