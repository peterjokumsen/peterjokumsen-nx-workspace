import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { MarkdownMetaData } from '@peterjokumsen/ts-md-models';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private _title = inject(Title);
  private _meta = inject(Meta);

  updateFromMarkdown(meta: Partial<MarkdownMetaData>) {
    if (meta.title) {
      this._title.setTitle(`${meta.title} | Peter Jokumsen`);
    }

    if (meta.description) {
      this._meta.updateTag({ name: 'description', content: meta.description });
      this._meta.updateTag({
        property: 'og:description',
        content: meta.description,
      });
    }

    if (meta.image) {
      this._meta.updateTag({ property: 'og:image', content: meta.image });
    }
  }
}
