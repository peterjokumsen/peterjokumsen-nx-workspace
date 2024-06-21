import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  MarkdownContent,
  MarkdownImage,
  mdModelCheck,
} from '@peterjokumsen/ts-md-models';

import { HasContent } from '../has-content';
import { PjLogger } from '@peterjokumsen/ng-services';
import { WithId } from '../models';

@Component({
  selector: 'pj-mdr-md-image',
  template: `
    @if (imageValue()) {
      <img [src]="imageValue()?.src" [alt]="imageValue()?.alt" />
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdImageComponent implements HasContent {
  private _logger = inject(PjLogger, { optional: true });

  imageValue = signal<MarkdownImage | null>(null);

  set content(value: string | MarkdownContent | WithId<MarkdownContent>) {
    let newImage: MarkdownImage | null = null;
    if (typeof value === 'string') {
      this._logger?.to.warn(
        'String content not supported for MdImageComponent, received "%s"',
        value,
      );
    } else if (mdModelCheck('image', value)) {
      newImage = value;
    } else {
      this._logger?.to.warn(
        'Invalid content type "%s" for MdImageComponent, received %o',
        value.type,
        value,
      );
    }

    this.imageValue.update(() => newImage);
  }
}
