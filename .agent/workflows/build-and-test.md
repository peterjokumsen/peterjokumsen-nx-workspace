---
description: Build and Test changes in the Workspace
---

# Build and Test Changes

When an agent needs to build, lint, and test affected code after making modifications, you should rely on the Nx unaffected boundary principles using `pnpm`.

## Step-by-Step

1. First, check code formatting (or format it) by running:
   // turbo

```bash
pnpm run format:write
```

2. After ensuring format is correct, test if any uncommitted changes break the local linting config:
   // turbo

```bash
pnpm run lint:uncommitted
```

3. Run uncommitted tests:
   // turbo

```bash
pnpm run test:uncommitted
```

4. Or alternatively, run the combined fast check:
   // turbo

```bash
pnpm run prep-commit
```

## Running Entire Workspace Builds

If you need to verify changes completely from `main` state:

- All Linting: `pnpm run lint:affected`
- All Tests: `pnpm run test:affected`
- All Builds: `pnpm run build:affected`
