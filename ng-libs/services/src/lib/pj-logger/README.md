# PjLogger

This service is used to log messages to the console, which will not be logged to console in production mode.

## Usage

### Providing the service

To use the `PjLogger` service, you need to provide it in the root module of your application. You can do this by calling `providePjLogger` function in your app configuration providers:

```typescript
import { ApplicationConfig, isDevMode } from '@angular/core';

import { providePjLogger } from '@peterjokumsen/ng-services';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    providePjLogger({ production: !isDevMode() }), // can use isDevMode() to determine if in development mode
    // ...
  ],
};
```

Or you can provide it in the root module of your application:

```typescript
import { NgModule, isDevMode } from '@angular/core';

import { providePjLogger } from '@peterjokumsen/ng-services';

@NgModule({
  providers: [
    // ...
    providePjLogger({ production: !isDevMode() }),
    // ...
  ],
})
export class AppModule {}
```

When `production` property is set to `true`, `null`, or no argument used, the `PjLogger` service will use [`LiveLoggerService`](#liveloggerservice-implementation) as the implementation of `PjLogger`. When `production` property is set to `false`, the `PjLogger` service will use [`DebugLoggerService`](#debugloggerservice-implementation) as the implementation of `PjLogger`.

### Using the service

To use the `PjLogger` service, you need to inject it into your component or service:

```typescript
import { PjLogger } from '@peterjokumsen/ng-services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private logger: PjLogger) {
    this.logger.to.log('Hello, world!');
  }
}
```

## Properties

### `to`

This property is used to log messages to the console. It has the following functions, aligned with the `console` object:

- `log`
- `warn`
- `error`
- `info`
- `debug`
- `table`
- `trace`
- `group`
- `groupCollapsed`
- `groupEnd`
- `clear`
- `count`
- `countReset`

> See [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Console) for more information on the `console` object.

## Implementations

### LiveLoggerService implementation

This implementation of `PjLogger` service will not log messages, and will be used when `production` property is set to `true`, `null`, or no argument used.

### DebugLoggerService implementation

This implementation of `PjLogger` service will log messages to the console, and will be used when `production` property is set to `false`.

#### Overrides

|  Function  | Override description                                                                             |
| :--------: | ------------------------------------------------------------------------------------------------ |
|  `group`   | When called, will start a timer (`console.time`) using the same title as the group title used.   |
| `groupEnd` | When called, will end timer for last group created, if no group title found, will not end timer. |
