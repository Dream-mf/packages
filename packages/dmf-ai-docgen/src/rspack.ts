import { type RspackPluginInstance, createRspackPlugin } from "unplugin";
import type { PluginOptions } from "./lib/types";
import { unpluginFactory } from "./plugin";

type PluginType = (options: PluginOptions) => RspackPluginInstance;

const rspackPlugin: PluginType = createRspackPlugin(unpluginFactory);

export const aiDocgenPlugin = rspackPlugin;
