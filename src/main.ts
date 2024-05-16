import * as core from "@actions/core";
import { getFilesByExtension } from "./utils/ExtensionFilter";
import { InputParams } from "./utils/VariableManager";
import { processFiles, replaceVariables } from "./utils/FileProcessor";
import path from "path";
import simpleGit, { GitError, SimpleGit } from "simple-git";

/**
 * The main function for the action.
 * @param {InputParams} inputParams - The input parameters for the action.
 * @returns {void} Resolves when the action is complete.
 */
export async function run(inputParams: InputParams): Promise<void> {
  const { rootDir, extension, ignoredDir, includeSubDir } = inputParams;
  core.debug(
    `Searching for files with extension: ${extension} in directory: ${rootDir}...`
  );
  const files: string[] = getFilesByExtension({
    dir: path.join(rootDir),
    extension,
    ignoredDir,
    includeSubDir
  });

  if (files.length === 0) {
    core.warning(`No files found with extension ${extension} in ${rootDir}`);
    return;
  }

  const git: SimpleGit = simpleGit(process.cwd());
  await processFiles({
    git,
    files,
    variables: inputParams.envVars,
    encodings: inputParams.encodings,
    extension
  });

  const messageVariables: Map<string, string> = new Map([
    ["extension", extension],
    ["rootDir", rootDir],
    ["amount", files.length.toString()]
  ]);
  const commitMessage: string | undefined = replaceVariables(
    messageVariables,
    inputParams.message
  );
  if (!commitMessage) {
    core.warning("No commit message provided!");
    return;
  }

  await pushChanges(git, inputParams, commitMessage);
}

/**
 * Pushes changes to the repository.
 * @param {SimpleGit} git - The git instance.
 * @param {InputParams} inputParams - The input parameters for the action.
 * @param {string} commitMessage - The commit message.
 * @returns {void} Resolves when the changes are pushed.
 */
export async function pushChanges(
  git: SimpleGit,
  inputParams: InputParams,
  commitMessage: string
): Promise<void> {
  await git
    .addConfig("user.name", inputParams.userName, undefined, "worktree")
    .addConfig("user.email", inputParams.userEmail, undefined, "worktree");
  await git.commit(commitMessage).catch((err: unknown) => {
    core.error(`Error committing files!`);
    if (err instanceof Error) core.error(err.message);
  });
  await git.push().then(
    () => {
      core.info("Files committed successfully!");
    },
    (err: unknown) => {
      if (
        err instanceof GitError &&
        err.message.includes("nothing to commit")
      ) {
        core.info("No changes to commit!");
        return;
      }
      core.error(`Error committing files!`);
      if (err instanceof Error) core.error(err.message);
    }
  );
}
