import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MarkdownType, mdModelCheck } from '@peterjokumsen/ts-md-models';

import { HasContent } from '../has-content';
import { PjLogger } from '@peterjokumsen/ng-services';

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
export class MdImageComponent implements HasContent<'image'> {
  private _logger = inject(PjLogger, { optional: true });

  imageValue = signal<MarkdownType<'image'> | null>(null);

  set content(value: HasContent<'image'>['content']) {
    let newImage: MarkdownType<'image'> | null = null;
    if (typeof value === 'string') {
      this._logger?.to.warn(
        'String content not supported for MdImageComponent, received "%s"',
        value,
      );
    } else if (mdModelCheck('image', value)) {
      newImage = value;
    } else {
      this._logger?.to.warn(
        'Invalid content for MdImageComponent, received %o',
        value,
      );
    }

    this.imageValue.update(() => newImage);
  }
}
