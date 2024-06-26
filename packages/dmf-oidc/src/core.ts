import {
	init,
	registerRuntimeProperty,
	validateRuntime,
	validateRuntimeProperty,
} from '@dream.mf/core';
import { version } from '../package.json';
import { DreamMFAuthConfig } from './types';

/** Does the runtime have the logger already registered */
export const validateRuntimeLogger = () => {
	return window['DreamMF']['authentication'] !== undefined;
};

/**  Validates the runtime is installed, if so, validates if the logger is setup. If
 * its missing, it will set up the logger with the dream.mf runtime */
export const setupRuntime = (logConfig: DreamMFAuthConfig) => {
	if (!validateRuntime()) {
		console.warn(
			'DreamMF Runtime was not detected. Attempting initialization.',
		);
		init();
	}
	if (!validateRuntimeProperty('authentication')) {
		registerRuntimeProperty('authentication', {
			provider: `@dream.mf/authentication:${version}`,
			config: protectConfig(logConfig),
		});
	}
};

const protectConfig = (logConfig: DreamMFAuthConfig): any => {
	if (process.env.NODE_ENV === 'production') {
		return logConfig;
	}
	const newObj = {...logConfig};
	delete newObj.client_secret;
	delete newObj.response_type;
	delete newObj.scope;
	return newObj;
}

export default {
	setupRuntime,
};
