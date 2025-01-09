import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { FileSummary } from "./types";

export interface FileWriterOptions {
  /**
   * Base output directory for generated files
   * @default './output'
   */
  outputDir?: string;

  /**
   * Whether to create directories if they don't exist
   * @default true
   */
  createDirs?: boolean;

  /**
   * File extension for generated files
   * @default '.md'
   */
  fileExtension?: string;
}

export interface WriteResult {
  success: boolean;
  error?: string;
  path?: string;
}

export class FileWriter {
  private readonly options: Required<FileWriterOptions>;

  constructor(options: FileWriterOptions = {}) {
    this.options = {
      outputDir: options.outputDir || "./output",
      createDirs: options.createDirs ?? true,
      fileExtension: options.fileExtension || ".md",
    };
  }

  /**
   * Writes the generated guide and file summaries to disk
   */
  async writeFiles(
    guide: string,
    fileSummaries: FileSummary[],
  ): Promise<WriteResult[]> {
    const results: WriteResult[] = [];

    try {
      // Ensure output directory exists
      if (this.options.createDirs) {
        await this.ensureDirectoryExists(this.options.outputDir);
      }

      // Write main guide file
      const guidePath = join(
        this.options.outputDir,
        `guide${this.options.fileExtension}`,
      );
      await writeFile(guidePath, guide, "utf-8");
      results.push({ success: true, path: guidePath });

      // Write individual file summaries
      for (const summary of fileSummaries) {
        try {
          const filePath = join(
            this.options.outputDir,
            "summaries",
            `${summary.name}${this.options.fileExtension}`,
          );

          await this.ensureDirectoryExists(dirname(filePath));
          await writeFile(filePath, summary.summary, "utf-8");
          results.push({ success: true, path: filePath });
        } catch (error) {
          if (error instanceof Error) {
            results.push({
              success: false,
              error: `Failed to write summary for ${summary.summary}: ${error.message}`,
            });
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        results.push({
          success: false,
          error: `Failed to write files: ${error.message}`,
        });
      }
    }

    return results;
  }

  /**
   * Ensures the directory exists, creating it if necessary
   */
  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    if (this.options.createDirs) {
      await mkdir(dirPath, { recursive: true });
    }
  }
}
