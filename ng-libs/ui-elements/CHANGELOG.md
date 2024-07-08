# 2.0.0 (2024-07-08)

### 🚀 Features

- create initial nx workspace

- create `ui-elements` library

- create `blog-container` library

- create `util-fns` library

- install @angular/material

- **blog:** add landing page

- **blog:** add tailwind

- **ui-elements:** create `pj-ui-router-nav` component

- **biceps:** create bicep files to create SWA

- **workflows:** create `install-deps` action

- **workflows:** specify custom domain for SWA

- **biceps:** create DNS Zone with `A` record linked to static app

- **workflows:** create standalone resources for preview

- **ui-elements:** create components to drive articles

- **ui-elements:** set current section as active in article navigation

- **ng-libs:** create ng-services library with `PjLogger`

- **ui-elements:** create theme-toggle.component

- **styles:** update to allow opacity for backgrounds

- **ui-elements:** add `Back to top` nav when elements in view

- **ui-elements:** use animation to add/remove nav element

- **ui-elements:** create page-introduction component

- **ui-elements:** implement page-introduction

- **ui-elements:** allow for customizing background in page-introduction

- **ui-elements:** update actions to take in string as label

- **ui-elements:** display content of page-introduction component

- **ui-elements:** create full-page-loader component

- **ui-elements:** update theme-toggle to use `PjTheme`

- **ui-elements:** create split-to-anchor pipe

- **ui-elements:** update article-section to use SplitToAnchorPipe

- **ui-elements:** update transform-article-content to render images

- **blog:** set up project as PWA

- **ui-elements:** update article models to extend `PjArticle` elements

- **.github:** add issue template forms to replace markdown

- **.github:** update to use nx-cloud

- **ts-libs:** move `util-fns` lib to `ts-utils`

- **.github:** rename re-usable workflow files and update stages

- **.github:** rename re-usable workflow files and update stages

- **.github:** move lint bicep to infra workflow

- **ui-elements:** update router-nav to use `mat-raised-button`

- **ui-elements:** update article-nav to use material buttons

- **ui-elements:** use material button for call-to-action buttons

- **ui-elements:** update theme-toggle to set theme

- **ui-elements:** remove output in theme-toggle

- **ui-elements:** update page-introduction to preload background image

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

- **ui-elements:** allow overrides for router nav with toggle-switch

- **ui-elements:** stagger page navigation elements

- **deps:** upgrade `nx@19.3.0` and `angular@18.0` deps

- **deps:** apply migrations for `nx@19.3.0` and `angular@18.0.x`

- **ng-libs:** create `md-renderer` library to render parsed markdown

- **.github:** add `/about-me` page for lighthouse report

### 🩹 Fixes

- **biceps:** rename DNS zone deployment to include deployment name

- **blog:** resolve accessibility issues

- **ui-elements:** left-align text section

- **ui-elements:** update router-nav to allow for root navigation

- **ui-elements:** reset active article nav when none in view

- **ui-elements:** adjust animation keyframes for nav elements

- **ui-elements:** move `pj-ui-theme-toggle` into `theme-toggle` folder

- **ui-elements:** add index for `page-introduction`

- **ui-elements:** use output to drive page-introduction click

- **ui-elements:** rename `title` input to `introductionTitle`

- **ui-elements:** use global background color for full-page-loader

- **ui-elements:** update styles for full-page-loader

- **ui-elements:** set article section container to grow

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

- **ui-elements:** make active router element bold

- **.github:** update typo for getting app name

- **.github:** rename property to align with `core.summary`

- **.github:** update check for infra changes

- **.github:** update condition for `deploy_app`

- **.github:** run post_deploy when deploy_app is successful

- **ui-elements:** prevent article nav from blocking secondary header

- **ui-elements:** update article specs

- **docs:** update badge in README.md

- **.github:** remove nx cloud usage for `format:check`

- **.github:** add check that `lint_test_build` workflow successful before deploying

- **.github:** add step to fetch `origin/main` as `main`

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

- **ui-elements:** create `pj-ui-router-nav` component

- **biceps:** create bicep files to create SWA

- **workflows:** create `install-deps` action

- **workflows:** specify custom domain for SWA

- **biceps:** create DNS Zone with `A` record linked to static app

- **workflows:** create standalone resources for preview

- **ui-elements:** create components to drive articles

- **ui-elements:** set current section as active in article navigation

- **ng-libs:** create ng-services library with `PjLogger`

- **ui-elements:** create theme-toggle.component

- **styles:** update to allow opacity for backgrounds

- **ui-elements:** add `Back to top` nav when elements in view

- **ui-elements:** use animation to add/remove nav element

- **ui-elements:** create page-introduction component

- **ui-elements:** implement page-introduction

- **ui-elements:** allow for customizing background in page-introduction

- **ui-elements:** update actions to take in string as label

- **ui-elements:** display content of page-introduction component

- **ui-elements:** create full-page-loader component

- **ui-elements:** update theme-toggle to use `PjTheme`

- **ui-elements:** create split-to-anchor pipe

- **ui-elements:** update article-section to use SplitToAnchorPipe

- **ui-elements:** update transform-article-content to render images

- **blog:** set up project as PWA

- **ui-elements:** update article models to extend `PjArticle` elements

- **.github:** add issue template forms to replace markdown

- **.github:** update to use nx-cloud

- **ts-libs:** move `util-fns` lib to `ts-utils`

- **.github:** rename re-usable workflow files and update stages

- **.github:** rename re-usable workflow files and update stages

- **.github:** move lint bicep to infra workflow

- **ui-elements:** update router-nav to use `mat-raised-button`

- **ui-elements:** update article-nav to use material buttons

- **ui-elements:** use material button for call-to-action buttons

- **ui-elements:** update theme-toggle to set theme

- **ui-elements:** remove output in theme-toggle

- **ui-elements:** update page-introduction to preload background image

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

- **ui-elements:** allow overrides for router nav with toggle-switch

- **ui-elements:** stagger page navigation elements

- **deps:** upgrade `nx@19.3.0` and `angular@18.0` deps

- **deps:** apply migrations for `nx@19.3.0` and `angular@18.0.x`

- **ng-libs:** create `md-renderer` library to render parsed markdown

- **.github:** add `/about-me` page for lighthouse report

### 🩹 Fixes

- **biceps:** rename DNS zone deployment to include deployment name

- **blog:** resolve accessibility issues

- **ui-elements:** left-align text section

- **ui-elements:** update router-nav to allow for root navigation

- **ui-elements:** reset active article nav when none in view

- **ui-elements:** adjust animation keyframes for nav elements

- **ui-elements:** move `pj-ui-theme-toggle` into `theme-toggle` folder

- **ui-elements:** add index for `page-introduction`

- **ui-elements:** use output to drive page-introduction click

- **ui-elements:** rename `title` input to `introductionTitle`

- **ui-elements:** use global background color for full-page-loader

- **ui-elements:** update styles for full-page-loader

- **ui-elements:** set article section container to grow

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

- **ui-elements:** make active router element bold

- **.github:** update typo for getting app name

- **.github:** rename property to align with `core.summary`

- **.github:** update check for infra changes

- **.github:** update condition for `deploy_app`

- **.github:** run post_deploy when deploy_app is successful

- **ui-elements:** prevent article nav from blocking secondary header

- **ui-elements:** update article specs

- **docs:** update badge in README.md

- **.github:** remove nx cloud usage for `format:check`

- **.github:** add check that `lint_test_build` workflow successful before deploying

- **.github:** add step to fetch `origin/main` as `main`

- **.github:** adjust git commands to checkout `main`

- **.codecov:** set project to 80% and patch to 50%

- **.codecov:** ignore patch failure

### ❤️ Thank You

- Peter Jokumsen
