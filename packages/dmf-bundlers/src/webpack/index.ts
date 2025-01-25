import DotenvPlugin from "dotenv-webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import webpack from "webpack";
import defaults from "../common/defaults";
import loaders from "../common/loaders";
import rules from "../common/rules";
import types from "../common/types";

const { ModuleFederationPlugin } = webpack.container;

/**
 * @param {Object} customConfig Config overrides to pass to the WebPackConfig and ModuleFederationPlugin.
 * @param {boolean} [isTypescript] Whether or not this module uses Typescript.
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const withBaseWebpack = (customConfig: any, isTypescript = true) => {
  loaders._envLoader();
  const prod = process.env.NODE_ENV === "production";
  return {
    entry: `./src/index.${isTypescript ? "ts" : "js"}`,
    mode: prod ? "production" : "development",
    devtool:
      (process.env.NODE_ENV || "development") === "development"
        ? "inline-source-map"
        : "source-map",
    devServer: {
      ...defaults._defaultDevServer(customConfig.federationConfig.name),
      ...customConfig.devServer,
    },
    output: defaults._defaultOutput(customConfig.federationConfig.name),
    resolve: {
      extensions: defaults._defaultExtensions(),
      alias: defaults._defaultAliases(),
    },
    ignoreWarnings: [
      {
        module: /src\/styles\/index.scss/,
        message:
          /autoprefixer: start value has mixed support, consider using flex-start instead/,
      },
    ],
    module: {
      rules: [
        rules._rulesEsBuild(),
        rules._rulesCssStyles(),
        rules._rulesCssModules(),
        rules._rulesAssets(),
      ],
    },
    plugins: [
      new DotenvPlugin({
        systemvars: true,
      }),
      new ModuleFederationPlugin({
        shared: { ...defaults._defaultSharedModules() },
        filename: types.DefaultRemoteName,
        ...customConfig.federationConfig,
      }),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        favicon: "./public/favicon.ico",
        inject: "body",
      }),
      new MiniCssExtractPlugin({
        filename: defaults._defaultOutputStyle(),
      }),
    ],
  };
};

export default {
  withBaseWebpack,
};
