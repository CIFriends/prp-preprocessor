import * as core from "@actions/core";
import { BufferEncoding } from "@vercel/ncc/dist/ncc/loaders/typescript/lib/typescript";
import { ignoredDefault } from "./ExtensionFilter";

/**
 * Required input parameters
 */
const required: { required: boolean } = { required: true };

/**
 * Get all environment variables
 * @param ignored - List of environment variables to ignore
 * @returns {Map<string, string>} Map of environment variables
 */
export function getEnvVariables(ignored: string[]): Map<string, string> {
  return new Map(
    Object.entries(process.env)
      .filter(([key]) => !ignored.includes(key))
      .map(([key, value]) => [key, value?.toString() ?? ""])
  );
}

/**
 * Get all input parameters
 * @returns {InputParams} Input parameters
 */
export function getInputParams(): InputParams {
  const rootDir: string = core.getInput("rootDir", required);
  const extension: string = core.getInput("extension", required);
  const message: string = core.getInput("commitMessage", required);
  const includeSubDir: boolean = core.getBooleanInput(
    "includeSubDirs",
    required
  );
  const ignoredVars: string[] = core.getMultilineInput("ignoredVars");
  const ignoredDir: string[] = core.getMultilineInput("ignoredDirs");
  ignoredDir.push(...ignoredDefault);
  const includeAuthor: boolean = core.getBooleanInput("includeAuthor");
  const userEmail: string = core.getInput("userEmail", required);
  const userName: string = core.getInput("userName", required);
  const encodings: BufferEncoding = core.getInput(
    "encodings"
  ) as BufferEncoding;
  const envVars: Map<string, string> = getEnvVariables(ignoredVars);
  return {
    rootDir,
    extension,
    message,
    ignoredVars,
    ignoredDir,
    envVars,
    includeAuthor,
    includeSubDir,
    userEmail,
    userName,
    encodings
  };
}

export interface InputParams {
  rootDir: string;
  extension: string;
  message: string;
  ignoredVars: string[];
  ignoredDir: string[];
  includeAuthor: boolean;
  includeSubDir: boolean;
  envVars: Map<string, string>;
  userEmail: string;
  userName: string;
  encodings: BufferEncoding;
}
