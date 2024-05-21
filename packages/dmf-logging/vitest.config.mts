import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	test: {
		include: ["**/*.test.(ts|tsx)"],
		globals: true,
		environment: "jsdom",
		coverage: {
			reportsDirectory: "./coverage",
			enabled: true,
			provider: "v8",
			reporter: ["html"],
		},
	},
});
