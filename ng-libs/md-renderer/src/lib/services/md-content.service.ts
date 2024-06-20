import { Injectable } from '@angular/core';
import { MarkdownContent } from '@peterjokumsen/ts-md-models';
import { WithId } from '../models';

@Injectable()
export class MdContentService {
  private _countById: Record<string, number> = {};

  private hasType(obj: object): obj is { type: string } {
    return 'type' in obj;
  }

  private hasTitle(obj: object): obj is { title: string } {
    return 'title' in obj;
  }

  addId<T extends object>(obj: T): WithId<T> {
    if ('id' in obj) return obj as T & { id: string };
    let id = 'id';
    let showZero = true;
    if (this.hasTitle(obj)) {
      id = obj.title?.toLowerCase().replace(/\W/g, '-');
      showZero = false;
    }

    if (this.hasType(obj)) {
      id = obj.type;
    }

    const count = this._countById[id] ?? 0;
    this._countById[id] = count + 1;
    if (count > 0 || showZero) {
      id += `_${count}`;
    }

    return Object.assign(obj, { id });
  }

  mapContent(value: string | MarkdownContent): WithId<MarkdownContent> {
    return this.addId(
      typeof value === 'string' ? { type: 'text', content: value } : value,
    );
  }
}
