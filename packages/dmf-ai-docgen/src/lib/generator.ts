import { parseExposes } from "./file-retriever";
import { logInfo } from "./logger";
import { createAIProvider } from "./providers";
import type {
	AIFactoryConfig,
	AIFactoryResponse,
	FileSummary,
	ModuleFederationConfig,
} from "./types";

/**
 * Processes the Module Federation configuration and generates documentation
 * @param moduleFedConfig The Module Federation configuration to process
 * @param config AI configuration options
 * @returns Promise containing the generated documentation
 */
export const generateContent = async (
	moduleFedConfig: ModuleFederationConfig,
	config: AIFactoryConfig,
	cwd: string,
): Promise<{ fileSummaries: FileSummary[]; guide: string } | undefined> => {
	// Validate the Module Federation configuration
	if (!moduleFedConfig || typeof moduleFedConfig !== "object") {
		throw new Error("Invalid Module Federation configuration provided");
	}

	// Validate required configuration
	if (!config.apiKey) {
		throw new Error("API key is required in configuration");
	}

	const aiProvider = createAIProvider(config);

	const exposedFiles = await parseExposes(moduleFedConfig, cwd);

	if (exposedFiles?.length === 0) {
		logInfo(
			"No exposed modules were found from the module federation config provided.",
		);
		return;
	}

	const fileSummaries: FileSummary[] = [];

	for (const exposedFile of exposedFiles) {
		const summary = await aiProvider.generateSummaryForFile(
			exposedFile.fullPath,
			exposedFile.contents,
		);
		fileSummaries.push({
			...summary,
			name: exposedFile.name,
		});
	}

	if (fileSummaries.length === 0) {
		throw new Error("No file summaries were generated.");
	}

	const guide = await aiProvider.generateGuide(fileSummaries);

	return { guide, fileSummaries };
};

export type { AIFactoryResponse, ModuleFederationConfig };
