import path from "path";

/** Default minimal shared modules for module federation */
export const _defaultSharedModules = () => {
  return {
    react: {
      singleton: true,
      strictVersion: true,
      requiredVersion: "18.2",
    },
    "react-dom": {
      singleton: true,
      strictVersion: true,
      requiredVersion: "18.2",
    },
    "react-router": {
      singleton: true,
      strictVersion: true,
      requiredVersion: "6.22",
    },
    "react-router-dom": {
      singleton: true,
      strictVersion: true,
      requiredVersion: "6.22",
    },
    "react-oidc-context": {
      singleton: true,
      strictVersion: true,
      requiredVersion: "3.0.0",
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
    open: remoteName === "container" ? true : false,
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

export default {
  _defaultSharedModules,
  _defaultOutputStyle,
  _defaultDevServer,
  _defaultOutput,
  _defaultOptimizations,
  _defaultAliases,
  _defaultExtensions,
};
