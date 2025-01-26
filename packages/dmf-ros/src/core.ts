import {
  RuntimeNotFoundError,
  init,
  registerRuntimePlugin,
  validateRuntime,
  validateRuntimeProperty,
} from "@dream.mf/core";
import { version } from "../package.json";

export interface RosPluginResult {
  package: string;
  baseUrl: string;
  accessLeu: string;
}

/**  Validates the runtime is installed, if so, validates if the plugin is setup.
 *   If its missing, it will set up the logger with the dream-mf runtime */
export const setupRosRuntime = (baseUrl, accessKey) => {
  if (!validateRuntime()) {
    console.warn(RuntimeNotFoundError);
    init();
  }
  registerRuntimePlugin("ros", {
    package: `@dream.mf/ros:${version}`,
    baseUrl: baseUrl,
    accessKey: accessKey,
  });
};

/** A function that allows you to pull ros details from the runtime */
export const getSettingsFromRuntime = (): RosPluginResult | null => {
  if (!validateRuntimeProperty("plugins")) {
    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    return window["DreamMF"]["plugins"]["ros"] as unknown as RosPluginResult;
  }
  return null;
};

export default {
  getSettingsFromRuntime,
  setupRosRuntime,
};
