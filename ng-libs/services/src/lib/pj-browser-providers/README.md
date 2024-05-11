# PjBrowserProviders

This service is meant to provide browser objects and services to Angular applications.

## Usage

### Providing the service

To use the `PjBrowserProviders` service, you need to provide it in the root module of your application. You can do this by calling `providePjBrowserProviders` function in your app configuration providers:

```typescript
import { ApplicationConfig } from '@angular/core';
import { providePjBrowserProviders } from '@peterjokumsen/ng-services';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    providePjBrowserProviders(),
    // ...
  ],
};
```

### Using the service

You can inject the `PjBrowserProviders` service in your components or services:

```typescript
import { Component } from '@angular/core';
import { PjBrowserProviders } from '@peterjokumsen/ng-services';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <p>Hello, World!</p>
    </div>
  `,
})
export class AppComponent {
  constructor(private _browserProviders: PjBrowserProviders) {
    console.log('Provided window: %o', this._browserProviders.window);
  }
}
```
