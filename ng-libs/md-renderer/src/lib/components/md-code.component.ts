import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import { HasContent } from '../has-content';
import { PjLogger } from '@peterjokumsen/ng-services';
import { logUnexpectedContent } from '../fns';

@Component({
  selector: 'pj-mdr-md-code',
  template: `
    @if (elementValue()) {
      <span class="md-code">{{ elementValue() }}</span>
    }
  `,
  styles: `
    :host {
      padding: 2px 5px;
      border-radius: 5px;
      font-family: monospace, monospace;
      border: 1px solid;
      display: inline-flex;
      align-items: center;
    }

    .md-code {
      font-size: 0.9rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdCodeComponent implements HasContent<'code'> {
  private _logger = inject(PjLogger, { optional: true });

  elementValue = signal('');

  set content(value: HasContent<'code'>['content']) {
    if (typeof value === 'string' || value.type !== 'code') {
      logUnexpectedContent('MdCodeComponent', value, this._logger?.to);

      this.elementValue.update(() => '');
      return;
    }

    this.elementValue.update(() => value.element);
  }
}
