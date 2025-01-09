import type { UnpluginBuildContext, UnpluginFactory } from "unplugin";
import { createUnplugin } from "unplugin";
import { FileWriter } from "./lib/file-writer";
import { generateContent } from "./lib/generator";
import { logError, logInfo, logWarning } from "./lib/logger";
import type { PluginOptions } from "./lib/types";

export const unpluginFactory: UnpluginFactory<PluginOptions> = (options) => ({
  name: "@dreammf/ai-docgen",
  async buildEnd(this: UnpluginBuildContext) {
    const { mfConfig, aiConfig } = options;

    const getNativeContext = this.getNativeBuildContext;
    if (!getNativeContext) {
      logWarning("Native build context not available");
      return;
    }

    const context = getNativeContext();
    let cwd = process.cwd();
    let outputDir = process.cwd();
    if (context?.framework === "rspack") {
      const { compiler } = context;
      cwd = compiler.options.context || process.cwd();
      outputDir = compiler.options.output.path || process.cwd();
    }

    logInfo("Writing files to output directory:", outputDir);

    const results = await generateContent(mfConfig, aiConfig, cwd);

    if (!results || results?.fileSummaries?.length === 0) {
      logWarning("No file summaries generated.");
      return;
    }

    const { fileSummaries, guide } = results;

    const fileWriter = new FileWriter({
      outputDir,
    });
    try {
      const writeResults = await fileWriter.writeFiles(guide, fileSummaries);
      const failures = writeResults.filter((result) => !result.success);

      if (failures.length > 0) {
        logError("Some files failed to write:");
        for (const failure of failures) {
          logError(`- ${failure.error}`);
        }
      } else {
        logInfo("Documentation generated successfully");
      }
    } catch (error) {
      if (error instanceof Error) {
        logError("Failed to write documentation files:", error);
      }
      throw error;
    }
  },
});

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory);

export default unplugin;
