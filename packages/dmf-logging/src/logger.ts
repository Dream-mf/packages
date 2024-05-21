import {
	LogCommon,
	LogEvent,
	LogException,
	LogInfo,
	LogPageView,
	LogType,
} from "./types";

/** Massage the details object s its a better fit for log event messages */
const _extendDetail = <T extends LogCommon>(detail: T): T => {
	detail.properties
		? (detail.properties.location = window.location.href)
		: (detail.properties = { location: window.location.href });
	if (detail.properties) {
		Object.keys(detail.properties).forEach((key) => {
			if (typeof detail.properties[key] == "number") {
				detail.properties[key] = detail.properties[key].toString();
			}
		});
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
		window.dispatchEvent(customEvent);
	},
	/** Function call forwarder setting custom event type to LogType Exception */
	logException: (exception: LogException) => {
		_extendDetail(exception);
		const customEvent = new CustomEvent(LogType.Exception, {
			detail: exception,
		});
		window.dispatchEvent(customEvent);
	},
	/** Function call forwarder setting custom event type to LogType Event */
	logEvent: (event: LogEvent) => {
		_extendDetail(event);
		const customEvent = new CustomEvent(LogType.Event, { detail: event });
		window.dispatchEvent(customEvent);
	},
	/** Function call forwarder setting custom event type to LogType PageView */
	logPageView: (detail: LogPageView) => {
		_extendDetail(detail);
		const customEvent = new CustomEvent(LogType.PageView, {
			detail,
		});
		window.dispatchEvent(customEvent);
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

export default {
	DreamMFLogClient,
};
