import { join } from "node:path";
import { nxCopyAssetsPlugin } from "@nx/vite/plugins/nx-copy-assets.plugin";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  root: __dirname,
  cacheDir: "../../node_modules/.vite/packages/dmf-bundlers",
  plugins: [
    react(),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(["*.md"]),
    nodePolyfills({
      // Whether to polyfill specific globals
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Whether to polyfill `node:` protocol imports
      protocolImports: true,
    }),
    dts({
      entryRoot: "src",
      tsconfigPath: join(__dirname, "tsconfig.lib.json"),
    }),
  ],
  build: {
    outDir: "../../dist/packages/dmf-bundlers",
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: {
        index: "src/index.ts",
        rspack: "src/rspack/index.ts",
        vite: "src/vite/index.ts",
        webpack: "src/webpack/index.ts",
      },
      name: "bundlers",
    },
    rollupOptions: {
      external: (id: string) => {
        return !/^[./]/.test(id);
      },
      output: [
        {
          format: "es",
          entryFileNames: "[name].mjs",
        },
        {
          format: "cjs",
          entryFileNames: "[name].cjs",
        },
      ],
    },
  },
});
