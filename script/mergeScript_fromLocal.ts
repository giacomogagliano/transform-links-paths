import { transformLinkPaths } from "./transformLinkPaths";
import { transformPath } from "./transformPath";

// mettiamo un log che poi andremo a togliere per controllare che lo script mergeScript venga chiamato dal post-merge hook:
console.log("the mergeScript was called");

export const mergeScript_fromLocal = (localPath: string) => {
  try {
    // crea una cartella test-git-scripts/mds/
    // crea la funzione che trasforma passando la tupla di configurazione a transformPath:
    // il primo valore della tupla è il path sul quale bisogna effettuar la trasformazione
    // il secondo valore della tupla è il percorso in cui deve essere cambiato il link
    const tuple: [string, string] = ["git/tnl.productions/", `${localPath}/`];
    // crea la funzione di trasformazione
    const transformer = transformPath(tuple);
    // la directory in qui il test deve essere passato è la cartella dove sono contenuti i file md in questo esempio:
    const dir = "./";
    try {
      transformLinkPaths(dir, transformer, (node) => {
        console.log(node.type);
      });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};
