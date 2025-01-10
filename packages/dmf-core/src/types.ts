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
