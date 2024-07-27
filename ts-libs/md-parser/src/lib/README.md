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
{
  "sections": [
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
}
```

## Internal functions

While there is only 1 exported function in this library, there are a few internal functions that are used to parse the markdown text.

## Reader functions

Functions created to read each mark down line and resolve the type of the line.

For additional information, see [reader-fns](./reader-fns/README.md).

## Helper functions

Additional functions, used as helpers for the reader functions.

For additional information, see [helper-fns](./helper-fns/README.md).
