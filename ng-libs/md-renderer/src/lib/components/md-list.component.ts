import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import { ExpectedContentTypes } from '../filter-content-types';
import { HasContent } from '../has-content';
import { MarkdownType } from '@peterjokumsen/ts-md-models';
import { MdContentService } from '../services';
import { PjLogger } from '@peterjokumsen/ng-services';
import { WithId } from '../models';
import { filterContentTypes } from '../filter-content-types';

@Component({
  selector: 'pj-mdr-md-list',
  template: `
    <ul id="{{ list().id }}">
      <li *ngFor="let item of items()">
        <pj-mdr-md-wrapper [pjMdrMdContentInjection]="item"></pj-mdr-md-wrapper>
      </li>
    </ul>
  `,
  styles: `
    ul {
      list-style-type: disc;
      margin: 1em 0;
      padding: 0 0 0 2em;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdListComponent implements HasContent<'list'> {
  private _logger = inject(PjLogger, { optional: true });
  private _mdContent = inject(MdContentService);

  list = signal<WithId<MarkdownType<'list'>>>({
    type: 'list',
    id: '',
    items: [],
    indent: 0,
  });
  items = computed<WithId<MarkdownType<ExpectedContentTypes>>[]>(() => {
    const list = this.list();
    return filterContentTypes(list.items).map((c) =>
      this._mdContent.mapContent(c),
    );
  });

  set content(value: HasContent<'list'>['content']) {
    if (typeof value === 'string') {
      this._logger?.to.warn(
        'MdListComponent received string content, expected MarkdownContent',
      );
    } else {
      this.list.update(
        () => this._mdContent.mapContent(value) as WithId<MarkdownType<'list'>>,
      );
    }
  }
}
