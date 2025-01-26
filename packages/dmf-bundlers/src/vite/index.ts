import { join } from "node:path";
import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import {
  type Plugin,
  type PluginOption,
  type UserConfig,
  defineConfig,
} from "vite";
import dts from "vite-plugin-dts";
import defaults from "../common/defaults";
import loaders from "../common/loaders";

export interface ViteCustomConfig {
  federationConfig?: Parameters<typeof federation>[0];
  server?: UserConfig["server"];
  dtsConfig?: {
    entryRoot?: string;
    tsconfigPath?: string;
  };
}

export const withBaseVite = (customConfig: ViteCustomConfig): UserConfig => {
  loaders._envLoader();
  const prod = process.env.NODE_ENV === "production";

  const plugins = [
    react(),
    dts({
      entryRoot: customConfig.dtsConfig?.entryRoot ?? "src",
      tsconfigPath:
        customConfig.dtsConfig?.tsconfigPath ??
        join(process.cwd(), "tsconfig.lib.json"),
    }),
  ];

  if (customConfig.federationConfig) {
    const fedPlugin = federation(customConfig.federationConfig);
    plugins.push(...(Array.isArray(fedPlugin) ? fedPlugin : [fedPlugin]));
  }

  return defineConfig({
    mode: prod ? "production" : "development",
    server: {
      ...defaults._defaultDevServer(customConfig.federationConfig?.name),
      ...customConfig.server,
    },
    build: {
      target: "esnext",
      minify: prod,
      cssCodeSplit: false,
      sourcemap: true,
    },
    resolve: {
      extensions: defaults._defaultExtensions(),
      alias: { ...defaults._defaultAliases().alias },
    },
    plugins: plugins as PluginOption[],
    css: {
      modules: {
        localsConvention: "camelCase",
      },
    },
  });
};
