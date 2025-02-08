import {
  type LogCommon,
  type LogEvent,
  type LogException,
  type LogInfo,
  type LogPageView,
  LogType,
} from './types';

/** Massage the details object s its a better fit for log event messages */
const _extendDetail = <T extends LogCommon>(detail: T): T => {
  if (typeof window !== 'undefined') {
    detail.properties
      ? // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
        (detail.properties.location = window.location.href)
      : // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
        (detail.properties = { location: window.location.href });
    if (detail.properties) {
      // biome-ignore lint/complexity/noForEach: <explanation>
      Object.keys(detail.properties).forEach((key) => {
        if (typeof detail.properties[key] === 'number') {
          //@ts-expect-error
          detail.properties[key] = detail.properties[key].toString();
        }
      });
    }
  }
  return detail;
};

/** Log client instance which has function calls for logging and setting specific log type events */
export const DreamMFLogClient = {
  /** Function call forwarder setting custom event type to LogType General */
  logInfo: (detail: LogInfo) => {
    _extendDetail(detail);
    const customEvent = new CustomEvent(LogType.Info, {
      detail,
    });
    typeof window !== 'undefined' && window.dispatchEvent(customEvent);
  },
  /** Function call forwarder setting custom event type to LogType Exception */
  logException: (exception: LogException) => {
    _extendDetail(exception);
    const customEvent = new CustomEvent(LogType.Exception, {
      detail: exception,
    });
    typeof window !== 'undefined' && window.dispatchEvent(customEvent);
  },
  /** Function call forwarder setting custom event type to LogType Event */
  logEvent: (event: LogEvent) => {
    _extendDetail(event);
    const customEvent = new CustomEvent(LogType.Event, { detail: event });
    typeof window !== 'undefined' && window.dispatchEvent(customEvent);
  },
  /** Function call forwarder setting custom event type to LogType PageView */
  logPageView: (detail: LogPageView) => {
    _extendDetail(detail);
    const customEvent = new CustomEvent(LogType.PageView, {
      detail,
    });
    typeof window !== 'undefined' && window.dispatchEvent(customEvent);
  },
};

export const createScopedLogger = (properties: LogCommon) => {
  return {
    logInfo: (info: LogInfo) => {
      DreamMFLogClient.logInfo({ ...properties, ...info });
    },
    logException: (error: LogException) => {
      DreamMFLogClient.logException({ ...properties, ...error });
    },
    logEvent: (event: LogEvent) => {
      DreamMFLogClient.logEvent({ ...properties, ...event });
    },
    logPageView: (pageView: LogPageView) => {
      DreamMFLogClient.logPageView({ ...properties, ...pageView });
    },
  };
};
