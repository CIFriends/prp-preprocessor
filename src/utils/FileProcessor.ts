import fs from "fs";
import * as core from "@actions/core";

export function processFiles(params: FilesParams): void {
  const { files, encodings, variables, fsModule = fs, extension } = params;

  files.forEach(file => {
    try {
      processFile(file);
    } catch (error) {
      core.error(`Error processing file: ${file}`);
      if (error instanceof Error) {
        core.error(error.message);
      }
    }
  });

  function processFile(file: string) {
    const readFile: string = fsModule.readFileSync(file, {
      encoding: encodings as BufferEncoding
    });

    if (!readFile) throw new Error(`Error reading file: ${file}`);

    const content: string = replaceVariables(variables, readFile);
    const newFile: string = file.replace(extension, "");

    fs.writeFileSync(newFile, content, { encoding: encodings });
  }
}

export function replaceVariables(
  variables: Map<string, string>,
  content: string
): string {
  variables.forEach((value, key) => {
    content = content.replaceAll(
      new RegExp(`\\{\\s*_\\s*${key.trim()}\\s*_\\s*\\}`, "g"),
      value
    );
  });
  return content;
}

export interface FilesParams {
  files: string[];
  variables: Map<string, string>;
  extension: string;
  encodings?: BufferEncoding;
  fsModule?: typeof fs;
}
