# 2.0.0 (2024-07-08)

### 🚀 Features

- create initial nx workspace

- create `ui-elements` library

- create `blog-container` library

- create `util-fns` library

- install @angular/material

- **blog:** add landing page

- **blog:** add tailwind

- **biceps:** create bicep files to create SWA

- **workflows:** create `install-deps` action

- **workflows:** specify custom domain for SWA

- **biceps:** create DNS Zone with `A` record linked to static app

- **workflows:** create standalone resources for preview

- **ng-libs:** create ng-services library with `PjLogger`

- **ng-services:** create pj-browser-providers service

- **ng-services:** create `PjTheme` service with `setTheme` functionality

- **ng-services:** add `setTheme` to `PjTheme` service

- **blog:** set up project as PWA

- **ng-services:** create parser to convert markdown to article

- **.github:** add issue template forms to replace markdown

- **.github:** update to use nx-cloud

- **ts-libs:** move `util-fns` lib to `ts-utils`

- **.github:** rename re-usable workflow files and update stages

- **.github:** rename re-usable workflow files and update stages

- **.github:** move lint bicep to infra workflow

- **ng-services:** update `PjTheme` to use `getOrCreateLinkElement`

- **ng-services:** update debug implementation of `PjLogger`

- **ng-services:** create `pj-http-tools` to provide HttpClient

- **.github:** create template for documentation request

- **.github:** create re-usable workflow to clean staging

- **.github:** update post_deploy to add lighthouse report to step summary

- **ts-libs:** create `markdown-parser` librar

- **.github:** update lighthouse-report.parser to output to summary

- **.github:** pass in `core.summary` to lighthouse report fn

- **.github:** move check affected to `preparation` workflow

- **.github:** check if bicep files have changed

- **.github:** update infra workflow to use `infra_affected`

- **.github:** build project when infra has changed

- **deps:** upgrade `nx@19.3.0` and `angular@18.0` deps

- **deps:** apply migrations for `nx@19.3.0` and `angular@18.0.x`

- **ng-libs:** create `md-renderer` library to render parsed markdown

- **ng-services:** update logger to collapse groups

- **.github:** add `/about-me` page for lighthouse report

### 🩹 Fixes

- **biceps:** rename DNS zone deployment to include deployment name

- **blog:** resolve accessibility issues

- **ng-services:** remove early whitespace in passed in value for parsing

- **ng-services:** update imports for pj-theme

- **.github:** reduce jobs for prep and remove `env`

- **.github:** remove expression setting `test_and_lint` job output

- **.github:** use correct syntax for output

- **.github:** move build to its own step

- **.github:** drop usage of `ls` to check for compiled app

- **.github:** update output to flag compiled

- **.github:** update test for all to not build

- **.github:** remove local cache for nx in workflow

- **.github:** update runs-on for waiting for deployment

- **.github:** update filename used to get commenter for lighthouse

- **.github:** update defaulting formFactor value

- **.github:** publish coverage when coverage changed

- **.github:** group affected outputs and use `ci` config

- **.github:** use condition for testing affected

- **.github:** use `staging` configuration when not in `main`

- **.github:** remove timing for `createLighthouseReport`

- **.github:** make `formFactor` a string for lighthouse report parser

- **.github:** only perform 1 lighthouse report

- **.github:** update build workflow to check if project affected

- **ng-services:** update group title for group logging in `PjBrowserTools`

- **.github:** update typo for getting app name

- **.github:** rename property to align with `core.summary`

- **.github:** update check for infra changes

- **.github:** update condition for `deploy_app`

- **.github:** run post_deploy when deploy_app is successful

- **docs:** update badge in README.md

- **.github:** remove nx cloud usage for `format:check`

- **.github:** add check that `lint_test_build` workflow successful before deploying

- **.github:** add step to fetch `origin/main` as `main`

- **ng-services:** update specs to align with functionality

- **.github:** adjust git commands to checkout `main`

- **.codecov:** set project to 80% and patch to 50%

- **.codecov:** ignore patch failure

### ❤️ Thank You

- Peter Jokumsen

# 1.0.0 (2024-07-08)

### 🚀 Features

- create initial nx workspace

- create `ui-elements` library

- create `blog-container` library

- create `util-fns` library

- install @angular/material

- **blog:** add landing page

- **blog:** add tailwind

- **biceps:** create bicep files to create SWA

- **workflows:** create `install-deps` action

- **workflows:** specify custom domain for SWA

- **biceps:** create DNS Zone with `A` record linked to static app

- **workflows:** create standalone resources for preview

- **ng-libs:** create ng-services library with `PjLogger`

- **ng-services:** create pj-browser-providers service

- **ng-services:** create `PjTheme` service with `setTheme` functionality

- **ng-services:** add `setTheme` to `PjTheme` service

- **blog:** set up project as PWA

- **ng-services:** create parser to convert markdown to article

- **.github:** add issue template forms to replace markdown

- **.github:** update to use nx-cloud

- **ts-libs:** move `util-fns` lib to `ts-utils`

- **.github:** rename re-usable workflow files and update stages

- **.github:** rename re-usable workflow files and update stages

- **.github:** move lint bicep to infra workflow

- **ng-services:** update `PjTheme` to use `getOrCreateLinkElement`

- **ng-services:** update debug implementation of `PjLogger`

- **ng-services:** create `pj-http-tools` to provide HttpClient

- **.github:** create template for documentation request

- **.github:** create re-usable workflow to clean staging

- **.github:** update post_deploy to add lighthouse report to step summary

- **ts-libs:** create `markdown-parser` librar

- **.github:** update lighthouse-report.parser to output to summary

- **.github:** pass in `core.summary` to lighthouse report fn

- **.github:** move check affected to `preparation` workflow

- **.github:** check if bicep files have changed

- **.github:** update infra workflow to use `infra_affected`

- **.github:** build project when infra has changed

- **deps:** upgrade `nx@19.3.0` and `angular@18.0` deps

- **deps:** apply migrations for `nx@19.3.0` and `angular@18.0.x`

- **ng-libs:** create `md-renderer` library to render parsed markdown

- **ng-services:** update logger to collapse groups

- **.github:** add `/about-me` page for lighthouse report

### 🩹 Fixes

- **biceps:** rename DNS zone deployment to include deployment name

- **blog:** resolve accessibility issues

- **ng-services:** remove early whitespace in passed in value for parsing

- **ng-services:** update imports for pj-theme

- **.github:** reduce jobs for prep and remove `env`

- **.github:** remove expression setting `test_and_lint` job output

- **.github:** use correct syntax for output

- **.github:** move build to its own step

- **.github:** drop usage of `ls` to check for compiled app

- **.github:** update output to flag compiled

- **.github:** update test for all to not build

- **.github:** remove local cache for nx in workflow

- **.github:** update runs-on for waiting for deployment

- **.github:** update filename used to get commenter for lighthouse

- **.github:** update defaulting formFactor value

- **.github:** publish coverage when coverage changed

- **.github:** group affected outputs and use `ci` config

- **.github:** use condition for testing affected

- **.github:** use `staging` configuration when not in `main`

- **.github:** remove timing for `createLighthouseReport`

- **.github:** make `formFactor` a string for lighthouse report parser

- **.github:** only perform 1 lighthouse report

- **.github:** update build workflow to check if project affected

- **ng-services:** update group title for group logging in `PjBrowserTools`

- **.github:** update typo for getting app name

- **.github:** rename property to align with `core.summary`

- **.github:** update check for infra changes

- **.github:** update condition for `deploy_app`

- **.github:** run post_deploy when deploy_app is successful

- **docs:** update badge in README.md

- **.github:** remove nx cloud usage for `format:check`

- **.github:** add check that `lint_test_build` workflow successful before deploying

- **.github:** add step to fetch `origin/main` as `main`

- **ng-services:** update specs to align with functionality

- **.github:** adjust git commands to checkout `main`

- **.codecov:** set project to 80% and patch to 50%

- **.codecov:** ignore patch failure

### ❤️ Thank You

- Peter Jokumsen
