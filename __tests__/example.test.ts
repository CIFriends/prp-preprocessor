import { processFiles } from '../src/utils/FileProcessor';
import fs from 'fs';
import { getFilesByExtension } from "../src/utils/ExtensionFilter";

jest.mock("fs", () => ({
  promises: {
    access: jest.fn()
  }
}));
const extension = ".prp";
const dir = ".";
describe('FileProcessor Example', () => {
  describe('processFiles in real path', () => {
    it('should process .prp.md files in example/ directory', () => {
      const files = getFilesByExtension({ dir, extension })
      const variables = new Map<string, string>();
      variables.set('what', 'Hello');
      variables.set('EXAMPLE', 'World');
      const encodings = 'utf8' as BufferEncoding;

      processFiles({ files, variables, encodings, extension });
      files.forEach(file => {
        const content = fs.readFileSync(file.replace(extension, ""), { encoding: 'utf8' });
        expect(content).not.toContain('{_EXAMPLE_}');
        expect(content).not.toContain('{_what_}');
      });
    });
  });
});