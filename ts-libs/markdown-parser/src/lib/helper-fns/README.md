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
> - `'code'`
> - `'horizontal-rule'`
> - `'image'`
> - `'link'`

## `getHeaderLevel`

Get the level of the heading for the line being read. This is used to determine if the section being read is a child of the current section, or should create a new section entirely.

**Usage**

```typescript
const headingLevel = getHeadingLevel(line);
```
