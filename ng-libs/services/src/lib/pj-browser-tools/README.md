# PjBrowserTools

This service is meant to provide browser and document related functions to Angular applications.

## Usage

### Providing the service

To use the `PjBrowserTools` service, you need to provide it in the root module of your application. You can do this by calling `providePjBrowserTools` function in your app configuration providers:

```typescript
import { ApplicationConfig } from '@angular/core';
import { providePjBrowserTools } from '@peterjokumsen/ng-services';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    providePjBrowserTools(),
    // ...
  ],
};
```

### Using the service

You can inject the `PjBrowserTools` service in your components or services:

```typescript
import { Component } from '@angular/core';
import { PjBrowserTools } from '@peterjokumsen/ng-services';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <p>Hello, World!</p>
    </div>
  `,
})
export class AppComponent {
  constructor(private _browserTools: PjBrowserTools) {
    console.log('Provided window: %o', this._browserProviders.window);
  }
}
```
