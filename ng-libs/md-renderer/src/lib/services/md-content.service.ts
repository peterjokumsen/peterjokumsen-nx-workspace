import { MarkdownContentType, MarkdownType } from '@peterjokumsen/ts-md-models';

import { Injectable } from '@angular/core';
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

  addId<T extends MarkdownContentType>(
    obj: MarkdownType<T> | WithId<MarkdownType<T>>,
  ): WithId<MarkdownType<T>> {
    if ('id' in obj) return obj;

    let id = 'id';
    let showZero = true;
    if (this.hasTitle(obj)) {
      id = obj.title?.toLowerCase().replace(/\W/g, '-');
      showZero = false;
    } else if (this.hasType(obj)) {
      id = obj.type;
    }

    const count = this._countById[id] ?? 0;
    this._countById[id] = count + 1;
    if (count > 0 || showZero) {
      id += `_${count}`;
    }

    return Object.assign(obj, { id });
  }

  mapContent<T extends MarkdownContentType>(
    value: string | MarkdownType<T>,
  ): WithId<MarkdownType<'text'>> | WithId<MarkdownType<T>> {
    if (typeof value === 'string') {
      return this.addId({ type: 'text', content: value });
    }

    return this.addId(value);
  }
}
