import { ChatAnthropic } from "@langchain/anthropic";
import { logWarning } from "../logger";
import type {
  AIFactoryConfig,
  AIProvider,
  ExposedModule,
  FileSummary,
  ModuleFederationConfig,
} from "../types";
import { removeOuterMarkdownBlock } from "./utils";

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
6. Mention the module scope provided in the overview, as that is

Format the response using github flavored markdown.

File:
${fileName}

File Contents:
${fileContent}`;

    const result = await this.model.invoke(prompt);

    return {
      fileName,
      summary: removeOuterMarkdownBlock(result.content.toString()),
    };
  }

  /**
   * Generates a technical guide based on provided content
   */
  public async generateGuide(
    files: ExposedModule[],
    moduleScope: ModuleFederationConfig["name"],
    sharedConfig?: ModuleFederationConfig["shared"],
  ): Promise<string> {
    const prompt = `Please create a comprehensive integration guide for consuming these remote modules:

Please structure the guide as follows:
1. Overview
    - Brief explanation of what these remote modules provide
    - The business value and use cases they solve
    - Prerequisites and requirements

2. Getting Started
    - Only focus on configuring module federation, not any of the file dependencies explicitly
    - Module Federation configuration examples
    - Explain how to setup the shared module configuration to be compatible

3. Integration Steps
    - Step-by-step instructions for importing and using each remote module
    - Incorporate the "Module Scope" and "Remote Module Name" in your guide, as they are used for import statements
    - Code examples showing proper usage
    - Configuration options and customization
    - TypeScript type definitions and interfaces

4. Best Practices
    - Recommended patterns for consuming these remote modules
    - Performance considerations
    - Error handling and fallback strategies
    - Testing recommendations

5. Common Scenarios
    - Real-world integration examples
    - Typical use cases with code samples
    - Troubleshooting tips
    - Known limitations or considerations

Format the response using github flavored markdown, focusing on practical implementation details.

Module Scope:
${moduleScope}

Module Shared Configuration:
${JSON.stringify(sharedConfig ?? "None provided.")}

Remote Modules:
${files
  .map(
    (f) =>
      `Name:
${f.name}

File Contents:
${f.fileContent}`,
  )
  .join("\n\n----SEPARATOR----\n\n")}`;

    const result = await this.model.invoke(prompt);
    return removeOuterMarkdownBlock(result.content.toString());
  }
}
