# reader-fns

Functions created to read each mark down line and resolve the type of the line.

## `readMarkdown`

Generator function that splits the Markdown into lines split on `\n`, for each line, it will get the type of content for the line and use the appropriate reader for that line.

**Usage**

```typescript
const markdown = readMarkdown(`
# Hello, world!

This is a paragraph of text.

## Subheading

This is another paragraph of text.
`);

/* result (markdown):
{
  type: 'section',
  title: 'Hello, world!',
  content: [
    {
      type: 'paragraph',
      content: 'This is a paragraph of text.'
    },
    {
      type: 'section',
      title: 'Subheading',
      content: [
        {
          type: 'paragraph',
          content: 'This is another paragraph of text.'
        }
      ]
    }
  ]
}
*/
```

## Utility reader functions

Functions to use when the content type is known. All functions conform to `ReadContentFn`, e.g.

```typescript
type ReadContentFn = (markdown: string[], startIndex: number) => ReadResult;
```

Which is a function that takes a string array, representing the Markdown, and the starting index for the reader to start on. It will return `ReadResult`, e.g.

```typescript
interface ReadResult {
  content: string | MarkdownContent[];
  startIndex: number;
}
```

`content` is the content that was read, and `startIndex` is the index in the Markdown array where the calling reader should continue reading the next content.

### `contentReaders`

Object containing all the reader functions. The keys are the content types, and the values are the reader functions.

**Usage**

```typescript
import { contentReaders } from './content-readers';

function readEverything(lines: string[]): MarkdownContent[] {
  let result: MarkdownContent[] = [];
  for (let i = 0; i < lines.length; i++) {
    var type = getContentType(lines[i]);
    const { content, startIndex } = contentReaders[type](lines, i);
    result.push(content);
    i = startIndex;
  }

  return result;
}
```

### `readParagraph`

Function to use when the content type is `'paragraph'`.

**Usage**

```typescript
const { content, startIndex } = readParagraph(lines, 1);
```

### `readSection`

Function to use when the content type is `'section'`.
Will take the starting line as the title of the section, push the lines until the next section or the end of the Markdown as the content of the section, and return the section.

When a line being read is of type `'section'`, will check the header level Using [getHeaderLevel](../helper-fns/README.md#getheaderlevel), and if the header level is greater than the current header level, will recursively call `readSection` to get the child section. And if the header level is less than or equal to the current header level, will return the section, with a start index that should get the calling function to read the new section.

### `matchRichContent`

Function to use to return matches found by the tag passed in. The provided `matched` property should be swapped outh with a token to symbolize the content.

**Usage**

```typescript
for (const { content, matched } of matchRichContent('link', '[hello](/world)')) {
  // content = { type: 'link', alt: 'hello', href: '/world' }
  // matched = '[hello](/world)'
|
```
