// @ts-nocheck
import { registerRemotes } from "@module-federation/enhanced/runtime";
import { DreamMFLogClient } from "@dream.mf/logging";
import { registerRemote } from "@dream.mf/core";

declare global {
  interface WebpackEvent {
    type: string;
    target: Record<string, unknown>;
  }

  interface WebpackContainerScope {
    __initialized: boolean;
    __initializing: boolean;
    init(scopes: unknown): Promise<Record<string, unknown>>;
  }

  const __webpack_init_sharing__: (parameter: string) => Promise<void>;
  const __webpack_share_scopes__: { default: unknown };
  // eslint-disable-next-line @typescript-eslint/ban-types
  const __webpack_require__: {
    l: (
      url: string,
      cb: (event: WebpackEvent) => void,
      id: string,
    ) => Record<string, unknown>;
  };
}

interface ImportRemoteOptions {
  /** The url of the remote you want to use. */
  remoteUrl: string;
  /** The webpack remote name being exposed, eg: "faq" */
  scope: string;
  /** The module (component) being exposed, eg: "Application" */
  module: string;
  /** The URL for the remote to use, short circuits Azure App Config */
  remoteUrlFallback?: string | null | undefined;
  /** Should we postfix the url with a timestamp so its unique and the browser doesnt cache it */
  enableNoCache?: boolean;
}

interface LoadRemoteOptions {
  url: string;
  scope: string;
  enableNoCache?: boolean;
}

const loadRemote = ({ url, scope, enableNoCache }: LoadRemoteOptions) =>
  new Promise<void>((resolve, reject) => {
    const timestamp = enableNoCache ? `?t=${new Date().getTime()}` : "";
    __webpack_require__.l(
      `${url}${timestamp}`,
      (event) => {
        if (event?.type === "load") {
          // Script loaded successfully:
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

const initSharing = async () => {
  if (!__webpack_share_scopes__?.default) {
    await __webpack_init_sharing__("default");
  }
};

const initContainer = async (containerScope: WebpackContainerScope) => {
  try {
    if (!containerScope.__initialized && !containerScope.__initializing) {
      containerScope.__initializing = true;
      await containerScope.init(__webpack_share_scopes__.default);
      containerScope.__initialized = true;
      delete containerScope.__initializing;
    }
  } catch (error) {
    // If the container throws an error, it is probably because it is not a container.
    // In that case, we can just ignore it.
  }
};

const importRemote = async <T>({
  remoteUrl,
  scope,
  module,
  remoteUrlFallback,
  enableNoCache = false,
}: ImportRemoteOptions): Promise<T> => {
  if (!window[scope]) {
    const remoteDetails = remoteUrlFallback
      ? { value: remoteUrlFallback }
      : { value: remoteUrl };

    // Load the remote and initialize the share scope if it's empty
    await Promise.all([
      loadRemote({
        url: remoteDetails.value,
        scope,
        enableNoCache,
      }),
      initSharing(),
    ]);
    registerRemote(scope, module, remoteDetails.value);
    DreamMFLogClient.logGeneral({
      message: "Loaded a remote through module federation",
      url: remoteDetails.value,
      scope,
      module,
      remoteUrlFallback,
      enableNoCache,
    });
    if (!window[scope]) {
      const error = new Error(
        `Remote loaded successfully but ${scope} could not be found! Verify that the name is correct in the Webpack configuration!`,
      );
      console.log({ error });
      DreamMFLogClient.logException(
        { url: remoteUrl, scope, module, remoteUrlFallback, enableNoCache },
        error,
      );
      throw error;
    }
    // Initialize the container to get shared modules and get the module factory:
    const [, moduleFactory] = await Promise.all([
      initContainer(window[scope]),
      window[scope].get(module.startsWith("./") ? module : `./${module}`),
    ]);
    registerRemotes([
      {
        name: scope,
        entry: remoteDetails.value,
      },
    ]);
    return moduleFactory();
  } else {
    const moduleFactory = await window[scope].get(
      module.startsWith("./") ? module : `./${module}`,
    );
    return moduleFactory();
  }
};

export default importRemote;
