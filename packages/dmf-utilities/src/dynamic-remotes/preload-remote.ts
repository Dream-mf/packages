import { DreamMFLogClient } from "@dream.mf/logging";
import { LoadRemoteOptions } from "../types";
import { setupRuntime } from "../core";

/** Preload a remote by url and scope for later lazy loading */
export const preloadRemote = ({
  url,
  scope,
  enableNoCache,
}: LoadRemoteOptions) =>
  new Promise<void>((resolve, reject) => {
    setupRuntime();
    const timestamp = enableNoCache ? `?t=${new Date().getTime()}` : "";
    __webpack_require__.l(
      `${url}${timestamp}`,
      (event) => {
        if (event?.type === "load") {
          // TODO: might want to register this with runtime if this is used to preload and not immediately load
          return resolve();
        }
        const realSrc = event?.target?.src;
        const error = new Error();
        error.message = "Loading script failed.\n(missing: " + realSrc + ")";
        error.name = "ScriptExternalLoadError";
        DreamMFLogClient.logException(
          { url, scope, timestamp, enableNoCache },
          error,
        );
        reject(error);
      },
      scope,
    );
  });
