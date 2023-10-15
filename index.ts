import { join } from "path";
import { merge_onwip } from "./script/merge_onwip";
import { merge_onmain } from "./script/merge_onmain";

const cwd = process.cwd();
const args = [process.argv[2], process.argv[3]];
const dev_main = ["dev", "main"];
const main_wip = ["main", "wip"];

const folders = cwd.split("/").filter(Boolean);
const indexOfGitFolder = folders.indexOf("git");
const hasGit = !(indexOfGitFolder === -1);

if (!hasGit) {
} else {
  const onwip = main_wip[1] === args[1];
  const onmain = dev_main[1] === args[1];
  if (onmain) {
    const nFolders = folders.length;
    const newFolders = folders.slice(indexOfGitFolder, nFolders);
    const newPath = join(...newFolders);
    merge_onmain(`${newPath}/`);
  }
  if (onwip) {
    const nFolders = folders.length;
    const newFolders = folders.slice(indexOfGitFolder, nFolders);
    const newPath = join(...newFolders);
    merge_onwip(`${newPath}/`);
  }
}
