# PeterJokumsen Blog

[![codecov](https://codecov.io/gh/peterjokumsen/peterjokumsen-nx-workspace/graph/badge.svg?token=0QX0KNI1R4)](https://codecov.io/gh/peterjokumsen/peterjokumsen-nx-workspace)

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ **This workspace has been generated by [Nx, Smart Monorepos · Fast CI.](https://nx.dev)** ✨

This repository was created as a blog and project to practice skills and techniques for development.

# Applications

## Blog

<a alt="Peter Jokumsen Blog" href="https://blog.peterjokumsen.com" target="_blank" rel="noreferrer"><img src="https://blog.peterjokumsen.com/assets/logo-150.webp" width="150"></a>

[![Blog](https://github.com/peterjokumsen/peterjokumsen-nx-workspace/actions/workflows/blog-build-deploy.yml/badge.svg?branch=main)](https://github.com/peterjokumsen/peterjokumsen-nx-workspace/actions/workflows/blog-build-deploy.yml)

The [`blog`](./apps/blog) application is the initial project, which will be used to write blog posts and articles. Hosted as [Azure Static Web App](https://docs.microsoft.com/en-us/azure/static-web-apps/overview), using bicep for infrastructure as code, at [https://blog.peterjokumsen.com](https://blog.peterjokumsen.com).

# Libraries

- [`ng-features`](./ng-features/README.md) - Angular "features", lazy-loaded components to contain functionality.
  - [`blog-container`](./ng-features/blog-container/README.md) - Blog container component, to drive functionality for blog posts.
- [`ng-libs`](./ng-libs/README.md) - Angular libraries for shared components, services, and utilities.
  - [`services`](./ng-libs/services/README.md) - Shared Angular services for the workspace.
  - [`styles`](./ng-libs/styles/README.md) - Shared styles for the workspace.
  - [`ui-elements`](./ng-libs/ui-elements/README.md) - Shared UI elements, components, and directives.
- [`ts-libs`](./ts-libs/README.md) - TypeScript libraries for shared functions and utilities.
  - [`ts-utils`](./ts-libs/ts-utils/README.md) - Utility functions for the workspace.

# Code coverage

Sunburst graph of code coverage for the workspace:

![codecov coverage graph](https://codecov.io/gh/peterjokumsen/peterjokumsen-nx-workspace/graphs/sunburst.svg?token=0QX0KNI1R4)
