/** Console log prefix for event messages */
export const debugPrefix = `[DREAM.MF-LOGGER]`;

/** Log Config interface for the log listener */
export interface LogConfig {
  debug: Boolean;
  logInfo: Function | undefined;
  logException: Function | undefined;
  logPageView: Function | undefined;
  logEvent: Function | undefined;
}

/** The log levels,
 * Note: WIP and Not Used Yet  */
export const LogLevel = {
  Information: 0,
  Warning: 1,
  Error: 2,
};

/** Log type flag which is decorated in the event */
export const LogType = {
  Info: "INFO",
  Exception: "EXCEPTION",
  PageView: "PAGE_VIEW",
  Event: "EVENT",
};

export type LogInfo = {
  message: string;
  level?: typeof LogLevel;
} & LogCommon;

export type LogException = {
  type: string;
  error: string | Error | Object;
} & LogCommon;

export type LogEvent = {
  eventName: string;
  details?: string | Object;
} & LogCommon;

export type LogPageView = {
  url: string;
} & LogCommon;

export type LogCommon = {
  properties?: Record<string, string>;
};
