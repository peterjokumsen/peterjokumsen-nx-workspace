import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import { HasContent } from '../has-content';
import { MarkdownContent } from '@peterjokumsen/ts-md-models';
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
export class MdParagraphComponent implements HasContent {
  private _logger = inject(PjLogger, { optional: true });
  private _mdContent = inject(MdContentService);

  contents = signal<WithId<MarkdownContent>[]>([]);

  set content(value: string | MarkdownContent | WithId<MarkdownContent>) {
    let contents: MarkdownContent[];
    if (typeof value === 'string') {
      contents = [{ type: 'text', content: value }];
    } else {
      switch (value.type) {
        case 'text':
        case 'image':
        case 'link':
        case 'code':
        case 'horizontal-rule':
          contents = [value];
          break;
        case 'paragraph':
          if (Array.isArray(value.content)) {
            contents = value.content;
          } else {
            contents = [{ type: 'text', content: value.content }];
          }
          break;
        default:
          this._logger?.to.warn(
            'Unknown content type: "%s", object: %o',
            value.type,
            value,
          );
          break;
      }
    }

    this.contents.update(() =>
      contents.map((c) => this._mdContent.mapContent(c)),
    );
  }
}
