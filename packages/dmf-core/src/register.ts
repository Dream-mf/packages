import { RuntimeName } from "./types";

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

export default {
    validateRuntime,
    validateRuntimeProperty,
    registerRuntimeProperty
}