import fs from "fs";
import path from "path";
import { getFilesByExtension } from "../../src/utils/ExtensionFilter";

jest.mock("fs", () => ({
  promises: {
    access: jest.fn()
  },
  readdirSync: jest.fn(),
  statSync: jest.fn()
}));

const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedPath = path;
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

  it("should return an empty array when the directory is in the ignored list", () => {
    const dir = "node_modules";
    const extension = ".prp";

    mockedFs.readdirSync.mockReturnValue([
      {
        name: "file1.prp.ts",
        isDirectory: () => false,
        isFile: () => true
      }
    ] as fs.Dirent[]);

    const files = getFilesByExtension({ dir, extension, fsModule: mockedFs, pathModule: mockedPath, ignoredDir: [dir] });

    expect(files).toEqual([]);
  });

  it("should return files from subdirectories", () => {
    const dir = ".";
    const extension = ".prp";

    mockedFs.readdirSync.mockReturnValueOnce([
      {
        name: "subdir",
        isDirectory: () => true,
        isFile: () => false
      },
      {
        name: "file1.prp.ts",
        isDirectory: () => false,
        isFile: () => true
      }
    ] as fs.Dirent[]);
    mockedFs.readdirSync.mockReturnValueOnce([
      {
        name: "file2.prp.ts",
        isDirectory: () => false,
        isFile: () => true
      }
    ] as fs.Dirent[]);

    mockedFs.statSync.mockReturnValue({
      isDirectory: () => false
    } as fs.Stats);

    const files = getFilesByExtension({ dir, extension, fsModule: mockedFs, pathModule: mockedPath });

    const expectedArray = [path.join("subdir", "file2.prp.ts"), path.join("file1.prp.ts")];
    expect(files).toEqual(expectedArray);
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
        isDirectory: () => false,
        isFile: () => true
      },
      {
        name: "file2.js",
        isDirectory: () => false,
        isFile: () => true
      },
      {
        name: "file3.prp.ts",
        isDirectory: () => false,
        isFile: () => true
      },
      {
        name: "file3.prp.md",
        isDirectory: () => false,
        isFile: () => true
      }
    ] as fs.Dirent[]);

    // Mock fs.statSync to return a Stats object
    mockedFs.statSync.mockReturnValue({
      isDirectory: () => false
    } as fs.Stats);

    const files = getFilesByExtension({ dir, extension, fsModule: mockedFs, pathModule: mockedPath });

    expect(files).toEqual(["file3.prp.ts", "file3.prp.md"]);
  });
});