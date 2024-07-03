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
  selector: 'pj-mdr-md-horizontal-rule',
  template: `
    @if (showRule()) {
      <hr />
    }
  `,
  styles: `
    hr {
      margin-top: 15px;
      padding: 15px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdHorizontalRuleComponent
  implements HasContent<'horizontal-rule'>
{
  private _logger = inject(PjLogger, { optional: true });

  showRule = signal<boolean>(false);

  set content(value: HasContent<'horizontal-rule'>['content']) {
    const correctType =
      typeof value !== 'string' && value.type === 'horizontal-rule';
    if (!correctType) {
      logUnexpectedContent(
        'MdHorizontalRuleComponent',
        value,
        this._logger?.to,
      );
    }

    this.showRule.update(() => correctType);
  }
}
