export const RuntimeName = 'DreamMF';

export const RuntimeNotFoundError = 'Dream.mf Runtime was not detected. Attempting initialization.';

export interface Remotes {
    url: string;
    scope: string;
    modules: string[]
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

export interface Metadata {
    
}

export interface Runtime {
    version: string;
    environment: string;
    logger?: Logger;
    bundler?: Bundler;
    authentication?: Authentication;
    remotes?: Array<Remotes>;
    plugins?: Array<Plugin>;
}