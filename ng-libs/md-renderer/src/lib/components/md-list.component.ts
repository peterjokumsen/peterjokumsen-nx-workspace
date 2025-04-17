import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MarkdownType, mdModelCheck } from '@peterjokumsen/ts-md-models';

import { PjLogger } from '@peterjokumsen/ng-services';
import {
  ExpectedContentTypes,
  filterContentTypes,
} from '../filter-content-types';
import { logUnexpectedContent } from '../fns';
import { HasContent } from '../has-content';
import { WithId } from '../models';
import { MdContentService } from '../services';

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
  standalone: false,
})
export class MdListComponent implements HasContent<'list'> {
  private readonly _defaultList: WithId<MarkdownType<'list'>> = {
    type: 'list',
    id: '',
    items: [],
    indent: 0,
  };

  private _logger = inject(PjLogger, { optional: true });
  private _mdContent = inject(MdContentService);

  list = signal<WithId<MarkdownType<'list'>>>(this._defaultList);
  items = computed<WithId<MarkdownType<ExpectedContentTypes>>[]>(() => {
    const list = this.list();
    return filterContentTypes(list.items).map((c) =>
      this._mdContent.mapContent(c),
    );
  });

  set content(value: HasContent<'list'>['content']) {
    let newList = this._defaultList;
    if (typeof value !== 'string' && mdModelCheck('list', value)) {
      newList = this._mdContent.addId(value);
    } else {
      logUnexpectedContent('MdListComponent', value, this._logger?.to);
    }

    this.list.update(() => newList);
  }
}
