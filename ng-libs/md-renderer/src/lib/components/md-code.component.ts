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
      <code class="primary-colors">{{ elementValue() }}</code>
    }
  `,
  styles: `
    code {
      display: inline-block;
      padding: 1px 4px;
      border-radius: 4px;
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
