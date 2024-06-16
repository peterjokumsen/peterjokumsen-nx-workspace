# ts-md-models

This library was generated with [Nx](https://nx.dev).

## Purpose

This project is a collection of TypeScript models for [Markdown Parser](../md-parser/README.md). Meant as a shared library for the Markdown Parser and other projects that need to work with Markdown ASTs, without needing to include `Markdown Parser` directly.

## Function

A utility function has been exported from this library to allow checking if a given object is a Markdown AST node and refine its type to the specific type requested.

```typescript
import { MarkdownContent, mdModelCheck } from '@peterjokumsen/ts-md-models';

const content: MarkdownContent = { type: 'code-block', content: ['line'] };

if (mdModelCheck('code-block', content)) {
  // content is now refined to MarkdownCodeBlock
  console.log(content.content); // ['line']
}
```

## Building

Run `nx build ts-md-models` to build the library.

## Running unit tests

Run `nx test ts-md-models` to execute the unit tests via [Jest](https://jestjs.io).
