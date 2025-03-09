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
  selector: 'pj-mdr-md-commented',
  template: `
    <!-- could possibly display comments here, for now ignoring it -->
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class MdCommentedComponent implements HasContent<'commented'> {
  private _logger = inject(PjLogger, { optional: true });

  commentLines = signal<string[]>([]);

  set content(value: HasContent<'commented'>['content']) {
    if (typeof value === 'string' || value.type !== 'commented') {
      logUnexpectedContent('MdCodeComponent', value, this._logger?.to);

      this.commentLines.update(() => []);
      return;
    }

    this.commentLines.update(() => value.lines);
  }
}
