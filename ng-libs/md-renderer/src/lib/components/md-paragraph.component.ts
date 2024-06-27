import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import { ExpectedContentTypes } from '../expected-content-types';
import { HasContent } from '../has-content';
import { MarkdownType } from '@peterjokumsen/ts-md-models';
import { MdContentService } from '../services';
import { PjLogger } from '@peterjokumsen/ng-services';
import { WithId } from '../models';

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
})
export class MdParagraphComponent implements HasContent<ExpectedContentTypes> {
  private _logger = inject(PjLogger, { optional: true });
  private _mdContent = inject(MdContentService);

  contents = signal<WithId<MarkdownType<ExpectedContentTypes>>[]>([]);

  set content(value: HasContent<ExpectedContentTypes>['content']) {
    let contents: MarkdownType<ExpectedContentTypes>[];
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
          this._logger?.to.warn('Unknown content, object: %o', value);
          break;
      }
    }

    this.contents.update(() =>
      contents.map((c) => this._mdContent.mapContent(c)),
    );
  }
}
