import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import { CodeHighlightService } from '../services';
import { HasContent } from '../has-content';
import { PjLogger } from '@peterjokumsen/ng-services';
import { logUnexpectedContent } from '../fns';
import { mdModelCheck } from '@peterjokumsen/ts-md-models';

@Component({
  selector: 'pj-mdr-md-code-block',
  template: `
    @if (lines()) {
      <pre><code [innerHTML]="highlightedCode()"></code></pre>
    }
  `,
  styles: `
    :host {
      display: block;
      padding: 1rem;
      margin-bottom: 1.5rem;
      border-radius: 5px;
      border: 1px solid;
      overflow-x: auto;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdCodeBlockComponent implements HasContent<'code-block'> {
  private _logger = inject(PjLogger, { optional: true });
  private _highlightService = inject(CodeHighlightService);

  private _highlightedCode = computed(() => {
    return this._highlightService.highlight(
      this.lines() ?? '',
      this.language(),
    );
  });

  language = signal<string>('');
  lines = signal<string | null>(null);
  highlightedCode = computed(() => {
    return this._highlightedCode().htmlCode;
  });

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
