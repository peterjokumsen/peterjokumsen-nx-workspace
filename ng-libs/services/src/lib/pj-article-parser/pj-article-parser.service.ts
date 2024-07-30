import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';

import { MarkdownAst } from '@peterjokumsen/ts-md-models';
import { PjLogger } from '../pj-logger';
import { parseMarkdown } from '@peterjokumsen/md-parser';

@Injectable()
export class PjArticleParser {
  private _logger = inject(PjLogger, { optional: true });

  fromSource(markdown: string): Observable<MarkdownAst> {
    return of(parseMarkdown(markdown));
  }
}
