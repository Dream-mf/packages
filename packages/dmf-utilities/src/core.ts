import { init, validateRuntime, registerPlugin, RuntimeNotFoundError } from "@dream.mf/core";
import { version } from "../package.json";

/**  Validates the runtime is installed, if so, validates if the plugin is setup. 
 *   If its missing, it will set up the logger with the dream-mf runtime */
export const setupRuntime = () => {
    if (!validateRuntime()) {
        console.warn(RuntimeNotFoundError);
        init();
    }
    registerPlugin('utilities', {
        package: `@dream.mf/utilities:${version}`,
    });
}

export default {
    setupRuntime
}