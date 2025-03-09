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
      <span [class]="class()">{{ textValue() }}</span>
    }
  `,
  styles: `
    :host {
      display: inline;
    }

    .bold {
      font-weight: bold;
    }

    .italic {
      font-style: italic;
    }

    .strike-through {
      text-decoration: line-through;
    }

    .bold-italic {
      font-weight: bold;
      font-style: italic;
    }

    .line-break {
      white-space: pre-line;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class MdTextComponent implements HasContent<'text'> {
  private _logger = inject(PjLogger, { optional: true });
  textValue = signal<string | null>(null);
  class = signal<string>('');

  set content(value: HasContent<'text'>['content']) {
    let newContent: string | null = null;
    let classValue: string | null = null;
    if (typeof value == 'string') {
      newContent = value;
    } else if (mdModelCheck('text', value)) {
      newContent = value.content;
      classValue = value.format ?? '';
    } else {
      logUnexpectedContent('MdTextComponent', value, this._logger?.to);
    }

    this.textValue.update(() => newContent);
    this.class.update(() => classValue ?? '');
  }
}
