import { Provider } from '@angular/core';
import { PjMarkdownClient } from './pj-markdown-client.service';
import { MarkdownParserService, SeoService } from './services';

export function providePjMarkdownClient(): Provider[] {
  return [
    // keep split
    MarkdownParserService,
    SeoService,
    PjMarkdownClient,
  ];
}
