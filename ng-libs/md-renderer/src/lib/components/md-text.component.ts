import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import { HasContent } from '../has-content';
import { PjLogger } from '@peterjokumsen/ng-services';
import { logUnexpectedContent } from '../fns';
import { mdModelCheck } from '@peterjokumsen/ts-md-models';

@Component({
  selector: 'pj-mdr-md-text',
  template: `
    @if (textValue()) {
      <ng-container>{{ textValue() }}</ng-container>
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
    if (typeof value == 'string') {
      newContent = value;
    } else if (mdModelCheck('text', value)) {
      newContent = value.content;
    } else {
      logUnexpectedContent('MdTextComponent', value, this._logger?.to);
    }

    this.textValue.update(() => newContent);
  }
}
