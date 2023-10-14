import { join } from "path";
import { mergeScript_fromRemote } from "./script/mergeScript_fromRemote";
import { mergeScript_fromLocal } from "./script/mergeScript_fromLocal";

const cwd = process.cwd();
const folders = cwd.split("/").filter(Boolean);
const indexOfGitFolder = folders.indexOf("git");
const hasGit = !(indexOfGitFolder === -1);
console.log(hasGit);

if (!hasGit) {
  mergeScript_fromLocal(".");
  console.log("Succesfully tranformed the paths");
  process.exit();
} else {
  const nFolders = folders.length;
  const newFolders = folders.slice(indexOfGitFolder, nFolders);
  const newPath = join(...newFolders);
  console.log(newPath);

  mergeScript_fromRemote(newPath);
}
