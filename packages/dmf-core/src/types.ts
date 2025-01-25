export const RuntimeName = "DreamMF";

export const RuntimeNotFoundError =
  "Dream.mf Runtime was not detected. Attempting initialization.";

export const RemoteLoad = {
  Preload: "Preload",
  Eager: "Eager",
  Dynamic: "Dynamic",
};

export type RemoteLoadType = (typeof RemoteLoad)[keyof typeof RemoteLoad];

export interface Remotes {
  url: string;
  scope: string;
  modules: string[];
  loadType?: RemoteLoadType;
}

export interface Authentication {
  provider: string;
  config?: object;
}

export interface Bundler {
  provider: string;
  config?: object;
}

export interface Logger {
  provider: string;
  config?: object;
}

export interface Plugin {
  name: string;
  config?: object;
}

export interface Runtime {
  version: string;
  environment: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  profile?: any;
  logger?: Logger;
  bundler?: Bundler;
  authentication?: Authentication;
  remotes?: Array<Remotes>;
  plugins?: Array<Plugin>;
}

export interface ImportRemoteOptions {
  /** The name of the variable in Azure App Config, a prefix of Remote will be used. */
  remoteName: string;
  /** The webpack remote name being exposed, eg: "home" */
  scope: string;
  /** The module (component) being exposed, eg: "Application" */
  module: string;
  /** The URL for the remote to use, short circuits Azure App Config */
  remoteUrl?: string | undefined;
  /** Fallback URL if remoteUrl is not available */
  remoteUrlFallback: string | undefined;
  /** Busting the remote entry cache */
  bustRemoteEntryCache?: boolean;
}

export interface LoadRemoteOptions {
  url: string;
  scope: string;
  bustRemoteEntryCache?: boolean;
}
