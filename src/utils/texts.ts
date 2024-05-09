export const SEARCH_TEXT: (extension: string, rootDir: string) => string = (
  extension: string,
  rootDir: string
) =>
  `Searching for files with extension: ${extension} in directory: ${rootDir}...`;
