import fs from "fs";
import { SimpleGit } from "simple-git";
import * as core from "@actions/core";

/**
 * Process files and replace variables
 * @param params - Files parameters see {@link FilesParams}
 */
export function processFiles(params: FilesParams): void {
  const { files, encodings, git, variables, fsModule = fs, extension } = params;

  for (const file of files) {
    processFile(file);
  }

  function processFile(file: string) {
    const readFile: string = fsModule.readFileSync(file, {
      encoding: encodings as BufferEncoding
    });

    if (!readFile) {
      throw new Error(`Error reading file: ${file}`);
    }

    const content: string = replaceVariables(variables, readFile);
    const newFile: string = file.replace(extension, "");

    fs.writeFileSync(newFile, content, { encoding: encodings });

    if (!git) {
      core.info(`Skipping git add for file: ${newFile}`);
      return;
    }

    gitAdd(git, newFile).catch((err: unknown) => {
      core.error(`GIT Error adding file: ${newFile}`);
      core.error(err as Error);
    });
  }
}

/**
 * Replace variables in content
 * @param variables - Map of variables
 * @param content - Content to replace variables
 * @returns {string} Content with replaced variables
 */
export function replaceVariables(
  variables: Map<string, string>,
  content: string
): string {
  let newContent: string = content.toString();
  variables.forEach((value, key) => {
    newContent = newContent.replaceAll(
      new RegExp(`\\{\\s*_\\s*${key.trim()}\\s*_\\s*\\}`, "g"),
      value
    );
  });
  return newContent;
}

/**
 * Add file to git
 * @param git - SimpleGit instance
 * @param newFile - FileName to add
 * @returns {Promise<string>} Promise that resolves when file is added
 * @throws {Error} Error adding file to git
 */
function gitAdd(git: SimpleGit, newFile: string): Promise<string> {
  return git.add(newFile, err => {
    if (err) {
      throw new Error(`Error adding file: ${newFile}`);
    }
  });
}

export interface FilesParams {
  files: string[];
  variables: Map<string, string>;
  extension: string;
  git?: SimpleGit;
  encodings?: BufferEncoding;
  fsModule?: typeof fs;
}
