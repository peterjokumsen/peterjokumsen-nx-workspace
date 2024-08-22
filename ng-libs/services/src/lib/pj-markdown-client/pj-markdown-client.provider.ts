import { PjMarkdownClient } from './pj-markdown-client.service';
import { Provider } from '@angular/core';
import { MarkdownParserService } from './services';

export function providePjMarkdownClient(): Provider[] {
  return [
    // keep split
    MarkdownParserService,
    PjMarkdownClient,
  ];
}
