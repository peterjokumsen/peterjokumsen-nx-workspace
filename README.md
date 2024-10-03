# PeterJokumsen `Nx` Workspace

[![codecov](https://codecov.io/gh/peterjokumsen/peterjokumsen-nx-workspace/graph/badge.svg?token=0QX0KNI1R4)](https://codecov.io/gh/peterjokumsen/peterjokumsen-nx-workspace) [![Blog](https://github.com/peterjokumsen/peterjokumsen-nx-workspace/actions/workflows/ci_cd.yml/badge.svg?branch=main)](https://github.com/peterjokumsen/peterjokumsen-nx-workspace/actions/workflows/ci_cd.yml) [![🤖 MegaLinter](https://github.com/peterjokumsen/peterjokumsen-nx-workspace/actions/workflows/mega-linter.yml/badge.svg)](https://github.com/peterjokumsen/peterjokumsen-nx-workspace/actions/workflows/mega-linter.yml)

<a href="https://nx.dev" target="_blank" rel="noreferrer"><img alt="Nx logo" src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a> ✨ **This workspace has been generated using [Nx, Smart Monorepos · Fast CI.](https://nx.dev)** ✨

This repository is meant as a playground of sorts, that I've created as a collection of applications and libraries, to play around with theories.

## Applications

### Blog

<a href="https://blog.peterjokumsen.com" target="_blank" rel="noreferrer"><img alt="Peter Jokumsen Blog" src="https://blog.peterjokumsen.com/assets/logo-150.webp" width="150"></a>

Application, located in [`apps/blog`](./apps/blog), is the initial project, to be used as a blog to share with posts and articles.

Hosted as an [Azure Static Web App](https://docs.microsoft.com/en-us/azure/static-web-apps/overview), using bicep for infrastructure as code, at [https://blog.peterjokumsen.com](https://blog.peterjokumsen.com).

## Libraries

### ng-libs

[`ng-libs/**`](./ng-libs/README.md) is a collection of Angular libraries, meant to be shared re-usable components, services, and utilities.

#### ng-libs/md-renderer

[`ng-libs/md-renderer`](./ng-libs/md-renderer/README.md) is a Angular project to render markdown.

#### ng-libs/services

[`ng-libs/services`](./ng-libs/services/README.md) is a collection of shared Angular services for the workspace. Named as `ng-services`, just in case any other `services` libraries created in the future.

#### ng-libs/styles

[`ng-libs/styles`](./ng-libs/styles/README.md) is a collection of shared styles for the workspace. Using [Angular material theming](https://v17.material.angular.io/guide/theming).

> I wouldn't call the approach I've done as `best practice` or even `good practice`. It's more of a `practice` to see how it works out.

#### ng-libs/ui-elements

[`ng-libs/ui-elements`](./ng-libs/ui-elements/README.md) is a collection of shared Angular based UI elements, components, and directives.

### ts-libs

[`ts-libs/**`](./ts-libs/README.md) is a collection of TypeScript libraries, meant to be shared functions and utilities.

#### ts-libs/md-parser

[`ts-libs/md-parser`](./ts-libs/md-parser/README.md) is a parser for Markdown text.

#### ts-libs/ts-utils

[`ts-libs/ts-utils`](./ts-libs/ts-utils/README.md) is a collection of utility functions for the workspace.

## Upgrading dependencies

### Nx

Use Nx migrate to update the workspace to the latest version of Nx.

```bash
npx nx migrate latest
```

#### Installing updated dependencies

If `migrate` updated `package.json`, I've found that need to remove `package-lock.json` and `node_modules` before running `npm install` to avoid issues with `npm` and `yarn` dependencies.

After installing dependencies, buildable libraries with `peerDependencies` may need to be updated. Node script `update-peer-dependencies.js` can be run to update the `peerDependencies` in the `package.json` files.

```bash
npm run update-peer-dependencies
```

If lint fails due to `@nx/dependency-checks` rule, try to run `npx nx reset` to reset `Nx` daemon and cache.

#### Running migrations

If `migrations.json` file has been created, run the migrations to update the workspace.

```bash
npx nx migrate --run-migrations
```

### Angular

Angular should be updated when updating [Nx](#nx) to the latest version. So have not had to do this manually yet.

### Other dependencies

Have not yet found a simple approach for updating other dependencies at this time. Will update this section when I find a good approach.

## Local infrastructure tests

### Pre-requisites

- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)

Install bicep:

```bash
az bicep install
```

Possibly update `az` CLI:

```bash
az upgrade
```

### Linting bicep

```bash
az bicep build ./infrastructure/main.bicep
```

```bash
az bicep lint --file ./.biceps/main.bicep --diagnostics-format sarif
```

### Deploying bicep

```bash
az deployment group what-if --resource-group blog-rg
  --name 'add-tdd.b7e69de'
  --template-file ./.biceps/main.bicep
  --parameters
    location='westeurope'
    branch='add-tdd'
    appName='blog'
    subDomain='blog'

az deployment sub create --location westeurope --template-file ./infrastructure/main.bicep
```

## Code coverage

Sunburst graph of code coverage for the workspace:

![codecov coverage graph](https://codecov.io/gh/peterjokumsen/peterjokumsen-nx-workspace/graphs/sunburst.svg?token=0QX0KNI1R4)
