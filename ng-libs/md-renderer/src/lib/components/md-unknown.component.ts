import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';

import { HasContent } from '../has-content';
import { MarkdownContent } from '@peterjokumsen/ts-md-models';
import { PjLogger } from '@peterjokumsen/ng-services';
import { WithId } from '../models';

@Component({
  selector: 'pj-mdr-md-unknown',
  template: `
    <div class="unknown">
      <p>Unknown content type: {{ contentType }}</p>
      <p>See console for details...</p>
    </div>
  `,
  styles: `
    code {
      white-space: pre-wrap;
    }

    .unknown {
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
})
export class MdUnknownComponent implements HasContent, OnInit {
  private _logger = inject(PjLogger, { optional: true });

  @Input() content: string | WithId<MarkdownContent> | MarkdownContent = '';

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
    this._logger?.to.warn('Unknown content type: %o', this.content);
  }
}
