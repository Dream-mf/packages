export interface ImportRemoteOptions {
  /** The url of the remote you want to use. */
  remoteUrl: string;
  /** The bundler remote name being exposed, eg: "faq" */
  scope: string;
  /** The module (component) being exposed, eg: "Application" */
  module: string;
  /** The URL for the remote to use, short circuits Azure App Config */
  remoteUrlFallback?: string | null | undefined;
  /** Should we postfix the url with a timestamp so its unique and the browser doesnt cache it */
  enableNoCache?: boolean;
}

export interface LoadRemoteOptions {
  /** The url of the remote you want to use. */
  url: string;
  /** The bundler remote name being exposed, eg: "faq" */
  scope: string;
  /** Should we postfix the url with a timestamp so its unique and the browser doesnt cache it */
  enableNoCache?: boolean;
}
