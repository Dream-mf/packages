import { join } from "node:path";
import { nxCopyAssetsPlugin } from "@nx/vite/plugins/nx-copy-assets.plugin";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
	root: __dirname,
	cacheDir: "../../node_modules/.vite/packages/dmf-oidc",
	plugins: [
		react(),
		nxViteTsPaths(),
		nxCopyAssetsPlugin(["*.md"]),
		dts({
			entryRoot: "src",
			tsconfigPath: join(__dirname, "tsconfig.lib.json"),
		}),
	],
	build: {
		outDir: "../../dist/packages/dmf-oidc",
		emptyOutDir: true,
		reportCompressedSize: true,
		commonjsOptions: {
			transformMixedEsModules: true,
		},
		lib: {
			entry: "src/index.ts",
			name: "oidc",
		},
		rollupOptions: {
			external: (id: string) => {
				return !/^[./]/.test(id);
			},
			output: [
				{
					entryFileNames: "index.mjs",
					format: "es",
				},
				{
					entryFileNames: "index.cjs",
					format: "cjs",
				},
			],
		},
	},
});
