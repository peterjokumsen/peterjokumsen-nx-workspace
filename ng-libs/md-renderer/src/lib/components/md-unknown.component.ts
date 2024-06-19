import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HasContent } from '../has-content';
import { MarkdownContent } from '@peterjokumsen/ts-md-models';
import { WithId } from '../models';

@Component({
  selector: 'pj-mdr-md-unknown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="unknown">
      <p>Unknown content type: {{ contentType }}</p>
      <pre>{{ content | json }}</pre>
    </div>
  `,
  styles: `
    .unknown {
      background-color: #ff0000;
      color: #ffffff;
      padding: 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdUnknownComponent implements HasContent {
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
}
