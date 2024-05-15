import { RuntimeName, Plugin, Remotes } from "./types";

/** Has the dream-mf runtime been installed and initialized */
export const validateRuntime = () => {
  return window[RuntimeName] !== undefined;
};

/** Does the runtime have the property already registered */
export const validateRuntimeProperty = (propertyName: string) => {
  return window[RuntimeName][propertyName] !== undefined;
};

/** Registers the property with the dream-mf runtime */
export const registerRuntimeProperty = (
  propertyName: string,
  object: object,
) => {
  if (!validateRuntimeProperty(propertyName)) {
    window[RuntimeName][propertyName] = object;
  }
};

/** Registers a plugin by name and any object you wish to supply. */
export const registerRuntimePlugin = (pluginName: string, config: object) => {
  if (!validateRuntimeProperty("plugins")) {
    window[RuntimeName].plugins = new Array<Plugin>();
  }
  const exists = window[RuntimeName].plugins.some(
    (item) => item.name === pluginName,
  );
  if (!exists) {
    var record = { name: pluginName, config: config } as Plugin;
    window[RuntimeName].plugins.push(record);
  }
};

/** Registers a remote scope and module by url with the Dream.mf runtime so it can be discovered */
export const registerRuntimeRemote = (
  scope: string,
  module: string,
  url: string,
) => {
  const hasRemotesInit = window[RuntimeName]["remotes"] !== undefined;
  if (!hasRemotesInit) {
    if (!validateRuntimeProperty("remotes")) {
      window[RuntimeName].remotes = new Array<Remotes>();
    }
  }
  const scopeExists = window[RuntimeName].remotes.some(
    (item) => item.scope === scope,
  );
  if (!scopeExists) {
    var record = {
      scope,
      modules: module == null ? [] : [module],
      url,
    } as Remotes;
    window[RuntimeName].remotes.push(record);
  } else {
    const s = window[RuntimeName].remotes.find((sc) => sc.scope === scope);
    if (module !== null && !s.modules.includes(module)) {
      s.modules.push(module);
    }
  }
};

export default {
  validateRuntime,
  validateRuntimeProperty,
  registerRuntimeProperty,
  registerRuntimePlugin,
  registerRuntimeRemote,
};
