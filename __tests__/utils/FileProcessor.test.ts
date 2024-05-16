import { FilesParams, processFiles, replaceVariables } from "../../src/utils/FileProcessor";
import fs from "fs";
import simpleGit, { GitError, SimpleGit } from "simple-git";
import * as core from "@actions/core";

jest.mock("@actions/core");
jest.mock("fs", () => ({
  promises: {
    access: jest.fn()
  },
  readFileSync: jest.fn(),
  writeFileSync: jest.fn()
}));
jest.mock("simple-git");
const mockedCore = core as jest.Mocked<typeof core>;
const mockedSimpleGit = simpleGit as jest.MockedFunction<typeof simpleGit>;
let gitMock: jest.Mocked<SimpleGit>;
let params: FilesParams;
describe("FileProcessor", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    params = {
      files: ["test.txt"],
      variables: new Map([["name", "Breno"]]),
      encodings: "utf-8",
      extension: ".txt"
    }
  });
  describe("processFiles", () => {
    it("processes files correctly", () => {
      const mockReadFileSync = jest.spyOn(fs, "readFileSync");
      const mockWriteFileSync = jest.spyOn(fs, "writeFileSync");
      mockReadFileSync.mockReturnValue("Hello, {_name_}!");
      mockWriteFileSync.mockImplementation(() => {
      });
      processFiles(params);
      expect(mockReadFileSync).toHaveBeenCalledWith("test.txt", { encoding: "utf-8" });
      expect(mockWriteFileSync).toHaveBeenCalledWith("test", "Hello, Breno!", { encoding: "utf-8" });
    });

    it("throws error when file cannot be read", async () => {
      const mockReadFileSync = jest.spyOn(fs, "readFileSync");
      mockReadFileSync.mockReturnValue("");
      await expect(processFiles(params)).rejects.toThrow("Error reading file: test.txt");
    });
  });

  describe("replaceVariables", () => {
    it("replaces variables correctly", () => {
      const variables = new Map([["name", "Breno"]]);
      const content = "Hello, {_name_}!";
      const result = replaceVariables(variables, content);
      expect(result).toBe("Hello, Breno!");
    });

    it("returns original content when no variables match", () => {
      const variables = new Map([["name", "Breno"]]);
      const content = "Hello, world!";
      const result = replaceVariables(variables, content);
      expect(result).toBe("Hello, world!");
    });
  });

  describe("gitAdd", () => {
    beforeEach(() => {
      gitMock = {
        add: jest.fn().mockImplementation(() => Promise.resolve()),
        addConfig: jest.fn().mockImplementation(() => gitMock),
        commit: jest.fn().mockImplementation(() => Promise.resolve()),
        push: jest.fn().mockImplementation(() => Promise.resolve())
      } as unknown as jest.Mocked<SimpleGit>;
      mockedSimpleGit.mockReturnValue(gitMock);
      params = {
        files: ["test.prp.txt"],
        variables: new Map([["name", "Breno"]]),
        encodings: "utf-8",
        extension: ".prp",
        git: gitMock
      };
    });

    it("git add and commit", async () => {
      const mockReadFileSync = jest.spyOn(fs, "readFileSync");
      const mockWriteFileSync = jest.spyOn(fs, "writeFileSync");
      mockReadFileSync.mockReturnValue("Hello, {_name_}!");
      mockWriteFileSync.mockImplementation(() => {
      });
      await processFiles(params);
      expect(mockReadFileSync).toHaveBeenCalledWith("test.prp.txt", { encoding: "utf-8" });
      expect(mockWriteFileSync).toHaveBeenCalledWith("test.txt", "Hello, Breno!", { encoding: "utf-8" });
      expect(gitMock.add).toHaveBeenCalledWith("test.txt");
    });
    it("git add catch error", async () => {
      const mockReadFileSync = jest.spyOn(fs, "readFileSync");
      const mockWriteFileSync = jest.spyOn(fs, "writeFileSync");
      mockReadFileSync.mockReturnValue("Hello, {_name_}!");
      mockWriteFileSync.mockImplementation(() => {
      });

      gitMock.add.mockRejectedValue(new GitError(undefined, "Error adding file"));
      await processFiles(params);

      expect(mockReadFileSync).toHaveBeenCalledWith("test.prp.txt", { encoding: "utf-8" });
      expect(mockWriteFileSync).toHaveBeenCalledWith("test.txt", "Hello, Breno!", { encoding: "utf-8" });
      expect(gitMock.add).toHaveBeenCalledWith("test.txt");
      expect(mockedCore.error).toHaveBeenCalledWith("GIT Error adding file: test.txt");
      expect(mockedCore.error).toHaveBeenCalledTimes(2);
    });
  });
});