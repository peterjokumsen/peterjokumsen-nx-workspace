import { Provider } from '@angular/core';
import { PjMarkdownClient } from './pj-markdown-client.service';
import {
  DocsIndexService,
  MarkdownParserService,
  SeoService,
} from './services';

export function providePjMarkdownClient(): Provider[] {
  return [
    // keep split
    DocsIndexService,
    MarkdownParserService,
    SeoService,
    PjMarkdownClient,
  ];
}
