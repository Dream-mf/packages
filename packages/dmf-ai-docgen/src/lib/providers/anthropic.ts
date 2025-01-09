import { ChatAnthropic } from "@langchain/anthropic";
import { logWarning } from "../logger";
import type { AIFactoryConfig, AIProvider, FileSummary } from "../types";
import { extractMarkdownBlock } from "./utils";

const defaultModel = "claude-3-5-haiku-latest";

/**
 * Anthropic Provider implementation
 */
export class AnthropicProvider implements AIProvider {
  private model: ChatAnthropic;

  constructor(config: AIFactoryConfig) {
    if (!config.model) {
      logWarning("No Anthropic model specified, default to:", defaultModel);
    }

    this.model = new ChatAnthropic({
      apiKey: config.apiKey ?? process.env.ANTHROPIC_API_KEY,
      anthropicApiKey: config.apiKey ?? process.env.ANTHROPIC_API_KEY,
      modelName: config.model || defaultModel,
      temperature: config.temperature || 0.4,
    });
  }

  /**
   * Generates a summary for a given file content
   */
  public async generateSummaryForFile(
    fileContent: string,
    fileName: string,
  ): Promise<Pick<FileSummary, "fileName" | "summary">> {
    const prompt = `Please analyze and summarize the following file:

Please provide:
1. A brief overview of the file's purpose
2. Key functions and their responsibilities
3. Important dependencies and imports
4. Any notable patterns or architectural decisions
5. Write the summary as a detailed walkthrough for someone not familiar with the file

Format the response in markdown.

File:
${fileName}

File Contents:
${fileContent}`;

    const result = await this.model.invoke(prompt);

    return {
      fileName,
      summary: extractMarkdownBlock(result.content.toString()),
    };
  }

  /**
   * Generates a technical guide based on provided content
   */
  public async generateGuide(summaries: FileSummary[]): Promise<string> {
    const prompt = `Please create a technical guide based on the following files:

Please include:
1. Overview and purpose - the overview should be in the context of the business purpose of all the files provided.
2. Step-by-step implementation details
3. Best practices and recommendations
4. Common pitfalls to avoid
5. Integration steps or examples for each file

Format the response in markdown.

Files:

${summaries
  .map(
    (s) =>
      `File:
${s.fileName}

File Summary:
${s.summary}`,
  )
  .join("\n")}`;

    const result = await this.model.invoke(prompt);
    return extractMarkdownBlock(result.content.toString());
  }
}
