# PjTheme

This service is used to set the theme for a applications.

## Usage

### Providing the service

To use the `PjTheme` service, you need to provide it in the root module of your application. You can do this by calling `providePjTheme` function in your app configuration providers:

```typescript
import { ApplicationConfig, isDevMode } from '@angular/core';

import { providePjTheme } from '@peterjokumsen/ng-services';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    providePjTheme(),
    // ...
  ],
};
```

Or you can provide it in the root module of your application:

```typescript
import { NgModule, isDevMode } from '@angular/core';

import { providePjTheme } from '@peterjokumsen/ng-services';

@NgModule({
  providers: [
    // ...
    providePjTheme(),
    // ...
  ],
})
export class AppModule {}
```

### Using the service

To use the `PjTheme` service, you need to inject it into your component or service:

```typescript
import { PjTheme } from '@peterjokumsen/ng-services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private theme: PjTheme) {
    this.theme.setTheme('dark');
  }
}
```
