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
