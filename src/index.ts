/**
 * The entrypoint for the action.
 */
import { run } from "./main";
import { getInputParams } from "./utils/VariableManager";
import * as core from "@actions/core";

try {
  void run(getInputParams());
} catch (error) {
  if (error instanceof Error) core.setFailed(error.message);
}
