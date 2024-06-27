import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import { HasContent } from '../has-content';
import { PjLogger } from '@peterjokumsen/ng-services';
import { mdModelCheck } from '@peterjokumsen/ts-md-models';

@Component({
  selector: 'pj-mdr-md-text',
  template: `
    @if (textValue()) {
      {{ textValue() }}
    }
  `,
  styles: `
    :host {
      display: inline;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdTextComponent implements HasContent<'text'> {
  private _logger = inject(PjLogger, { optional: true });
  textValue = signal<string | null>(null);

  set content(value: HasContent<'text'>['content']) {
    let newContent: string | null = null;
    if (typeof value === 'string') {
      newContent = value;
    } else if (mdModelCheck('text', value)) {
      newContent = value.content;
    } else {
      this._logger?.to.error(
        'Invalid content for MdTextComponent, received %o',
        value,
      );
    }

    this.textValue.update(() => newContent);
  }
}
