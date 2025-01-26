const path = require("node:path");
const {
  ModuleFederationPlugin,
} = require("@module-federation/enhanced/rspack");
const { defineConfig } = require("@rspack/cli");
import rspack from "@rspack/core";
import ReactRefreshPlugin from "@rspack/plugin-react-refresh";
import DotenvPlugin from "dotenv-webpack";
import defaults, { _defaultSupportedBrowsers } from "../common/defaults";
import loaders from "../common/loaders";
import rules from "../common/rules";
import types from "../common/types";

/**
 * @param {Object} customConfig Config overrides to pass to the WebPackConfig and ModuleFederationPlugin.
 * @param {boolean} [isTypescript] Whether or not this module uses Typescript.
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const withBaseRspack = (customConfig: any, isTypescript: boolean) => {
  loaders._envLoader();
  const prod = process.env?.NODE_ENV === "production";
  return defineConfig({
    entry: `./src/index.${isTypescript ? "ts" : "js"}`,
    mode: prod ? "production" : "development",
    devtool:
      (process.env?.NODE_ENV || "development") === "development"
        ? "inline-source-map"
        : "source-map",
    devServer: {
      ...defaults._defaultDevServer(customConfig.federationConfig.name),
      ...customConfig.devServer,
    },
    output: defaults._defaultOutput(customConfig.federationConfig.name),
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      alias: {
        "@shared": path.resolve(__dirname, "../shared"),
      },
    },
    module: {
      rules: [
        {
          test: /\.(j|t)s$/,
          exclude: [/[\\/]node_modules[\\/]/],
          loader: "builtin:swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "typescript",
              },
              externalHelpers: false,
              transform: {
                react: {
                  runtime: "automatic",
                  development: !prod,
                  refresh: !prod,
                },
              },
            },
            env: {
              targets: _defaultSupportedBrowsers,
            },
          },
        },
        {
          test: /\.(j|t)sx$/,
          exclude: [/[\\/]node_modules[\\/]/],
          loader: "builtin:swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "typescript",
                tsx: true,
              },
              externalHelpers: false,
              transform: {
                react: {
                  runtime: "automatic",
                  development: !prod,
                  refresh: !prod,
                },
              },
            },
            env: {
              targets: _defaultSupportedBrowsers,
            },
          },
        },
        {
          test: /\.(sass|scss)$/,
          use: [
            {
              loader: "sass-loader",
              options: {},
            },
          ],
          type: "css/auto",
        },
        ...rules._rulesAssets(),
      ],
    },
    plugins: [
      new DotenvPlugin({
        systemvars: true,
      }),
      new rspack.HtmlRspackPlugin({
        template: "./public/index.html",
        favicon: "./public/favicon.ico",
        inject: "body",
      }),
      new ModuleFederationPlugin({
        shared: { ...defaults._defaultSharedModules() },
        filename: types.DefaultRemoteName,
        ...customConfig.federationConfig,
      }),
      !prod && new ReactRefreshPlugin(),
    ].filter(Boolean),
  });
};

export default {
  withBaseRspack,
};
