export interface ImportRemoteOptions {
    /** The name of the variable in Azure App Config, a prefix of Remote will be used. */
    remoteName: string;
    /** The webpack remote name being exposed, eg: "home" */
    scope: string;
    /** The module (component) being exposed, eg: "Application" */
    module: string;
    /** The URL for the remote to use, short circuits Azure App Config */
    remoteUrl?: string | undefined;
    bustRemoteEntryCache?: boolean;
}

export interface LoadRemoteOptions {
    url: string;
    scope: string;
    bustRemoteEntryCache?: boolean;
}

export interface WebpackEvent {
    type: string;
    target: Record<string, unknown>;
}

export interface WebpackContainerScope {
    __initialized: boolean;
    __initializing: boolean;
    init(scopes: unknown): Promise<Record<string, unknown>>;
}