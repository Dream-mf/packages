import type { AIFactoryConfig } from "../types";
import { AnthropicProvider } from "./anthropic";
import { OpenAIProvider } from "./openai";

const createAIProvider = (config: AIFactoryConfig) => {
  switch (config.provider) {
    case "anthropic":
      return new AnthropicProvider(config);
    default:
      return new OpenAIProvider(config);
  }
};

export { createAIProvider };
