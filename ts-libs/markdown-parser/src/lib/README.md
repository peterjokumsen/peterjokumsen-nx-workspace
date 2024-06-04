# parseMarkdown

This function parses a markdown string and returns an array of objects.

## Usage

```typescript
import { parseMarkdown } from '@peterjokumsen/markdown-parser';

const markdown = `
# Hello, world!

This is a paragraph of text.

## Subheading

This is another paragraph of text.
`;

const parsedMarkdown = parseMarkdown(markdown);

console.log(parsedMarkdown);
```

The above code will output:

```json
[
  {
    "type": "section",
    "title": "Hello, world!",
    "content": [
      {
        "type": "paragraph",
        "content": "This is a paragraph of text."
      },
      {
        "type": "section",
        "title": "Subheading",
        "content": [
          {
            "type": "paragraph",
            "content": "This is another paragraph of text."
          }
        ]
      }
    ]
  }
]
```

# Internal functions

While there is only 1 exported function in this library, there are a few internal functions that are used to parse the markdown text.

## Reader functions

Functions created to read each mark down line and resolve the type of the line.

### `readMarkdown`

Generator function that splits the Markdown into lines split on `\n`, for each line, it will get the type of content for the line and use the appropriate reader for that line.

### `readParagraph`

### `readSection`

## Helper functions

Additional functions, used as helpers for the reader functions.

### `getContentType`

Get the type of the content for the line being read. See [MarkdownContentType](./models/markdown-content-type.ts) for the different types.

> There are some content types that are not yet implemented. These are:
>
> - `'code-block'`
> - `'list'`
> - `'ordered-list'`
> - `'quote'`
> - `'code'`
> - `'horizontal-rule'`
> - `'image'`
> - `'link'`

### `getHeadingLevel`

Get the level of the heading for the line being read. This is used to determine if the section being read is a child of the current section, or should create a new section entirely.
