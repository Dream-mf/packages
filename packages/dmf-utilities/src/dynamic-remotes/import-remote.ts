import { registerRuntimeRemote } from "@dream.mf/core";
import { DreamMFLogClient } from "@dream.mf/logging";
import { registerRemotes } from "@module-federation/runtime";
import { setupRuntime } from "../core";
import type { ImportRemoteOptions, LoadRemoteOptions } from "../types";

/** ==================================================================================== */

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

/** ==================================================================================== */

const _initSharing = async () => {
	if (!__webpack_share_scopes__?.default) {
		await __webpack_init_sharing__("default");
	}
};

const _initContainer = async (containerScope: WebpackContainerScope) => {
	try {
		if (!containerScope.__initialized && !containerScope.__initializing) {
			containerScope.__initializing = true;
			await containerScope.init(__webpack_share_scopes__.default);
			containerScope.__initialized = true;
			// biome-ignore lint/performance/noDelete: <explanation>
			delete containerScope.__initializing;
		}
	} catch (error) {
		// If the container throws an error, it is probably because it is not a container.
		// In that case, we can just ignore it.
	}
};

/** ==================================================================================== */

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
				error.message = `Loading script failed.\n(missing: ${realSrc})`;
				error.name = "ScriptExternalLoadError";
				DreamMFLogClient.logException({
					type: error.name,
					error,
					properties: {
						url,
						scope,
					},
				});
				reject(error);
			},
			scope,
		);
	});

/** Imports a remote for use with module federation, loads remote if not preloaded. */
export const importRemote = async <T>({
	remoteUrl,
	scope,
	module,
	remoteUrlFallback,
	enableNoCache = false,
}: ImportRemoteOptions): Promise<T> => {
	setupRuntime();
	if (!window[scope]) {
		const remoteDetails = remoteUrlFallback
			? { value: remoteUrlFallback }
			: { value: remoteUrl };

		// Load the remote and initialize the share scope if it's empty
		await Promise.all([
			preloadRemote({
				url: remoteDetails.value,
				scope,
				enableNoCache,
			}),
			_initSharing(),
			async () => {
				registerRuntimeRemote(scope, null, remoteDetails.value);
			},
		]);
		if (!window[scope]) {
			const error = new Error(
				`Remote loaded successfully but ${scope} could not be found! Verify that the name is correct in the configuration!`,
			);
			DreamMFLogClient.logException({
				type: "REMOTE_MODULE_LOAD_EXCEPTION",
				error,
				properties: {
					url: remoteUrl,
					remoteUrlFallback,
					scope,
					module,
				},
			});
			throw error;
		}
		// Initialize the container to get shared modules and get the module factory:
		const [, moduleFactory] = await Promise.all([
			_initContainer(window[scope]),
			window[scope].get(module.startsWith("./") ? module : `./${module}`),
		]);
		registerRemotes([
			{
				name: scope,
				entry: remoteDetails.value,
			},
		]);
		registerRuntimeRemote(scope, module, remoteDetails.value);
		DreamMFLogClient.logEvent({
			eventName: "REMOTE_MODULE_LOADED",
			details: remoteDetails.value,
			properties: {
				scope,
				module,
			},
		});
		return moduleFactory();
		// biome-ignore lint/style/noUselessElse: <explanation>
	} else {
		const moduleFactory = await window[scope].get(
			module.startsWith("./") ? module : `./${module}`,
		);
		return moduleFactory();
	}
};

export default {
	importRemote,
	preloadRemote,
};
