const path = require("path");
const {
	ModuleFederationPlugin,
} = require("@module-federation/enhanced/rspack");
const ReactRefreshPlugin = require("@rspack/plugin-react-refresh");
const DotenvPlugin = require("dotenv-webpack");
const rspack = require("@rspack/core");
const loaders = require("./loaders");
const defaults = require("./defaults");
const { defineConfig } = require("@rspack/cli");

/**
 * @param {Object} customConfig Config overrides to pass to the WebPackConfig and ModuleFederationPlugin.
 * @param {boolean} [isTypescript] Whether or not this module uses Typescript.
 */
export const withBaseRSPack = (customConfig, isTypescript) => {
	loaders.envLoader();

	const prod = process.env.NODE_ENV === "production";

	return defineConfig({
		entry: `./src/index.${isTypescript ? "ts" : "js"}`,
		mode: prod ? "production" : "development",
		devtool:
			(process.env.NODE_ENV || "development") === "development"
				? "inline-source-map"
				: "source-map",
		devServer: {
			...defaults.defaultDevServer(customConfig.federationConfig.name),
			...customConfig.devServer,
		},
		output: defaults.defaultOutput(customConfig.federationConfig.name),
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
							targets: "Chrome >= 48",
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
							targets: "Chrome >= 48",
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
				{ test: /\.(png|svg|jpg|jpeg|mp3)$/, type: "asset/resource" },
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
				shared: { ...defaults.defaultSharedModules() },
				filename: defaults.defaultRemoteName(),
				...customConfig.federationConfig,
			}),
			!prod && new ReactRefreshPlugin(),
		].filter(Boolean),
	});
};

export default {
	withBaseRSPack,
};
