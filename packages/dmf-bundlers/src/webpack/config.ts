import webpack from "webpack";
import DotenvPlugin from "dotenv-webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import loaders from "./loaders";
import defaults from "./defaults";
import rules from "./rules";
import types from "../common/types";

const { ModuleFederationPlugin } = webpack.container;
const environment = process.env.NODE_ENV || 'development';

/**
 * @param {Object} properties.customConfig Config overrides to pass to the WebPackConfig and ModuleFederationPlugin.
 * @param {boolean} [properties.isTypescript] Whether or not this module uses Typescript.
 */
export const withBaseWebpack = (customConfig, isTypescript = true) => {
    loaders.envLoader();
    return {
        entry: `./src/index.${isTypescript ? 'ts' : 'js'}`,
        mode: environment,
        devtool: environment === 'development' ? 'inline-source-map' : 'source-map',
        devServer: { 
            ...defaults.defaultDevServer(customConfig.federationConfig.name), 
            ...customConfig.devServer
        },
        output: defaults.defaultOutput(customConfig.federationConfig.name),
        resolve: {
            extensions: defaults.defaultExtensions(),
            alias: defaults.defaultAliases()
        },
        ignoreWarnings: [
            { module: /src\/styles\/index.scss/, message: /autoprefixer: start value has mixed support, consider using flex-start instead/ },
        ],
        module: {
            rules: [
                rules.rulesEsBuild(), 
                rules.rulesCssStyles(), 
                rules.rulesCssModules(), 
                rules.rulesAssets(),
            ]
        },
        plugins: [
            new DotenvPlugin({
                systemvars: true,
            }),
            new ModuleFederationPlugin({ 
                shared: { ...defaults.defaultSharedModules() },
                filename: types.DefaultRemoteName,
                ...customConfig.federationConfig
            }),
            new HtmlWebpackPlugin({
                template: './public/index.html',
                favicon: './public/favicon.ico',
                inject: 'body',
            }),
            new MiniCssExtractPlugin({
                filename: defaults.defaultOutputStyle(),
            }),
        ],
    };
}

export default {
    withBaseWebpack
};
