import MiniCssExtractPlugin from "mini-css-extract-plugin";
import loaders from "./loaders";
import path from "path";

export const _rulesAssets = () => {
  return [{ test: /\.(png|svg|jpg|jpeg|mp3)$/, type: "asset/resource" }];
};

export const _rulesCssStyles = () => {
  return {
    test: /\.(sc|c)ss$/,
    exclude: [/\.module.scss$/],
    use: [
      MiniCssExtractPlugin.loader,
      loaders._cssLoader(),
      loaders._postCssLoader,
      loaders._sassLoader,
    ],
    sideEffects: true,
  };
};

export const _rulesCssModules = () => {
  return {
    test: /\.module.scss$/,
    use: [
      MiniCssExtractPlugin.loader,
      loaders._cssLoader(true),
      loaders._postCssLoader,
      loaders._sassLoader,
    ],
    sideEffects: true,
  };
};

export const _rulesEsBuild = () => {
  return {
    test: /\.(js|jsx|ts|tsx)$/,
    exclude: [/node_modules/],
    loader: "esbuild-loader",
    options: { jsx: "automatic" },
  };
};

export const _rulesSwcLoader = () => {
  return {
    test: /\.(js|jsx|ts|tsx)$/,
    include: path.resolve(__dirname, "src"),
    use: {
      loader: "builtin:swc-loader",
      options: {
        jsc: {
          parser: {
            syntax: "ecmascript",
            jsx: true,
          },
          transform: {
            react: {
              runtime: "automatic",
            },
          },
        },
      },
    },
  };
};

export default {
  _rulesSwcLoader,
  _rulesEsBuild,
  _rulesCssModules,
  _rulesCssStyles,
  _rulesAssets,
};
