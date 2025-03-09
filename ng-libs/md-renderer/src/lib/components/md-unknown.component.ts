import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';

import { HasContentBase } from '../has-content';
import { PjLogger } from '@peterjokumsen/ng-services';
import { logUnexpectedContent } from '../fns';

@Component({
  selector: 'pj-mdr-md-unknown',
  template: `
    <div class="md-unknown">
      <p>Unknown content type: {{ contentType }}</p>
      <p>See console for details...</p>
    </div>
  `,
  styles: `
    code {
      white-space: pre-wrap;
    }

    .md-unknown {
      background-color: #ff0000;
      color: #ffffff;
      padding: 1rem;
      font-size: 1.2rem;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class MdUnknownComponent implements HasContentBase, OnInit {
  private _logger = inject(PjLogger, { optional: true });

  @Input() content: HasContentBase['content'] = '';

  get contentType(): string {
    if (typeof this.content === 'string') {
      return 'string';
    } else if ('type' in this.content) {
      return this.content.type;
    } else {
      return 'unknown';
    }
  }

  ngOnInit() {
    logUnexpectedContent('MdUnknownComponent', this.content, this._logger?.to);
  }
}
