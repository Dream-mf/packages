/** Console log prefix for event messages */
export const debugPrefix = `[ODYSSEY-LOGGER]`;

/** Log Config interface for the log listener */
export interface LogConfig {
    debug: Boolean,
    logGeneral: Function | undefined,
    logAuthentication: Function | undefined,
    logException: Function | undefined,
    logPageView: Function | undefined,
    logFetch: Function | undefined,
    logEvent: Function | undefined,
}

/** The log levels, 
 * Note: WIP and Not Used Yet  */
export const LogLevel = {
    Information: 0,
    Warning: 1,
    Error: 2
}

/** Log type flag which is decorated in the event */
export const LogType = {
    General: 'GENERAL',
    Authentication: 'AUTHENTICATION',
    Exception: 'EXCEPTION',
    PageView: 'PAGE_VIEW',
    Fetch: 'FETCH',
    Event: 'EVENT'
}

export default {
    LogLevel,
    LogType,
    debugPrefix
};
