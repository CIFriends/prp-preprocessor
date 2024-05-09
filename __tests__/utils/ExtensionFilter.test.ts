import fs from "fs";
import path from "path";
import { getFilesByExtension } from "../../src/utils/ExtensionFilter";

jest.mock("fs", () => ({
  readdirSync: jest.fn(),
  statSync: jest.fn()
}));

jest.mock("path", () => ({
  join: jest.fn()
}));

const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedPath = path as jest.Mocked<typeof path>;
describe("getFilesByExtension", () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    jest.clearAllMocks();
  });

  it("should return an empty array when the directory is empty", () => {
    const dir = ".";
    const extension = ".prp";

    mockedFs.readdirSync.mockReturnValue([] as fs.Dirent[]);

    const files = getFilesByExtension({ dir, extension, fsModule: mockedFs, pathModule: mockedPath });

    expect(files).toEqual([]);
  });

  it("should return files from subdirectories", () => {
    const dir = ".";
    const extension = ".prp";

    mockedFs.readdirSync.mockReturnValueOnce([
      {
        name: "subdir",
        isDirectory: () => true
      },
      {
        name: "file1.prp.ts",
        isDirectory: () => false
      }
    ] as fs.Dirent[]);
    mockedFs.readdirSync.mockReturnValueOnce([
      {
        name: "file2.prp.ts",
        isDirectory: () => false
      }
    ] as fs.Dirent[]);

    mockedFs.statSync.mockReturnValue({
      isDirectory: () => false
    } as fs.Stats);

    mockedPath.join.mockImplementation((...paths: string[]) => paths.join("/"));

    const files = getFilesByExtension({ dir, extension, fsModule: mockedFs, pathModule: mockedPath });

    expect(files).toEqual(["./subdir/file2.prp.ts", "./file1.prp.ts"]);
  });

  it("should throw an error when the directory does not exist", () => {
    const dir = "./nonexistent";
    const extension = ".prp";

    mockedFs.readdirSync.mockImplementation(() => {
      throw new Error("ENOENT: no such file or directory");
    });

    expect(() => getFilesByExtension({ dir, extension, fsModule: mockedFs, pathModule: mockedPath })).toThrow();
  });

  it("should throw an error when the extension is not provided", () => {
    const dir = ".";
    expect(() => getFilesByExtension({ dir, extension: "", fsModule: mockedFs, pathModule: mockedPath })).toThrow();
  });

  it("should return an array of files with the specified extension", () => {
    const dir = ".";
    const extension = ".prp";

    // Use the mocked version of fs.readdirSync
    mockedFs.readdirSync.mockReturnValue([
      {
        name: "file1.ts",
        isDirectory: () => false
      },
      {
        name: "file2.js",
        isDirectory: () => false
      },
      {
        name: "file3.prp.ts",
        isDirectory: () => false
      },
      {
        name: "file3.prp.md",
        isDirectory: () => false
      }
    ] as fs.Dirent[]);

    // Mock fs.statSync to return a Stats object
    mockedFs.statSync.mockReturnValue({
      isDirectory: () => false
    } as fs.Stats);

    // Mock path.join to return the file path
    mockedPath.join.mockImplementation((...paths: string[]) => paths.join("/"));

    const files = getFilesByExtension({ dir, extension, fsModule: mockedFs, pathModule: mockedPath });

    expect(files).toEqual(["./file3.prp.ts", "./file3.prp.md"]);
  });
});