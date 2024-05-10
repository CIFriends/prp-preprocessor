import { getEnvVariables, getInputParams, InputParams } from "../../src/utils/VariableManager";
import * as core from "@actions/core";
import { BufferEncoding } from "@vercel/ncc/dist/ncc/loaders/typescript/lib/typescript";

jest.mock('@actions/core');

describe('VariableManager', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('getEnvVariables', () => {
    it('returns all environment variables excluding ignored ones', () => {
      process.env = { VAR1: 'value1', VAR2: 'value2', VAR3: 'value3' };
      const ignored = ['VAR2'];
      const result = getEnvVariables(ignored);
      expect(result).toEqual(new Map([['VAR1', 'value1'], ['VAR3', 'value3']]));
    });

    it('returns empty map if all environment variables are ignored', () => {
      process.env = { VAR1: 'value1', VAR2: 'value2' };
      const ignored = ['VAR1', 'VAR2'];
      const result = getEnvVariables(ignored);
      expect(result).toEqual(new Map());
    });
  });

  describe('getInputParams', () => {
    it('returns all input parameters', () => {
      const mockedCore = core as jest.Mocked<typeof core>;
      mockedCore.getInput.mockImplementation((name: string) => {
        switch (name) {
          case 'rootDir':
            return '/root/dir';
          case 'extension':
            return '.ts';
          case 'encodings':
            return 'utf8' as BufferEncoding;
          default:
            return '';
        }
      });
      mockedCore.getBooleanInput.mockReturnValue(true);
      mockedCore.getMultilineInput.mockReturnValue(['VAR1', 'VAR2']);

      const result = getInputParams();
      const expected: InputParams = {
        rootDir: '/root/dir',
        extension: '.ts',
        ignoredVars: ['VAR1', 'VAR2'],
        ignoredDir: ['VAR1', 'VAR2'],
        envVars: new Map(),
        includeSubDir: true,
        encodings: 'utf8'
      };
      expect(result).toEqual(expected);
    });
  });
});