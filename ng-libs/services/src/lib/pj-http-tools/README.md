# PjHttpTools

Currently, a provider for [Angular `HttpClient`](https://angular.dev/guide/http) that will include interceptor to log requests when not in production.

## Usage

Use `providePjHttpTools` function in app configuration providers:

```typescript
import { ApplicationConfig, isDevMode } from '@angular/core';

import { providePjHttp } from '@peterjokumsen/ng-services';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    providePjHttpTools(withFetch()), // include `withFetch()` to enable `fetch`
    // ...
  ],
};
```
