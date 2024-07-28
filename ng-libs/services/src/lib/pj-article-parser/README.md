# PjArticleParser

This service is used to parse source value into an observable with `PjArticle` value emitted. The hope is to make this service useful for parsing articles from different sources. Primarily it should be able to convert Markdown into a `PjArticle` value. See [implemented markdown features](#implemented-markdown-features).

## Usage

### Providing the service

To use the `PjArticleParser` service, you need to provide it in the root module of your application. You can do this by calling `providePjArticleParser` function in your app configuration providers:

```typescript
import { ApplicationConfig, isDevMode } from '@angular/core';

import { providePjArticleParser } from '@peterjokumsen/ng-services';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    providePjArticleParser(),
    // ...
  ],
};
```

Or you can provide it in the root module of your application:

```typescript
import { NgModule, isDevMode } from '@angular/core';

import { providePjArticleParser } from '@peterjokumsen/ng-services';

@NgModule({
  providers: [
    // ...
    providePjArticleParser(),
    // ...
  ],
})
export class AppModule {}
```

### Using the service

To use the `PjArticleParser` service, you need to inject it into your component or service:

```typescript
import { PjArticleParser } from '@peterjokumsen/ng-services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private parser: PjArticleParser) {
    this.parser.fromSource('dark');
  }
}
```

## Implemented markdown features

### Titles

Titles are parsed from `#` to `######` and mark the start of a section for article generated.

[GitHub issue](https://github.com/peterjokumsen/peterjokumsen-nx-workspace/issues/42)

> Nesting sections is not _yet_ supported (using `##` inside a `#` section)

### Text

Text is parsed as is.

### Links

Links are parsed from `[text](url)` and are converted to an anchor tag.

[GitHub issue](https://github.com/peterjokumsen/peterjokumsen-nx-workspace/issues/43)

> Links are not _yet_ supported. Although it will be handled by `PjUiArticle` component.

### Images

Images are parsed from `![alt text](url)` and are converted to an image tag.

[GitHub issue](https://github.com/peterjokumsen/peterjokumsen-nx-workspace/issues/44)

> Images are not _yet_ supported. Although it will be handled by `PjUiArticle` component.

### Code blocks

Code blocks are parsed from lines starting with ` ```(language) ` and ended with a line starting with ` ``` `, this generates a block of code with syntax highlighting for the specific `(language)` used.

[GitHub issue](https://github.com/peterjokumsen/peterjokumsen-nx-workspace/issues/45)

> Code blocks is not _yet_ supported.

#### Language support

The following languages are (to be) supported for syntax highlighting:

- [ ] `html`
- [ ] `css`
- [ ] `scss`
- [ ] `javascript`
- [ ] `typescript`
- [ ] `json`
- [ ] `xml`
- [ ] `markdown`
- [ ] `bash`
- [ ] `shell`
- [ ] `powershell`
- [ ] `csharp`

### Lists

Lists are parsed from `*` or `-` and are converted to a list tag.

[GitHub issue](https://github.com/peterjokumsen/peterjokumsen-nx-workspace/issues/48)

> Lists are not _yet_ supported.

### Quotes

Quotes are parsed from `>` and are converted to a quote tag.

[GitHub issue](https://github.com/peterjokumsen/peterjokumsen-nx-workspace/issues/49)

> Quotes are not _yet_ supported.

### Horizontal rules

Horizontal rules are parsed from `---` and are converted to a horizontal rule tag.

[GitHub issue](https://github.com/peterjokumsen/peterjokumsen-nx-workspace/issues/50)

> Horizontal rules are not _yet_ supported.

### Tables

Tables are parsed from `|` and are converted to a table tag.

> Tables are not _yet_ supported.

### Emphasis

Emphasis is parsed from `*` and are converted to an emphasis tag.

> Emphasis is not _yet_ supported.

### Strong

Strong is parsed from `**` and are converted to a strong tag.

> Strong is not _yet_ supported.

### Strike-through

Strikethrough is parsed from `~~` and are converted to a strikethrough tag.

> Strike-through is not _yet_ supported.

### Inline code

Inline code is parsed from `` `code` `` and are converted to an inline code tag.

[GitHub issue](https://github.com/peterjokumsen/peterjokumsen-nx-workspace/issues/51)

> Inline code is not _yet_ supported.

### Footnotes

Footnotes are parsed from `[^1]` and are converted to a footnote tag.

> Footnotes are not _yet_ supported.

### Abbreviations

Abbreviations are parsed from `*[HTML]: Hyper Text Markup Language` and are converted to an abbreviation tag.

> Abbreviations are not _yet_ supported.

... more to come
