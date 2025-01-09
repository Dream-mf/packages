import { type AIFactoryConfig, AIProviders } from "../types";
import { AnthropicProvider } from "./anthropic";
import { OpenAIProvider } from "./openai";

const createAIProvider = (config: AIFactoryConfig) => {
  switch (config.provider) {
    case AIProviders.ANTHROPIC:
      return new AnthropicProvider(config);
    default:
      return new OpenAIProvider(config);
  }
};

export { createAIProvider };
