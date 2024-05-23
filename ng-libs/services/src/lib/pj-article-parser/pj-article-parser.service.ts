import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PjArticle, PjArticleContent } from './models';

import { PjLogger } from '../pj-logger';

@Injectable()
export class PjArticleParser {
  private _logger = inject(PjLogger, { optional: true });

  fromSource(source: string): Observable<PjArticle> {
    this._logger?.to.group('PJ Article Parser');
    const parsedResult: PjArticle = {
      sections: [],
    };
    let content: PjArticleContent = [];
    for (const rawLine of source.split('\n').reverse()) {
      const line = rawLine?.trimStart();
      this._logger?.to.log('rawLine: "%s"', rawLine);
      this._logger?.to.log('line: "%s"', line);
      if (line.startsWith('# ')) {
        parsedResult.title = line.replace('# ', '');
        parsedResult.introduction = [...content.reverse()];
        parsedResult.sections.reverse();
        this._logger?.to.log('found title: %s', parsedResult.title);
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

    this._logger?.to.log('parseResult: %o', parsedResult);
    this._logger?.to.groupEnd();
    return of(parsedResult);
  }
}
