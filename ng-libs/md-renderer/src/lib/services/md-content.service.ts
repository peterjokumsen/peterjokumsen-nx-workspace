import { Injectable } from '@angular/core';
import { MarkdownContent } from '@peterjokumsen/ts-md-models';
import { WithId } from '../models';

@Injectable()
export class MdContentService {
  private _count = 0;

  addId<T extends object>(obj: T): WithId<T> {
    if ('id' in obj) return obj as T & { id: string };
    return Object.assign(obj, { id: `id_${this._count++}` });
  }

  mapContent(value: string | MarkdownContent): WithId<MarkdownContent> {
    return this.addId(
      typeof value === 'string' ? { type: 'text', content: value } : value,
    );
  }
}
