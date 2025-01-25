import path from "node:path";

/** Default minimal shared modules for module federation */
export const _defaultSharedModules = () => {
  return {
    react: {
      singleton: true,
      strictVersion: true,
      requiredVersion: "19.0",
    },
    "react-dom": {
      singleton: true,
      strictVersion: true,
      requiredVersion: "19.0",
    },
    "react-router": {
      singleton: true,
      strictVersion: true,
      requiredVersion: "7.1.1",
    },
    "react-router-dom": {
      singleton: true,
      strictVersion: true,
      requiredVersion: "7.1.1",
    },
    "react-oidc-context": {
      singleton: true,
      strictVersion: true,
      requiredVersion: "3.2.0",
    },
  };
};

/** Default output for webpack chunks and modules */
export const _defaultOutput = (remoteName) => {
  return {
    publicPath: remoteName === "container" ? "/" : "auto",
    chunkFilename: "[name].[contenthash].js",
    filename: "[name].[contenthash].js",
    assetModuleFilename: "[name].[contenthash][ext][query]",
    clean: true,
  };
};

/** Default configuration for webpack dev server */
export const _defaultDevServer = (remoteName) => {
  return {
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
    },
    open: remoteName === "container",
  };
};

export const _defaultOptimizations = () => {
  return {
    minimize: false,
  };
};

export const _defaultOutputStyle = () => {
  return "[name].[contenthash].css";
};

export const _defaultAliases = () => {
  return { alias: { "@shared": path.resolve(__dirname, "../shared") } };
};

export const _defaultExtensions = () => {
  return [".js", ".jsx", ".ts", ".tsx"];
};

export const _defaultSupportedBrowsers =
  "chrome >= 87,edge >=88,firefox >= 78,safari >= 14";

export default {
  _defaultSharedModules,
  _defaultOutputStyle,
  _defaultDevServer,
  _defaultOutput,
  _defaultOptimizations,
  _defaultAliases,
  _defaultExtensions,
  _defaultSupportedBrowsers,
};
