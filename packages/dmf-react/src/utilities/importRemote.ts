import type { WebpackEvent, LoadRemoteOptions, ImportRemoteOptions, WebpackContainerScope } from "../types";
import { REMOTE_ENTRY_FILE } from "../constants";

declare global {
    const __webpack_init_sharing__: (parameter: string) => Promise<void>;
    const __webpack_share_scopes__: { default: unknown };
    // eslint-disable-next-line @typescript-eslint/ban-types
    const __webpack_require__: {
        l: (url: string, cb: (event: WebpackEvent) => void, id: string) => Record<string, unknown>;
    };
}

const loadRemote = ({ url, scope, bustRemoteEntryCache }: LoadRemoteOptions) =>
    new Promise<void>((resolve, reject) => {
        const timestamp = bustRemoteEntryCache ? `?t=${new Date().getTime()}` : '';
        __webpack_require__.l(
            `${url}${timestamp}`,
            event => {
                if (event?.type === 'load') {
                    // Script loaded successfully:
                    return resolve();
                }
                const realSrc = event?.target?.src;
                const error = new Error();
                error.message = 'Loading script failed.\n(missing: ' + realSrc + ')';
                error.name = 'ScriptExternalLoadError';
                reject(error);
            },
            scope
        );
    });

const initSharing = async () => {
    if (!__webpack_share_scopes__?.default) {
        await __webpack_init_sharing__('default');
    }
};

const initContainer = async (containerScope: WebpackContainerScope) => {
    try {
        if (!containerScope.__initialized && !containerScope.__initializing) {
            containerScope.__initializing = true;
            await containerScope.init(__webpack_share_scopes__.default);
            containerScope.__initialized = true;
            // @ts-ignore: Deleting a prop we dont control
            delete containerScope.__initializing;
        }
    } catch (error) {
        // If the container throws an error, it is probably because it is not a container.
        // In that case, we can just ignore it.
    }
};

/*
    Dynamically import a remote module using Webpack's loading mechanism:
    https://webpack.js.org/concepts/module-federation/
  */
const importRemote = async <T>({
    remoteUrl,
    scope,
    module,
    bustRemoteEntryCache = false,
}: ImportRemoteOptions): Promise<T> => {
    let moduleFactory: () => T;
    // If the module hasn't been defined yet, go retrive module script.
    if (!window[scope]) {
        // Load the remote and initialize the share scope if it's empty
        await Promise.all([
            loadRemote({
                url: `${remoteUrl}/${REMOTE_ENTRY_FILE}`,
                scope,
                bustRemoteEntryCache,
            }),
            initSharing(),
        ]);
        if (!window[scope]) {
            const error = new Error(`Remote loaded successfully but ${scope} could not be found! Verify that the name is correct in the Webpack configuration!`);
            throw error;
        }
        const [, newModuleFactory] = await Promise.all([
            initContainer(window[scope]),
            window[scope].get(module.startsWith('./') ? module : `./${module}`),
        ]);
        moduleFactory = newModuleFactory;
    } else {
        moduleFactory = await window[scope].get(module.startsWith('./') ? module : `./${module}`);
    }
    return moduleFactory();
};

export default importRemote;
