# styles

This library was generated with [Nx](https://nx.dev).

## Purpose

This library is meant as a central place to store all the styles that are shared across the different applications in the workspace.

## The structure

The styles in this library are organized in the following way:

- [`global.scss`](./src/lib/styles/global.scss) - This file contains the global styles that should be applied to the entire application.
- [`theme-base.scss`](./src/lib/styles/theme-base.scss) - This file contains `typography`, `density`, and `structural` styles.
- [`light-theme.scss`](./src/lib/styles/light-theme.scss) - This file contains the `color` styles for the light theme.
- [`dark-theme.scss`](./src/lib/styles/dark-theme.scss) - This file contains the `color` styles for the dark theme.

Mixins are stored in the [`mixins`](./src/lib/styles/mixins) folder. Each mixin is stored in its own file, with the file named the same as the mixin. And imported in [`mixins.scss`](./src/lib/styles/mixins.scss) file, to be imported by any other stylesheets.

Variables are stored in the [`variables.scss`](./src/lib/styles/variables.scss) stylesheet.

## Usage

Update `project.json` in your application to have the following `targets.build.options.styles`:

```json
{
  "name": "project-name",
  "targets": {
    "build": {
      "options": {
        "styles": [
          {
            "input": "ng-libs/styles/src/lib/styles/light-theme.scss",
            "bundleName": "light-theme",
            "inject": false
          },
          {
            "input": "ng-libs/styles/src/lib/styles/dark-theme.scss",
            "bundleName": "dark-theme",
            "inject": false
          },
          {
            "input": "ng-libs/styles/src/lib/styles/theme-base.scss",
            "bundleName": "theme-base",
            "inject": false
          },
          "ng-libs/styles/src/lib/styles/global.scss"
        ]
      }
    }
  }
}
```

This will include `global.scss` into the application's styles, and will create two separate bundles for the light and dark themes. To include the light or dark theme in the application, you can import the respective stylesheet in your `index.html` file of the application.

```html
<!doctype html>
<html lang="en">
  <head>
    <!-- ... -->
    <link id="theme-base" rel="stylesheet" type="text/css" href="theme-base.css" />
    <link id="light-theme" type="text/css" href="light-theme.css" />
    <link id="dark-theme" rel="stylesheet" type="text/css" href="dark-theme.css" />
    <!-- ... -->
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
```

The above HTML will include the `theme-base` styles, dark and light themes in the application. With the dark theme link `rel` set to `'stylesheet'` to have it used as the initial theme.

To adjust the theming to use `light-theme.css`, you can adjust the `rel` for `#light-theme` to `'stylesheet'` and for `#dark-theme` to `''`.

### Example of changing theme in Angular

To change the theme in Angular, you can use the following code:

```typescript
import { Component, PLATFORM_ID, inject } from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  // ...
})
export class AppComponent {
  private _platformId = inject(PLATFORM_ID);

  changeTheme(theme: 'light' | 'dark') {
    // Check if the current platform is browser, to avoid errors in server-side rendering
    if (!isPlatformBrowser(this._platformId)) return;

    const themes = [document.getElementById('light-theme') as HTMLLinkElement, document.getElementById('dark-theme') as HTMLLinkElement];
    for (const theme of themes) {
      theme.rel = theme.id.includes(theme) ? 'stylesheet' : '';
    }
  }
}
```
