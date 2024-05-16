import { useEffect } from "react";
import { LogConfig, LogType, debugPrefix } from "./types";
import core from "./core";

/** Log listener configuration settings and function callbacks */
export const logConfig = {
  /** If set to true, all logs will also be piped to console.log */
  debug: false,
  logGeneral: undefined,
  logAuthentication: undefined,
  logException: undefined,
  logPageView: undefined,
  logFetch: undefined,
  logFederation: undefined,
  logEvent: undefined,
};

/** Interface for the log listener config */
export interface LogListenerProps {
  config: LogConfig;
}

/** Empty function to swallow logs, can be used later to log to console generically */
const _noop = () => null;

/** Handle the event and append any extra config based logic */
const _handleEvent = (config, event, type, func) => {
  if (config.debug) {
    console.log(debugPrefix, "[DEBUG]", type, event.detail);
  }
  func(event);
};

/** Log Listener, usually found int he host, which requires config and debug flags.
 * This listener allows you to subscribe to global log events and apply your own log aggregator.
 * @param config: The log configuration flags and callback functions.
 */
export const DreamMFLogListener = ({ config }: LogListenerProps) => {
  /** On mount register and unregister event listeners if the config function is */
  useEffect(() => {
    core.setupRuntime(config);
    RegisterListeners(config);
    return () => {
      DeregisterListeners(config);
    };
  }, []);

  /** Return nothing, in case we are using this in JSX */
  return null;
};

/** Registers event listeners and appens a _noop for events not listened for */
export const RegisterListeners = (config: LogConfig) => {
  config.logGeneral &&
    window.addEventListener(LogType.General, (event) => {
      _handleEvent(config, event, LogType.General, config.logGeneral);
    });
  config.logAuthentication &&
    window.addEventListener(LogType.Authentication, (event) => {
      _handleEvent(
        config,
        event,
        LogType.Authentication,
        config.logAuthentication,
      );
    });
  config.logException &&
    window.addEventListener(LogType.Exception, (event) => {
      _handleEvent(config, event, LogType.Exception, config.logException);
    });
  config.logPageView &&
    window.addEventListener(LogType.PageView, (event) => {
      _handleEvent(config, event, LogType.PageView, config.logPageView);
    });
  config.logFederation &&
    window.addEventListener(LogType.Federation, (event) => {
      _handleEvent(config, event, LogType.Federation, config.logFederation);
    });
  config.logFetch &&
    window.addEventListener(LogType.Fetch, (event) => {
      _handleEvent(config, event, LogType.Fetch, config.logFetch);
    });
  config.logEvent &&
    window.addEventListener(LogType.Event, (event) => {
      _handleEvent(config, event, LogType.Event, config.logEvent);
    });
};

/** Removes event listeners and appends the _noop */
export const DeregisterListeners = (config: LogConfig) => {
  config.logEvent &&
    window.removeEventListener(LogType.General, config.logEvent || _noop());
  config.logAuthentication &&
    window.removeEventListener(
      LogType.Authentication,
      config.logAuthentication || _noop(),
    );
  config.logException &&
    window.removeEventListener(
      LogType.Exception,
      config.logException || _noop(),
    );
  config.logPageView &&
    window.removeEventListener(LogType.PageView, config.logPageView || _noop());
  config.logFetch &&
    window.removeEventListener(LogType.Fetch, config.logFetch || _noop());
  config.logFederation &&
    window.removeEventListener(
      LogType.Federation,
      config.logFederation || _noop(),
    );
  config.logEvent &&
    window.removeEventListener(LogType.Event, config.logEvent || _noop());
};

export default {
  logConfig,
  DreamMFLogListener,
  RegisterListeners,
  DeregisterListeners,
};
