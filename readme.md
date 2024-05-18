<p align="center"> <img src="docs/logo.png" width="300"></p>

# Dream.mf Framework
Modern Frontend Libraries for use with Microfrontends and other javascript technologies.

## Npm

You can find published packages here: https://www.npmjs.com/org/dream.mf

## Builds

⚫ **Core:** This is the core package which is responsible for the Dream.mf Runtime and other configuration based needs. All Dream.mf packages reference this.

[![Packages - Core](https://github.com/Dream-mf/packages/actions/workflows/npm-publish-core.yml/badge.svg)](https://github.com/Dream-mf/packages/actions/workflows/npm-publish-core.yml)

⚫ **Logging:** This is the logging package for the Dream.mf framework. This package contains all logging and log listener functionality used independently and within other Dream.mf packages. This also includes a log listener for your host, which is configured against your log aggregator, allowing your remotes to not implement any log aggretators.

[![Packages - Logging](https://github.com/Dream-mf/packages/actions/workflows/npm-publish-logging.yml/badge.svg)](https://github.com/Dream-mf/packages/actions/workflows/npm-publish-logging.yml)

⚫ **OIDC:** This is the authentication package for the Dream.mf framework. This package contains all oidc-client related logic for use with React and React Context. This also contains an Auth provider for use in your host and middleware to allow your remotes to be authentication free, allowing your remotes to be used across multiple hosts with differing authentication.

[![Publish - Dream.mf OIDC](https://github.com/Dream-mf/packages/actions/workflows/npm-publish-oidc.yml/badge.svg)](https://github.com/Dream-mf/packages/actions/workflows/npm-publish-oidc.yml)

⚫ **Bundlers:** This is the bundler package for the Dream.mf framework. This package contains all functionality for Webpack, Rspack, and possibly other bundlers in the future. This package is extensible and comes with basic esbuild and module federation configuration for both host and remotes.

[![Publish - Dream.mf Bundlers](https://github.com/Dream-mf/packages/actions/workflows/npm-publish-bundlers.yml/badge.svg)](https://github.com/Dream-mf/packages/actions/workflows/npm-publish-bundlers.yml)

⚫ **Utilities:** This is the utilities package which provides various utility and extension functionality for Module Federation and other Dream.mf packages.

[![Publish - Dream.mf Utilities](https://github.com/Dream-mf/packages/actions/workflows/npm-publish-utilities.yml/badge.svg)](https://github.com/Dream-mf/packages/actions/workflows/npm-publish-utilities.yml)
