import * as core from "@actions/core";
import { getFilesByExtension } from "../src/utils/ExtensionFilter";
import { processFiles } from "../src/utils/FileProcessor";
import { run } from "../src/main";
import { InputParams } from "../src/utils/VariableManager";

jest.mock("@actions/core");
jest.mock("../src/utils/ExtensionFilter");
jest.mock("../src/utils/FileProcessor");
jest.mock("path");

const mockedCore = core as jest.Mocked<typeof core>;
const mockedGetFilesByExtension = getFilesByExtension as jest.MockedFunction<typeof getFilesByExtension>;
const mockedProcessFiles = processFiles as jest.MockedFunction<typeof processFiles>;
const inputParams: InputParams = {
  rootDir: "/root",
  userEmail: "",
  userName: "",
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