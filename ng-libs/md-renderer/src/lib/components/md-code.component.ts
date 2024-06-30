import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import { HasContent } from '../has-content';
import { PjLogger } from '@peterjokumsen/ng-services';

@Component({
  selector: 'pj-mdr-md-code',
  template: `
    @if (elementValue()) {
      <span class="md-code">{{ elementValue() }}</span>
    }
  `,
  styles: `
    :host {
      padding: 5px;
      border-radius: 5px;
      font-family: monospace, monospace;
      border: 1px solid;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdCodeComponent implements HasContent<'code'> {
  private _logger = inject(PjLogger, { optional: true });

  elementValue = signal('');

  set content(value: HasContent<'code'>['content']) {
    if (typeof value === 'string' || value.type !== 'code') {
      this._logger?.to.warn(
        'Invalid content for MdCodeComponent, received %o',
        value,
      );

      this.elementValue.update(() => '');
      return;
    }

    this.elementValue.update(() => value.element);
  }
}
