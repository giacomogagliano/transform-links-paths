/// <reference types="remark-stringify" />
import * as fs from "fs";
import * as path from "path";
import { unified } from "unified";
import markdown from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import remark2rehype from "remark-rehype";
import stringify from "remark-stringify";
import { visit } from "unist-util-visit";
import remarkGfm from "remark-gfm";
import remarkParseFrontmatter from "remark-parse-frontmatter";
import { wikiLinkPlugin } from "remark-wiki-link";

function handleWikiLinks() {
  return (tree: any) => {
    visit(tree, ["link", "linkReference"], (node) => {
      console.log(node.type);

      // Qui puoi aggiungere la logica per gestire i link in formato wiki.
      // Ad esempio, potresti controllare se l'URL del nodo è in formato wiki
      // e, in caso affermativo, modificare il nodo come desideri.
    });
  };
}

// // @ts-expect-error
const processor = unified()
  .use(markdown)
  .use(remarkFrontmatter)
  .use(remarkParseFrontmatter)
  .use(remarkGfm)
  .use(wikiLinkPlugin)
  .use(stringify)
  .data({ settings: { bullet: "-", resourceLink: true } });
// .data({ bullet: "-" });

/**
 * Questa funzione trasforma i percorsi dei collegamenti nei file Markdown
 * all'interno di una directory specificata.
 *
 * @param {string} dir - La directory in cui cercare i file Markdown.
 * @param {(oldPath: string) => string} transform - Una funzione che prende un vecchio percorso come input e restituisce un nuovo percorso.
 *
 * La funzione legge tutti i file nella directory specificata. Per ogni file, controlla se è una sottodirectory.
 * Se lo è, chiama se stessa ricorsivamente su quella sottodirectory. Se non lo è, controlla se il file è un file Markdown.
 * Se il file è un file Markdown, viene letto e analizzato nel suo AST. Poi, la funzione visita ogni nodo "link" o "wikiLink" nell'AST
 * e applica la funzione di trasformazione al suo URL. Infine, l'AST viene convertito nuovamente in una stringa Markdown e il file viene sovrascritto con il nuovo contenuto.
 */
export function transformLinkPaths(
  dir: string,
  transform: (oldPath: string) => string,
  handleWiki: (node: any) => any = (node) => {
    // console.log(node.data.alias, "wiki link unchanged");
  }
) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      // Recurse into subdirectories–
      transformLinkPaths(filePath, transform, handleWiki);
    } else if (path.extname(file) === ".md") {
      // Parse and transform markdown files
      const md = fs.readFileSync(filePath, "utf-8");
      const ast = processor.parse(md);
      visit(ast, ["link", "wikiLink", "linkReference"], (node: any) => {
        if (node.type === "wikiLink") {
          handleWiki(node);
        } else {
          node.url = transform(node.url);
        }
      });
      const newMd = processor.stringify(ast);
      fs.writeFileSync(filePath, newMd);
    }
  });
}
