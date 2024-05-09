import fs from "fs";
import path from "path";
import ignore, { Ignore } from "ignore";
import * as core from "@actions/core";

/**
 * Get all files with a specific extension in a directory
 * @returns An array of files with the specified extension
 * @param params
 */
export function getFilesByExtension(params: GetFilesParams): string[] {
  const {
    dir,
    extension,
    fsModule = fs,
    ignoredDir = ignoredDefault,
    includeSubDir = true,
    pathModule = path
  } = params;

  if (!dir || !extension) {
    throw new Error("Directory and extension are required");
  }
  // Convert the wildcard pattern to a regular expression
  const extensionRegex: RegExp = generateRegex(extension + ".*");
  const ig: Ignore = ignore().add(ignoredDir);
  const files: string[] = [];

  const dirs: fs.Dirent[] = getSubItems();
  for (const dirent of dirs) {
    const filePath: string = pathModule.join(dir, dirent.name);

    if (ig.ignores(filePath)) {
      continue;
    }

    if (dirent.isDirectory() && includeSubDir) {
      core.debug(`Found directory: ${filePath}`);
      files.push(
        ...getFilesByExtension({
          dir: filePath,
          extension,
          fsModule,
          ignoredDir,
          includeSubDir,
          pathModule
        })
      );
    } else if (dirent.isFile() && extensionRegex.test(dirent.name)) {
      core.info(`Found file: ${filePath}`);
      files.push(filePath);
    }
  }

  return files;

  function getSubItems() {
    if (dir !== "." && ig.ignores(dir)) {
      return [];
    }
    try {
      return fsModule.readdirSync(dir, {
        withFileTypes: true
      });
    } catch (error) {
      core.error(`Error reading directory: ${dir}`);
      if (error instanceof Error) {
        core.error(error.message);
      }
      return [];
    }
  }
}

interface GetFilesParams {
  dir: string;
  extension: string;
  includeSubDir?: boolean;
  ignoredDir?: string[];
  fsModule?: typeof fs;
  pathModule?: typeof path;
}

/**
 * Generate a regular expression with a wildcard pattern
 * @param extension
 */
function generateRegex(extension: string): RegExp {
  const extensionPattern: string = extension
    .replaceAll(".", "\\.")
    .replaceAll("*", ".*");
  return new RegExp(extensionPattern + "$");
}

const ignoredDefault: string[] = [
  "node_modules",
  ".git",
  ".github",
  "__tests__",
  ".vscode",
  ".idea"
];
