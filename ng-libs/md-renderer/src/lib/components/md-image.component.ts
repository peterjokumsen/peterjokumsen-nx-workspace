import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MarkdownContent, mdModelCheck } from '@peterjokumsen/ts-md-models';

import { HasContent } from '../has-content';
import { PjLogger } from '@peterjokumsen/ng-services';
import { WithId } from '../models';

@Component({
  selector: 'pj-mdr-md-image',
  template: `
    @if (src) {
      <img [src]="src" [alt]="alt" />
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdImageComponent implements HasContent {
  private _logger = inject(PjLogger, { optional: true });

  alt = '';
  src = '';

  set content(value: string | MarkdownContent | WithId<MarkdownContent>) {
    if (typeof value === 'string') {
      this._logger?.to.warn(
        'String content not supported for image component, received "%s"',
        value,
      );
      return;
    }

    if (mdModelCheck('image', value)) {
      this.alt = value.alt;
      this.src = value.src;
    } else {
      this._logger?.to.warn(
        'Non-image content passed to image component, received %o',
        value,
      );
    }
  }
}
