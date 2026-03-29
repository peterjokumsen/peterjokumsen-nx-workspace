---
description: Manage GitHub Workflows and Actions in the repository
---

# Manage GitHub Workflows and Actions

This workflow guides you through discovering, modifying, and creating GitHub Actions and Workflows while adhering to the repository's established patterns.

## 1. Discovery

Before making changes, understand the current structure:

- **Workflows**: Located in `.github/workflows/`.
  - Shared/modular jobs often start with an underscore (e.g., `_workflow.jobs.cd.yml`) and use `workflow_call`.
- **Custom Actions**: Located in `.github/actions/`.
  - Use these for reusable steps (e.g., `install-deps`) to keep workflows DRY.

## 2. Standards & Best Practices

Adhere to these rules for consistency and security:

- **Node.js**: Always use **Node.js 24**.
- **Package Manager**: Use **pnpm**.
- **Automation**: Use the composite action `./.github/actions/install-deps` for setting up the environment.
- **Naming**: Use descriptive names with emojis for clarity in the GitHub UI (e.g., `[🧪] all`, `🏭 & 🚀`).
- **Permissions**: explicitly define `permissions` at the job or workflow level following the principle of least privilege.
- **Secrets**: Use standardized secrets like `AZURE_CLIENT_ID`, `NX_CLOUD_ACCESS_TOKEN`, etc.

## 3. Validation

Always validate your YAML changes before pushing:

- **Local Linting**: Run MegaLinter locally if possible, or ensure it passes in CI.
  // turbo
  ```bash
  pnpm run mega-lint
  ```
- **Syntax Check**: Ensure the YAML is well-formed. Use VS Code's built-in GitHub Actions support if available.

## 4. Testing Strategies

Testing GitHub Actions can be challenging. Use these methods:

- **Feature Branch**: Always work on a branch and trigger workflows there.
- **`workflow_dispatch`**: If testing a new workflow, add a `workflow_dispatch` trigger to run it manually from the Actions tab.
- **Local Testing (Experimental)**: If you have [act](https://github.com/nektos/act) installed, you can attempt to run workflows locally:
  ```bash
  act pull_request
  ```
- **Temporary Workflows**: Create a small, temporary `.github/workflows/test-logic.yml` to verify specific logic (e.g., shell scripts or step outputs) before integrating into main workflows.

## 5. Deployment & OIDC

For Azure deployments:

- Use **OIDC** for authentication (e.g., `azure/login@v2` with `client-id`, `tenant-id`, and `subscription-id`).
- Ensure `id-token: write` permission is granted.
