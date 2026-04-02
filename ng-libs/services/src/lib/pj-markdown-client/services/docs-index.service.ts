import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

export interface DocIndexEntry {
  path: string;
  title: string;
  description?: string;
  image?: string;
  tags?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class DocsIndexService {
  private _http = inject(HttpClient);
  private _index$ = this._http
    .get<DocIndexEntry[]>('assets/docs-index.json')
    .pipe(shareReplay(1));

  getIndex(): Observable<DocIndexEntry[]> {
    return this._index$.pipe(
      map((entries) =>
        entries.map(({ path, ...rest }) => ({
          path: `articles/${path.replace(/\//g, '__')}`,
          ...rest,
        })),
      ),
    );
  }
}
