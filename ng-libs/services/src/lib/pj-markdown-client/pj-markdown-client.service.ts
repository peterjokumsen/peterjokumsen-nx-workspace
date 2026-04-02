import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, tap } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { MarkdownAst } from '@peterjokumsen/ts-md-models';
import { MarkdownParserService } from './services';

@Injectable()
export class PjMarkdownClient {
  private _http = inject(HttpClient);
  private _markdownParserService = inject(MarkdownParserService);

  readMarkdown(url: string): Observable<MarkdownAst> {
    const basePath = url.split('/').slice(0, -1).join('/');
    return this._http.get(url, { responseType: 'text' }).pipe(
      tap((markdownContent) => {
        if (markdownContent.startsWith('<!DOCTYPE html>')) {
          throw new Error(`Could not read markdown for path: ${url}`);
        }
      }),
      map((markdownContent) =>
        this._markdownParserService.parse({ markdownContent, basePath }),
      ),
    );
  }

  /**
   * Resolves a markdown file by trying the path directly (with .md)
   * and falling back to a README.md in a directory of the same name.
   */
  resolveMarkdown(
    path: string,
  ): Observable<{ ast: MarkdownAst; resolvedPath: string }> {
    const assetsPath = `assets/docs/${path.replace(/__/g, '/')}`;
    const mdPath = assetsPath.endsWith('.md') ? assetsPath : `${assetsPath}.md`;
    const readmePath = `${assetsPath}/README.md`;

    return this.readMarkdown(mdPath).pipe(
      map((ast) => ({ ast, resolvedPath: mdPath })),
      catchError(() => {
        return this.readMarkdown(readmePath).pipe(
          map((ast) => ({ ast, resolvedPath: readmePath })),
        );
      }),
    );
  }
}
