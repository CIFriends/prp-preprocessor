import * as core from "@actions/core";
import { getFilesByExtension } from "./utils/ExtensionFilter";
import { InputParams } from "./utils/VariableManager";
import { SEARCH_TEXT } from "./utils/texts";
import { processFiles } from "./utils/FileProcessor";
import path from "path";

/**
 * The main function for the action.
 * @param {InputParams} inputParams - The input parameters for the action.
 * @returns {void} Resolves when the action is complete.
 */
export function run(inputParams: InputParams): void {
  const { rootDir, extension, envVars, ignoredDir, includeSubDir, encodings } =
    inputParams;
  core.debug(SEARCH_TEXT(extension, rootDir));
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

  processFiles({ files, variables: envVars, encodings, extension });
}
