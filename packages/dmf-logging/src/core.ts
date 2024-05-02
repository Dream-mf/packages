import { LogConfig } from "./types";
import { 
    init, 
    validateRuntime, 
    validateRuntimeProperty, 
    registerRuntimeProperty,
    RuntimeNotFoundError
} from "@dream.mf/core";
import { version } from "../package.json";

/** Does the runtime have the logger already registered */
export const validateRuntimeLogger = () => {
    return (window['DreamMF']['logger'] !== undefined);
}

/**  Validates the runtime is installed, if so, validates if the logger is setup. If
 * its missing, it will set up the logger with the dream-mf runtime */
export const setupRuntime = (logConfig: LogConfig) => {
    if (!validateRuntime()) {
        console.warn(RuntimeNotFoundError);
        init();
    }
    if (!validateRuntimeProperty('logger')) {
        registerRuntimeProperty('logger', {
            provider: `@dream.mf/logger:${version}`,
            config: logConfig
        });
    }
}

export default {
    setupRuntime
}