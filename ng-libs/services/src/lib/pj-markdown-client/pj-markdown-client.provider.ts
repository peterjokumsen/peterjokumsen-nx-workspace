import { MarkdownParserService } from './services';
import { PjMarkdownClient } from './pj-markdown-client.service';
import { Provider } from '@angular/core';

export function providePjMarkdownClient(): Provider[] {
  return [
    // keep split
    MarkdownParserService,
    PjMarkdownClient,
  ];
}
