# md-renderer

This library was generated with [Nx](https://nx.dev).

## Purpose

This library is a simple markdown renderer that uses AST based on [`@peterjokumsen/ts-md-models`](../../ts-libs/ts-md-models/README.md), and renders it to HTML.

## Usage

```typescript
import { MdRendererComponent } from '@peterjokumsen/md-renderer';

@Component({
  selector: 'app-something',
  standalone: true,
  imports: [MdRendererComponent],
  template: `
    <pj-mdr-md-renderer [content]="md"></pj-mdr-md-renderer>
  `,
})
```

## Running unit tests

Run `nx test md-renderer` to execute the unit tests.
