# Helper functions

Additional functions, used as helpers for the reader functions.

## `getContentType`

Get the type of the content for the line being read. See [MarkdownContentType](../models/markdown-content-type.ts) for the different types.

**Usage**

```typescript
const type = getContentType(line);
```

> There are some content types that are not yet implemented. These are:
>
> - `'code-block'`
> - `'list'`
> - `'ordered-list'`
> - `'quote'`
> - `'horizontal-rule'`

## `getHeaderLevel`

Get the level of the heading for the line being read. This is used to determine if the section being read is a child of the current section, or should create a new section entirely.

**Usage**

```typescript
const headingLevel = getHeaderLevel(line);
```

## `lineHas`

Check if the line contains `tag` passed in.

### Supported tags

- `'image'`
- `'link'`
- `'code'` **(Not yet implemented)**

**Usage**

```typescript
const containsImageTag = lineHas('image', line);
```

## `splitRichContent`

Used to split tokenized string into rich content and plain text. Will use the passed in mapping to resolve token into content, and any other strings will be turned into plain text content.

**Usage**

```typescript
const content = splitRichContent('H*ll-', {
  '*': { src: '/world', content: 'e', type: 'image' },
  '-': { type: 'link', alt: 'o', href: '/hello' },
});

// content = [
//   { type: 'text', content: 'H' },
//   { type: 'image', src: '/world', content: 'e' },
//   { type: 'text', content: 'l' },
//   { type: 'text', content: 'l' },
//   { type: 'link', alt: 'o', href: '/hello' },
// ];
```

## Regex Utilities

### `regexPatterns`

Map of regex patterns by type. Used to match content in the line being read.

### `regexContentFns`

Map of functions that take in a match and return the content object for the match, including the matched string.
