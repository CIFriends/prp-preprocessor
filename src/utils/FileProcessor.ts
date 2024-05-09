import fs from "fs";

export function processFiles(params: FilesParams): void {
  const { files, encodings, variables, fsModule = fs, extension } = params;

  files.forEach(file => {
    processFile(file);
  });

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
  }
}

export function replaceVariables(
  variables: Map<string, string>,
  content: string
): string {
  let newContent: string = content;
  variables.forEach((value, key) => {
    newContent = newContent.replaceAll(
      new RegExp(`\\{\\s*_\\s*${key.trim()}\\s*_\\s*\\}`, "g"),
      value
    );
  });
  return newContent;
}

export interface FilesParams {
  files: string[];
  variables: Map<string, string>;
  extension: string;
  encodings?: BufferEncoding;
  fsModule?: typeof fs;
}
