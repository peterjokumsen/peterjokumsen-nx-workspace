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
  selector: 'pj-mdr-md-code-block',
  template: `
    @if (lines()) {
      <pre><code class="{{ language() }}">{{ lines() }}</code></pre>
    }
  `,
  styles: `
    :host {
      display: block;
      padding: 1rem;
      border-radius: 5px;
      border: 1px solid var(--primary-color);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdCodeBlockComponent implements HasContent<'code-block'> {
  private _logger = inject(PjLogger, { optional: true });

  language = signal<string>('');
  lines = signal<string | null>(null);

  set content(value: HasContent<'code-block'>['content']) {
    let nextLines: string | null = null;
    let language = '';
    if (typeof value === 'string' || !mdModelCheck('code-block', value)) {
      logUnexpectedContent('MdCodeBlockComponent', value, this._logger?.to);
    } else {
      nextLines = value.lines.join('\n');
      language = value.language as string;
    }

    this.language.update(() => language);
    this.lines.update(() => nextLines);
  }
}
