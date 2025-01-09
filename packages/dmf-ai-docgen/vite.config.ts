import * as path from "node:path";
import { nxCopyAssetsPlugin } from "@nx/vite/plugins/nx-copy-assets.plugin";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
	root: __dirname,
	cacheDir: "../../node_modules/.vite/packages/dmf-remote-docgen",
	plugins: [
		nxViteTsPaths(),
		nodePolyfills({
			globals: {
				Buffer: true,
				global: true,
				process: true,
			},
			protocolImports: true,
		}),
		nxCopyAssetsPlugin(["*.md"]),
		dts({
			entryRoot: "src",
			tsconfigPath: path.join(__dirname, "tsconfig.lib.json"),
		}),
	],
	build: {
		outDir: "./dist",
		emptyOutDir: true,
		reportCompressedSize: true,
		commonjsOptions: {
			transformMixedEsModules: true,
		},
		lib: {
			entry: {
				index: "./src/lib/generator.ts",
				rspack: "./src/rspack.ts",
			},
			name: "dmf-remote-docgen",
		},
		rollupOptions: {
			external: ["fs", "path", "fs/promises", /node:.*/],
			output: [
				{
					entryFileNames: "[name].mjs",
					format: "es",
				},
				{
					entryFileNames: "[name].cjs",
					format: "cjs",
				},
			],
		},
	},
	test: {
		watch: false,
		globals: true,
		environment: "jsdom",
		include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
		reporters: ["default"],
		coverage: {
			reportsDirectory: "../../coverage/packages/dmf-remote-docgen",
			provider: "v8",
		},
	},
});
