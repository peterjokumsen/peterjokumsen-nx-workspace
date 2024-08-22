import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { MarkdownAst } from '@peterjokumsen/ts-md-models';
import { MarkdownParserService } from './services';

@Injectable()
export class PjMarkdownClient {
  private _http = inject(HttpClient);
  private _markdownParserService = inject(MarkdownParserService);

  readMarkdown(url: string): Observable<MarkdownAst> {
    const basePath = url.split('/').slice(0, -1).join('/');
    return this._http
      .get(url, { responseType: 'text' })
      .pipe(
        map((markdownContent) =>
          this._markdownParserService.parse({ markdownContent, basePath }),
        ),
      );
  }
}
