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

/** Registers a remote with the Dream.mf runtime so it can be discovered */
export const storeRemote = (scope: string, module: string, url: string) => {

}

export default {
    setupRuntime,
    storeRemote
}