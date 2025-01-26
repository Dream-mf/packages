import { useEffect } from "react";
import core from "./core";
import { type LogConfig, LogType, debugPrefix } from "./types";

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
  }, [config]);

  /** Return nothing, in case we are using this in JSX */
  return null;
};

/** Registers event listeners and appens a _noop for events not listened for */
export const RegisterListeners = (config: LogConfig) => {
  config.logInfo &&
    window.addEventListener(LogType.Info, (event) => {
      _handleEvent(config, event, LogType.Info, config.logInfo);
    });
  config.logException &&
    window.addEventListener(LogType.Exception, (event) => {
      _handleEvent(config, event, LogType.Exception, config.logException);
    });
  config.logPageView &&
    window.addEventListener(LogType.PageView, (event) => {
      _handleEvent(config, event, LogType.PageView, config.logPageView);
    });
  config.logEvent &&
    window.addEventListener(LogType.Event, (event) => {
      _handleEvent(config, event, LogType.Event, config.logEvent);
    });
};

/** Removes event listeners and appends the _noop */
export const DeregisterListeners = (config: LogConfig) => {
  config.logEvent &&
    window.removeEventListener(LogType.Event, config.logEvent || _noop());
  config.logException &&
    window.removeEventListener(
      LogType.Exception,
      config.logException || _noop(),
    );
  config.logPageView &&
    window.removeEventListener(LogType.PageView, config.logPageView || _noop());
  config.logInfo &&
    window.removeEventListener(LogType.Info, config.logInfo || _noop());
};

export default {
  DreamMFLogListener,
  RegisterListeners,
  DeregisterListeners,
};
