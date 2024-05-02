import { RuntimeName, Plugin } from "./types";

/** Has the dream-mf runtime been installed and initialized */
export const validateRuntime = () => {
    return (window[RuntimeName] !== undefined);
}

/** Does the runtime have the property already registered */
export const validateRuntimeProperty = (propertyName: string) => {
    return (window[RuntimeName][propertyName] !== undefined);
}

/** Registers the property with the dream-mf runtime */
export const registerRuntimeProperty = (propertyName: string, object: object) => {
    if (!validateRuntimeProperty(propertyName)) {
        window[RuntimeName][propertyName] = object;
    }
}

/** Registers a plugin by name and any object you wish to supply. */
export const registerPlugin = (pluginName: string, config: object) => {
    if (!validateRuntimeProperty("plugins")) {
        window[RuntimeName].plugins = new Array<Plugin>();
    }
    const exists = window[RuntimeName].plugins.some(item => item.name === pluginName);
    if (!exists) {
        var record = { name: pluginName, config: config} as Plugin;
        window[RuntimeName].plugins.push(record);
    }
}

export default {
    validateRuntime,
    validateRuntimeProperty,
    registerRuntimeProperty,
    registerPlugin
}