import fs from "fs";
import { SimpleGit } from "simple-git";
import * as core from "@actions/core";
import escapeRegExp from "lodash.escaperegexp";

/**
 * Process files and replace variables
 * @param params - Files parameters see {@link FilesParams}
 */
export async function processFiles(params: FilesParams): Promise<void> {
  const { files, encodings, git, variables, fsModule = fs, extension } = params;

  for (const file of files) {
    await processFile(file);
  }

  async function processFile(file: string) {
    const readFile: string = fsModule.readFileSync(file, {
      encoding: encodings as BufferEncoding
    });

    if (!readFile) {
      return Promise.reject(new Error(`Error reading file: ${file}`));
    }

    const content: string = replaceVariables(variables, readFile);
    const newFile: string = file.replace(extension, "");

    fs.writeFileSync(newFile, content, { encoding: encodings });

    if (!git) {
      core.info(`Skipping git add for file: ${newFile}`);
      return Promise.resolve();
    }

    await gitAdd(git, newFile);
    return Promise.resolve();
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
      new RegExp(`\\{\\s*_\\s*${escapeRegExp(key.trim())}\\s*_\\s*\\}`, "g"),
      value
    );
  });
  return newContent;
}

/**
 * Add file to git
 * @param git - SimpleGit instance
 * @param newFile - FileName to add
 * @returns {Promise<void>} Promise that resolves when file is added
 */
async function gitAdd(git: SimpleGit, newFile: string): Promise<void> {
  await git.add(newFile).catch((err: unknown) => {
    core.error(`GIT Error adding file: ${newFile}`);
    if (err) {
      core.error(err as Error);
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
