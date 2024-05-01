export const RuntimeName = 'DreamMF';

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

export interface Runtime {
    version: string;
    logger?: Logger;
    bundler?: Bundler;
    authentication?: Authentication;
    remotes?: Array<Remotes>;
}