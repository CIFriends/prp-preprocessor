import { FilesParams, processFiles, replaceVariables } from "../../src/utils/FileProcessor";
import fs from 'fs';

jest.mock("fs", () => ({
  promises: {
    access: jest.fn()
  },
  readFileSync: jest.fn(),
  writeFileSync: jest.fn()
}));

describe('FileProcessor', () => {
  describe('processFiles', () => {
    it('processes files correctly', () => {
      const mockReadFileSync = jest.spyOn(fs, 'readFileSync');
      const mockWriteFileSync = jest.spyOn(fs, 'writeFileSync');
      mockReadFileSync.mockReturnValue('Hello, {_name_}!');
      mockWriteFileSync.mockImplementation(() => {});

      const params: FilesParams = {
        files: ['test.txt'],
        variables: new Map([['name', 'Breno']]),
        encodings: 'utf-8',
        extension: '.txt'
      };

      processFiles(params);

      expect(mockReadFileSync).toHaveBeenCalledWith('test.txt', { encoding: 'utf-8' });
      expect(mockWriteFileSync).toHaveBeenCalledWith('test', 'Hello, Breno!', { encoding: 'utf-8' });
    });

    it('throws error when file cannot be read', () => {
      const mockReadFileSync = jest.spyOn(fs, 'readFileSync');
      mockReadFileSync.mockReturnValue('');

      const params: FilesParams = {
        files: ['test.txt'],
        variables: new Map([['name', 'Breno']]),
        encodings: 'utf-8',
        extension: '.txt'
      };

      expect(() => processFiles(params)).toThrow('Error reading file: test.txt');
    });
  });

  describe('replaceVariables', () => {
    it('replaces variables correctly', () => {
      const variables = new Map([['name', 'Breno']]);
      const content = 'Hello, {_name_}!';

      const result = replaceVariables(variables, content);

      expect(result).toBe('Hello, Breno!');
    });

    it('returns original content when no variables match', () => {
      const variables = new Map([['name', 'Breno']]);
      const content = 'Hello, world!';

      const result = replaceVariables(variables, content);

      expect(result).toBe('Hello, world!');
    });
  });
});