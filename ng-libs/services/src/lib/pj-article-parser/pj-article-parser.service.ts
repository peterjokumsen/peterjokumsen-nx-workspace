import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PjArticle, PjArticleContent } from './models';

import { PjLogger } from '../pj-logger';

@Injectable()
export class PjArticleParser {
  private _logger = inject(PjLogger, { optional: true });

  fromSource(source: string): Observable<PjArticle> {
    const parsedResult: PjArticle = {
      sections: [],
    };
    let content: PjArticleContent = [];
    for (const rawLine of source.split('\n').reverse()) {
      const line = rawLine?.trimStart();
      if (line.startsWith('# ')) {
        parsedResult.title = line.replace('# ', '');
        parsedResult.introduction = [...content.reverse()];
        parsedResult.sections.reverse();
        break;
      }

      if (line.startsWith('## ')) {
        parsedResult.sections.push({
          title: line.replace('## ', ''),
          content: [...content.reverse()],
        });
        this._logger?.to.log(
          'found section: %o',
          parsedResult.sections[parsedResult.sections.length - 1],
        );
        content = [];
        continue;
      }

      if (line.trim().length > 0) {
        content.push(line);
      }
    }

    return of(parsedResult);
  }
}
