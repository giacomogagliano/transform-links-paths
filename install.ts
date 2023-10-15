import { existsSync, readFileSync, writeFileSync } from "fs";
import { join, relative } from "path";
import { createInterface } from "readline/promises";
import { stdin as input, stdout as output, stderr } from "process";
import { Interface } from "readline/promises";
import { execSync } from "child_process";

const args = process.argv;
const user_path = args[2];
const GIT = ".git";
const HOOKS = "hooks";
const POSTMERGE = "post-merge";
const COMMIT_MSG = "commit-msg";
const isPATH = user_path.includes("/");
const TARGETHASGIT = existsSync(join(user_path, GIT));
const TARGETHASSCRIPT = existsSync(join(user_path, GIT, HOOKS, POSTMERGE));
const TARGETHASCOMMITSCRIPT = existsSync(
  join(user_path, GIT, HOOKS, COMMIT_MSG)
);

const makeQuestion: (rl: Interface, message: string) => Promise<any> = async (
  rl,
  message
) => {
  const answer = await rl.question(message);
  if (answer === "s") return true;
  else if (answer === "n") {
    rl.write("\noperazione annullata\n");
    rl.close();
    process.exit();
  } else return makeQuestion(rl, message);
};

if (!isPATH)
  throw new Error("i files non possono essere installati in questa cartella");
const EXISTS = existsSync(user_path);
if (!EXISTS)
  throw new Error(
    "\nIL PERCORSO ALLA CARTELLA NON ESISTE, crealo.\n>>>AAA<<<\nSe una delle cartelle nel percorso contiene degli spazi lo script non la legge correttamente, per fare in modo che la legga scrivi il comando in questo modo:\n\nbun run install '/path/alla/cartella/con\\ il/file'\n\novvero devi mettere l'escape: '\\' appena prima dello spazio'"
  );
if (!TARGETHASGIT)
  throw new Error("il percorso selezionato non contiene una git repo");
if (TARGETHASSCRIPT) {
  const rl = createInterface({ input, output });
  rl.write(
    "il file post-merge esiste di già, continuo con l'installazione (procedendo lo script esistente verrà cancellato)?\n"
  );
  const QUESTION = "\n(s/n) ";
  const answer = await makeQuestion(rl, QUESTION);
  if (!answer) throw new Error("c'è stato un problema sconosciuto");
  rl.close();
}
// if (TARGETHASCOMMITSCRIPT) {
//   const rl = createInterface({ input, output });
//   rl.write(
//     "il file commit-msg esiste di già, continuo con l'installazione (procedendo lo script esistente verrà cancellato)?\n"
//   );
//   const QUESTION = "\n(s/n) ";
//   const answer = await makeQuestion(rl, QUESTION);
//   if (!answer) throw new Error("c'è stato un problema sconosciuto");
//   rl.close();
// }
// scrivi il percorso passato come argomento nel file .env
const ENV = ".env";
const ENVEXISTS = existsSync(join(user_path, ENV));
if (ENVEXISTS) {
  const rl = createInterface({ input, output });
  rl.write(
    "il file .env di già, continuo con l'installazione (procedendo lo script esistente verrà cancellato)?\n"
  );
  const QUESTION = "\n(s/n) ";
  const answer = await makeQuestion(rl, QUESTION);
  if (!answer) throw new Error("c'è stato un problema sconosciuto");
  rl.close();
}
// calcola il percorso relativo
const A = user_path;
const B = process.cwd();
const INDEX = "index.ts";
const relative_path = join(relative(A, B), INDEX);
const KEY = "TRANSFORM_LINKS_PATHS_DIR";
const data = `${KEY}=${relative_path}`;
try {
  writeFileSync(join(user_path, ENV), data);
} catch (error) {
  console.log(error);
}
console.log("File .env creato con successo!");

// copia lo script
const FILE_TO_BE_COPIED = "post-merge_local";
const SCRIPT_NAME = "post-merge";
const COMMIT_MSG_SCRIPT = "commit-msg";
const TARGET_PATH_COMMIT = join(user_path, GIT, HOOKS, COMMIT_MSG_SCRIPT);
const TARGET_PATH_SCRIPT = join(user_path, GIT, HOOKS, SCRIPT_NAME);
// recupera il contenuto del file
const commit_msg_script = readFileSync(COMMIT_MSG_SCRIPT, { encoding: "utf8" });
const script_content = readFileSync(FILE_TO_BE_COPIED, { encoding: "utf8" });
// scrivi il file nella cartella dello user
try {
  writeFileSync(TARGET_PATH_COMMIT, commit_msg_script);
  writeFileSync(TARGET_PATH_SCRIPT, script_content);
} catch (error) {
  console.log(error);
}
// rendi i file eseguibili
const HOOKSPATH = join(GIT, HOOKS);
const COMMITMSGPATH = join(HOOKSPATH, COMMIT_MSG_SCRIPT);
const POSTMERGEPATH = join(HOOKSPATH, POSTMERGE);
try {
  execSync(`cd "${user_path}" && chmod +x ${COMMITMSGPATH}`);
  execSync(`cd "${user_path}" && chmod +x ${POSTMERGEPATH}`);
} catch (error) {
  console.log(error);
}
console.log("Lo script è stato copiato con successo");
