import MiniCssExtractPlugin from "mini-css-extract-plugin";
import loaders from "./loaders";
import path from "path";

export const rulesAssets = () => {
    return [
        { test: /\.(png|svg|jpg|jpeg|mp3)$/, type: 'asset/resource' },
    ]
};

export const rulesCssStyles = () => { 
    return {
        test: /\.(sc|c)ss$/, 
        exclude: [/\.module.scss$/],
        use: [ MiniCssExtractPlugin.loader, loaders.cssLoader(), loaders.postCssLoader, loaders.sassLoader ], 
        sideEffects: true 
    }
};

export const rulesCssModules = () => { 
    return { 
        test: /\.module.scss$/, 
        use: [ MiniCssExtractPlugin.loader, loaders.cssLoader(true), loaders.postCssLoader, loaders.sassLoader ], 
        sideEffects: true 
    }
};

export const rulesEsBuild = () => { 
    return { 
        test: /\.(js|jsx|ts|tsx)$/, 
        exclude: [/node_modules/], 
        loader: 'esbuild-loader', 
        options: { jsx: 'automatic' }
    } 
};

export const rulesSwcLoader = () => {
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
  rulesSwcLoader,
  rulesEsBuild,
  rulesCssModules,
  rulesCssStyles,
  rulesAssets
}