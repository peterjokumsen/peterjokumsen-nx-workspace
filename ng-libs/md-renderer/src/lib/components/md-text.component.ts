import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MarkdownContent, mdModelCheck } from '@peterjokumsen/ts-md-models';

import { HasContent } from '../has-content';
import { PjLogger } from '@peterjokumsen/ng-services';
import { WithId } from '../models';

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
export class MdTextComponent implements HasContent {
  private _logger = inject(PjLogger, { optional: true });
  textValue = signal<string | null>(null);

  set content(value: string | MarkdownContent | WithId<MarkdownContent>) {
    let newContent: string | null = null;
    if (typeof value === 'string') {
      newContent = value;
    } else if (mdModelCheck('text', value)) {
      newContent = value.content;
    } else {
      this._logger?.to.warn(
        'Invalid content type "%s" for MdTextComponent, received %o',
        value.type,
        value,
      );
    }

    this.textValue.update(() => newContent);
  }
}
