import type { moduleFederationPlugin } from "@module-federation/sdk";

export type FileSummary = {
	fileName: string;
	summary: string;
	name: string;
};

export interface AIProvider {
	generateSummaryForFile: (
		fileName: string,
		fileContents: string,
	) => Promise<Pick<FileSummary, "fileName" | "summary">>;
	generateGuide: (summaries: FileSummary[]) => Promise<string>;
}

/**
 * Supported AI providers for the factory
 */
export enum AIProviders {
	OPENAI = "openai",
	ANTHROPIC = "anthropic",
}

/**
 * Configuration interface for the AI Factory
 */
export interface AIFactoryConfig {
	/**
	 * The AI provider to use
	 * @default AIProvider.OPENAI
	 */
	provider?: AIProviders;

	/**
	 * API key for the selected provider
	 */
	apiKey?: string;

	/**
	 * Optional model name to use
	 * @default 'gpt-3.5-turbo'
	 */
	model?: string;

	/**
	 * Optional temperature setting for AI responses
	 * @default 0.7
	 */
	temperature?: number;
}

/**
 * Configuration options for file writing operations
 */
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

/**
 * Result of a file writing operation
 */
export interface WriteResult {
	/**
	 * Whether the write operation was successful
	 */
	success: boolean;

	/**
	 * Error message if the operation failed
	 */
	error?: string;

	/**
	 * Path of the written file
	 */
	path?: string;
}

/**
 * Standardized response format from AI processing
 */
export interface AIFactoryResponse {
	/**
	 * Generated documentation content
	 */
	content: string;

	/**
	 * Success status of the AI operation
	 */
	success: boolean;

	/**
	 * Error message if the operation failed
	 */
	error?: string;

	/**
	 * Metadata about the generation process
	 */
	metadata?: {
		provider: AIProvider;
		model: string;
		timestamp: number;
	};
}

export type ModuleFederationConfig =
	moduleFederationPlugin.ModuleFederationPluginOptions;

export type PluginOptions = {
	mfConfig: ModuleFederationConfig;
	aiConfig: AIFactoryConfig;
};
