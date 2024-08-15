import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MarkdownType, mdModelCheck } from '@peterjokumsen/ts-md-models';

import { HasContent } from '../has-content';
import { MdContentService } from '../services';
import { PjLogger } from '@peterjokumsen/ng-services';
import { WithId } from '../models';
import { logUnexpectedContent } from '../fns';

type MdParagraph = WithId<MarkdownType<'paragraph' | 'horizontal-rule'>>;

@Component({
  selector: 'pj-mdr-md-quote-block',
  template: `
    @for (paragraph of paragraphs(); track paragraph.id) {
      <pj-mdr-md-wrapper
        [pjMdrMdContentInjection]="paragraph"
      ></pj-mdr-md-wrapper>
    }
  `,
  styles: `
    :host {
      display: block;
      padding: 1rem 0 0.2rem 1.5rem;
      border-left: 1px solid;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdQuoteBlockComponent implements HasContent<'quote'> {
  private _logger = inject(PjLogger, { optional: true });
  private _mdContent = inject(MdContentService);

  paragraphs = signal<MdParagraph[]>([]);

  set content(value: HasContent<'quote'>['content']) {
    let nextParagraphs: MdParagraph[] = [];
    if (typeof value === 'string' || !mdModelCheck('quote', value)) {
      logUnexpectedContent('MdQuoteBlockComponent', value, this._logger?.to);
    } else {
      nextParagraphs = value.paragraphs.map((p) => this._mdContent.addId(p));
    }

    this.paragraphs.update(() => nextParagraphs);
  }
}
