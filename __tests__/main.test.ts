import * as core from "@actions/core";
import { getFilesByExtension } from "../src/utils/ExtensionFilter";
import { processFiles } from "../src/utils/FileProcessor";
import { pushChanges, run } from "../src/main";
import { InputParams } from "../src/utils/VariableManager";
import simpleGit, { SimpleGit } from "simple-git";

jest.mock("@actions/core");
jest.mock("../src/utils/ExtensionFilter");
jest.mock("../src/utils/FileProcessor");
jest.mock("path");
jest.mock("simple-git");

const mockedSimpleGit = simpleGit as jest.MockedFunction<typeof simpleGit>;
let gitMock: jest.Mocked<SimpleGit>;
const mockedCore = core as jest.Mocked<typeof core>;
const mockedGetFilesByExtension = getFilesByExtension as jest.MockedFunction<typeof getFilesByExtension>;
const mockedProcessFiles = processFiles as jest.MockedFunction<typeof processFiles>;
const inputParams: InputParams = {
  rootDir: "/root",
  userEmail: "test@example.com",
  userName: "Test User",
  extension: ".ts",
  message: "Committing {_amount_} files with extension {_extension_} in directory {_rootDir_}",
  envVars: new Map(),
  ignoredDir: [],
  ignoredVars: [],
  includeSubDir: true,
  encodings: "utf8"
};

beforeEach(() => {
  jest.clearAllMocks();
  gitMock = {
    addConfig: jest.fn().mockImplementation(() => gitMock),
    commit: jest.fn().mockImplementation(() => Promise.resolve()),
    push: jest.fn().mockImplementation(() => Promise.resolve())
  } as unknown as jest.Mocked<SimpleGit>;
  mockedSimpleGit.mockReturnValue(gitMock);
});

test("run should process files when files are found", () => {
  mockedGetFilesByExtension.mockReturnValue(["file1.ts", "file2.ts"]);
  run(inputParams);
  expect(mockedProcessFiles).toHaveBeenCalled();
});

test("run should warn when no files are found", () => {
  mockedGetFilesByExtension.mockReturnValue([]);
  run(inputParams);
  expect(mockedCore.warning).toHaveBeenCalledWith(`No files found with extension ${inputParams.extension} in ${inputParams.rootDir}`);
});

test("pushChanges should commit and push changes successfully", async () => {
  pushChanges(gitMock, inputParams, "Test commit message");
  expect(gitMock.addConfig).toHaveBeenCalledTimes(2);
  expect(gitMock.addConfig).toHaveBeenNthCalledWith(1, "user.name", inputParams.userName);
  expect(gitMock.addConfig).toHaveBeenNthCalledWith(2, "user.email", inputParams.userEmail);
  expect(gitMock.commit).toHaveBeenCalledWith("Test commit message");
  expect(gitMock.push).toHaveBeenCalled();
});