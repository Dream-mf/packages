import path from "path";

/** Default minimal shared modules for module federation */
export const defaultSharedModules = () => {
  return {
    react: { singleton: true, strictVersion: true, requiredVersion: "18.2.0" },
    "react-dom": {
      singleton: true,
      strictVersion: true,
      requiredVersion: "18.2.0",
    },
    "react-router": {
      singleton: true,
      strictVersion: true,
      requiredVersion: "6.22.2",
    },
    "react-router-dom": {
      singleton: true,
      strictVersion: true,
      requiredVersion: "6.22.2",
    },
    "@tanstack/react-query": {
      singleton: true,
      strictVersion: true,
      requiredVersion: "5.25.0",
    },
  };
};

/** Default output for webpack chunks and modules */
export const defaultOutput = (remoteName) => {
  return {
    publicPath: remoteName === "container" ? "/" : "auto",
    chunkFilename: "[name].[contenthash].js",
    filename: "[name].[contenthash].js",
    assetModuleFilename: "[name].[contenthash][ext][query]",
    clean: true,
  };
};

export const defaultOutputStyle = () => {
  return "[name].[contenthash].css";
};

/** Default configuration for webpack dev server */
export const defaultDevServer = (remoteName) => {
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

export const defaultOptimizations = () => {
  return {
    minimize: false,
  };
};

export const defaultAliases = () => {
  return { alias: { "@shared": path.resolve(__dirname, "../shared") } };
};

export const defaultExtensions = () => {
  return [".js", ".jsx", ".ts", ".tsx"];
};

export default {
  defaultSharedModules,
  defaultDevServer,
  defaultOutput,
  defaultOutputStyle,
  defaultAliases,
  defaultExtensions,
};
