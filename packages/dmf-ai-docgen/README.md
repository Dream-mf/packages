# Dream.mf Framework

Modern Frontend Libraries for use with Microfrontends and other javascript technologies.

## Dream.mf AI Docgen

This is the AI Docgen package for the Dream.mf framework. This package contains a plugin for Rspack, and other bundlers in the future. The plugin will use generative AI to create an integration guide using markdown, for your exposed modules in Module Federation as part of your build output.
This feature can aid teams in remote discovery and understanding how to integrate your web module(s).

```typescript
import { aiDocgenPlugin } from '@dreammf/ai-docgen/rspack'

config.plugins?.push(aiDocgenPlugin({
    moduleFederationConfig,
}));
```

The __aiConfig__ object that is part of the plugin's options, allows you to configure the AI provider and its settings for generating documentation. It supports multiple providers like OpenAI and Anthropic, with configurable options such as:

- `provider`: Specifies the AI service ('openai' or 'anthropic')
- `apiKey`: Authentication key for the AI service
- `model`: Optional model selection (defaults provided for each service)
- `temperature`: Controls the creativity/randomness of generated content (default 0.4)

These settings enable flexible AI-powered documentation generation with different providers and customization levels.

**Example**

```typescript
import { AIProviders } from '@dreammf/ai-docgen';

//OpenAI
aiDocgenPlugin({
    mfConfig,
    aiConfig: {
    provider: AIProviders.OPENAI,
    apiKey: process.env.OPENAI_API_KEY, //Or provide it explicitly
    model: 'gpt-4o', // Optional, defaults to gpt-4o
    temperature: 0.4 // Optional, defaults to 0.4
    }
})

//Anthropic
aiDocgenPlugin({
    mfConfig,
    aiConfig: {
    provider: AIProviders.ANTHROPIC,
    apiKey: process.env.ANTHROPIC_API_KEY, //Or provide it explicitly
    model: 'claude-3-5-haiku-latest', // Optional, defaults to claude-3-5-haiku-latest
    temperature: 0.4 // Optional, defaults to 0.4
    }
})
```