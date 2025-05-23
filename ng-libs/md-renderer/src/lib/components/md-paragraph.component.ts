import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import { PjLogger } from '@peterjokumsen/ng-services';
import { MarkdownType } from '@peterjokumsen/ts-md-models';
import { ExpectedContentTypes } from '../filter-content-types';
import { logUnexpectedContent } from '../fns';
import { HasContent } from '../has-content';
import { WithId } from '../models';
import { MdContentService } from '../services';

@Component({
  selector: 'pj-mdr-md-paragraph',
  template: `
    <p class="md-paragraph">
      @for (mdContent of contents(); track mdContent.id) {
        <pj-mdr-md-wrapper [pjMdrMdContentInjection]="mdContent" />
      }
    </p>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class MdParagraphComponent implements HasContent<ExpectedContentTypes> {
  private _logger = inject(PjLogger, { optional: true });
  private _mdContent = inject(MdContentService);

  contents = signal<WithId<MarkdownType<ExpectedContentTypes>>[]>([]);

  set content(value: HasContent<ExpectedContentTypes>['content']) {
    let contents: MarkdownType<ExpectedContentTypes>[] = [];
    if (typeof value === 'string') {
      contents = [{ type: 'text', content: value }];
    } else {
      switch (value.type) {
        case 'text':
        case 'image':
        case 'link':
          contents = [value];
          break;
        case 'paragraph':
          if (Array.isArray(value.content)) {
            contents = value.content as MarkdownType<ExpectedContentTypes>[];
          } else {
            contents = [{ type: 'text', content: value.content }];
          }
          break;
        default:
          logUnexpectedContent('MdParagraphComponent', value, this._logger?.to);
          break;
      }
    }

    this.contents.update(() =>
      contents.map((c) => this._mdContent.mapContent(c)),
    );
  }
}
