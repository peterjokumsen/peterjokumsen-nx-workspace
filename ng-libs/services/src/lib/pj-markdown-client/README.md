# PjMarkdownClient

This service is meant to be used in Angular applications to provide a simple way to fetch markdown files from a relative URL.

Thinking that would like to use relative paths for images in markdown files, the service will also replace the image paths in the markdown files with the correct path to the images.

## Usage

### Providing the service

To use the `PjMarkdownClient` service, you need to provide it in the root module of your application. You can do this by calling `providePjMarkdownClient` function in your app configuration providers:

```typescript
import { ApplicationConfig } from '@angular/core';

import { providePjMarkdownClient } from '@peterjokumsen/ng-services';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    providePjMarkdownClient(),
    // ...
  ],
};
```

Or you can provide it in the root module of your application:

```typescript
import { NgModule } from '@angular/core';

import { providePjMarkdownClient } from '@peterjokumsen/ng-services';

@NgModule({
  providers: [
    // ...
    providePjMarkdownClient(),
    // ...
  ],
})
export class AppModule {}
```

### Using the service

To use the `PjMarkdownClient` service, you need to inject it into your component or service:

```typescript
import { PjMarkdownClient } from '@peterjokumsen/ng-services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private markdownClient: PjMarkdownClient) {
    this.markdownClient.getMarkdown('/assets/markdown-file.md')
      .subscribe((markdown) => {
        console.log(markdown);
      });
  }
}
```
