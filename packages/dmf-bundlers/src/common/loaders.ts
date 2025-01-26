const fs = require("node:fs");

/** Minimal configuration for css loader */
export const _cssLoader = (hasCssModules = false) => {
  const cssLoaderConfig = {
    loader: "css-loader",
    options: {
      sourceMap: true,
    },
  };
  if (hasCssModules) {
    //@ts-ignore
    cssLoaderConfig.options.modules = true;
    //@ts-ignore
    cssLoaderConfig.options.importLoaders = 2;
  }
  return cssLoaderConfig;
};

/** Minimal configuration for postcss loader */
export const _postCssLoader = {
  loader: "postcss-loader",
  options: { sourceMap: true },
};

/** Minimal configuration for sass loader */
export const _sassLoader = {
  loader: "sass-loader",
  options: {
    sassOptions: { quietDeps: true },
    sourceMap: true,
  },
};

export const _envLoader = () => {
  const filePath = "../../host/.env";
  if (fs.existsSync(filePath) && process.env?.NODE_ENV === "development") {
    require("dotenv").config({ path: filePath });
  } else {
    require("dotenv").config();
  }
};

export default {
  _cssLoader,
  _postCssLoader,
  _sassLoader,
  _envLoader,
};
