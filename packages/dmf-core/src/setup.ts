import { version } from "../package.json";
import { type Runtime, RuntimeName } from "./types";

declare global {
  interface Window {
    [RuntimeName]: Runtime;
  }
}

/** Starts the dream-mf runtime init allowing platform to function in a standard way */
export const init = () => {
  window.DreamMF = {
    version: version,
  } as Runtime;
};
