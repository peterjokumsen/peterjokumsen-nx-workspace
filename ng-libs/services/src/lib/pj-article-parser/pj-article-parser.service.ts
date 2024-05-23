import { Observable, of } from 'rxjs';
import { PjArticle, PjArticleContent } from './models';

import { Injectable } from '@angular/core';

@Injectable()
export class PjArticleParser {
  fromSource(source: string): Observable<PjArticle> {
    const parsedResult: PjArticle = {
      sections: [],
    };
    let content: PjArticleContent = [];
    for (const line of source.split('\n').reverse()) {
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
        content = [];
      } else if (line.trim().length > 0) {
        content.push(line);
      }
    }

    return of(parsedResult);
  }
}
