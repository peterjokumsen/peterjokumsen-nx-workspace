---
description: Create a new library, app, or Angular component using Nx
---

# Create a Feature

To create an element in this workspace, you must use `Nx` generators to maintain configuration consistency.

## Scopes

Understand that code should be grouped:

- **`apps`**: End-user full applications.
- **`ng-libs`**: Angular components, directives, UI libraries.
- **`ts-libs`**: Plain typescript utilities and domain-logic.

## 1. Creating a new Application

```bash
pnpm exec nx g @nx/angular:app [app-name] --style=scss --e2eTestRunner=playwright --unitTestRunner=jest
```

## 2. Creating a new Angular Library

If generating shared services or UI components, you should generate a library within `ng-libs`:

```bash
pnpm exec nx g @nx/angular:library [lib-name] --directory=ng-libs/[lib-name] --unitTestRunner=jest
```

## 3. Creating a Component in an Application or Library

Components should adhere to the workspace configuration (OnPush, inline template/style). To generate a component inside a specific project:

```bash
pnpm exec nx g @nx/angular:component [component-name] --project=[project-name]
```
