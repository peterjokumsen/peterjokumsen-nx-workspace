import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MarkdownType, mdModelCheck } from '@peterjokumsen/ts-md-models';

import { HasContent } from '../has-content';
import { PjLogger } from '@peterjokumsen/ng-services';
import { logUnexpectedContent } from '../fns';

@Component({
  selector: 'pj-mdr-md-image',
  template: `
    @if (imageValue()) {
      <img [src]="imageValue()?.src" [alt]="imageValue()?.alt" />
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class MdImageComponent implements HasContent<'image'> {
  private _logger = inject(PjLogger, { optional: true });

  imageValue = signal<MarkdownType<'image'> | null>(null);

  set content(value: HasContent<'image'>['content']) {
    let newImage: MarkdownType<'image'> | null = null;
    if (typeof value !== 'string' && mdModelCheck('image', value)) {
      newImage = value;
    } else {
      logUnexpectedContent('MdImageComponent', value, this._logger?.to);
    }

    this.imageValue.update(() => newImage);
  }
}
