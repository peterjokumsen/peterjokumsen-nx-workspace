# PeterJokumsen `Nx` Workspace

[![codecov](https://codecov.io/gh/peterjokumsen/peterjokumsen-nx-workspace/graph/badge.svg?token=0QX0KNI1R4)](https://codecov.io/gh/peterjokumsen/peterjokumsen-nx-workspace)

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a> ✨ **This workspace has been generated using [Nx, Smart Monorepos · Fast CI.](https://nx.dev)** ✨

This repository is meant as a playground of sorts, that I've created as a collection of applications and libraries, to play around with theories.

# Applications

## Blog

<a alt="Peter Jokumsen Blog" href="https://blog.peterjokumsen.com" target="_blank" rel="noreferrer"><img src="https://blog.peterjokumsen.com/assets/logo-150.webp" width="150"></a> [![Blog](https://github.com/peterjokumsen/peterjokumsen-nx-workspace/actions/workflows/blog-build-deploy.yml/badge.svg?branch=main)](https://github.com/peterjokumsen/peterjokumsen-nx-workspace/actions/workflows/blog-build-deploy.yml)

Application, located in [`apps/blog`](./apps/blog), is the initial project, to be used as a blog to share with posts and articles.

Hosted as an [Azure Static Web App](https://docs.microsoft.com/en-us/azure/static-web-apps/overview), using bicep for infrastructure as code, at [https://blog.peterjokumsen.com](https://blog.peterjokumsen.com).

# Libraries

## ng-features

[`ng-features/**`](./ng-features/README.md) is a collection of Angular features, meant to be lazy-loaded components.

### ng-features/blog-container

[`ng-features/blog-container`](./ng-features/blog-container/README.md) is a container component, to drive functionality for blog posts.

## ng-libs

[`ng-libs/**`](./ng-libs/README.md) is a collection of Angular libraries, meant to be shared re-usable components, services, and utilities.

### ng-libs/services

[`ng-libs/services`](./ng-libs/services/README.md) is a collection of shared Angular services for the workspace. Named as `ng-services`, just in case any other `services` libraries created in the future.

### ng-libs/styles

[`ng-libs/styles`](./ng-libs/styles/README.md) is a collection of shared styles for the workspace. Using [Angular material theming](https://v17.material.angular.io/guide/theming).

> I wouldn't call the approach I've done as `best practice` or even `good practice`. It's more of a `practice` to see how it works out.

### ng-libs/ui-elements

[`ng-libs/ui-elements`](./ng-libs/ui-elements/README.md) is a collection of shared Angular based UI elements, components, and directives.

## ts-libs

[`ts-libs/**`](./ts-libs/README.md) is a collection of TypeScript libraries, meant to be shared functions and utilities.

### ts-libs/markdown-parser

[`ts-libs/markdown-parser`](./ts-libs/markdown-parser/README.md) is a parser for Markdown text.

### ts-libs/ts-utils

[`ts-libs/ts-utils`](./ts-libs/ts-utils/README.md) is a collection of utility functions for the workspace.

# Code coverage

Sunburst graph of code coverage for the workspace:

![codecov coverage graph](https://codecov.io/gh/peterjokumsen/peterjokumsen-nx-workspace/graphs/sunburst.svg?token=0QX0KNI1R4)
