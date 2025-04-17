import { Provider } from '@angular/core';
import { PjMarkdownClient } from './pj-markdown-client.service';
import { MarkdownParserService } from './services';

export function providePjMarkdownClient(): Provider[] {
  return [
    // keep split
    MarkdownParserService,
    PjMarkdownClient,
  ];
}
