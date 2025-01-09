import path from "node:path";
import fs from "fs-extra";
import { logError, logInfo } from "./logger";
import type { ModuleFederationConfig } from "./types";

/**
 * Common JavaScript/TypeScript file extensions
 */
const COMMON_EXTENSIONS = [
	".ts",
	".tsx",
	".js",
	".jsx",
	".mjs",
	".cjs",
	".vue",
	".svelte",
	".angular.ts",
];

/**
 * Error class for file retrieval failures
 */
class FileRetrievalError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "FileRetrievalError";
	}
}

/**
 * Check if a file exists with any of the common extensions
 * @param basePath - Base file path without extension
 * @returns Full file path with extension if found, null otherwise
 */
async function findFileWithExtension(basePath: string): Promise<string | null> {
	// If the path already has a supported extension, check it directly
	if (COMMON_EXTENSIONS.some((ext) => basePath.endsWith(ext))) {
		return (await fs.pathExists(basePath)) ? basePath : null;
	}

	// Try each extension
	for (const ext of COMMON_EXTENSIONS) {
		const fullPath = `${basePath}${ext}`;
		if (await fs.pathExists(fullPath)) {
			return fullPath;
		}
	}

	return null;
}

/**
 * Retrieve file contents and path for a given file path
 * @param filePath - Relative or absolute file path
 * @returns Object containing file contents and full path
 */
export async function retrieveFile(
	filePath: string,
	cwd: string,
): Promise<{ contents: string; fullPath: string }> {
	const absolutePath = path.isAbsolute(filePath)
		? filePath
		: path.resolve(cwd, filePath);
	logInfo("Retrieving file:", absolutePath);

	const foundPath = await findFileWithExtension(absolutePath);

	if (!foundPath) {
		throw new FileRetrievalError(
			`File not found: ${filePath} (tried with common extensions)`,
		);
	}

	try {
		const contents = await fs.readFile(foundPath, "utf-8");
		return {
			contents,
			fullPath: foundPath,
		};
	} catch (error) {
		throw new FileRetrievalError(
			`Error reading file ${foundPath}: ${(error as Error).message}`,
		);
	}
}

/**
 * Parse the exposes configuration and retrieve all exposed files
 * @param config - Module Federation configuration
 * @returns Array of objects containing file contents and paths
 */
export async function parseExposes(
	config: ModuleFederationConfig,
	cwd: string,
): Promise<Array<{ contents: string; fullPath: string; name: string }>> {
	if (!config.exposes) {
		return [];
	}

	const results: Array<{ contents: string; fullPath: string; name: string }> =
		[];
	const exposedEntries = Object.entries(config.exposes);

	for (const [name, filePath] of exposedEntries) {
		try {
			// Handle both string and object configurations
			const actualPath =
				typeof filePath === "string" ? filePath : filePath.import;
			const fileInfo = await retrieveFile(actualPath, cwd);
			results.push({
				...fileInfo,
				name: name.substring(name.indexOf("/")),
			});
		} catch (error) {
			if (error instanceof Error) {
				logError(`Error processing exposed file ${filePath}:`, error);
			}
		}
	}

	return results;
}
