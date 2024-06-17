import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MdImageComponent, MdLinkComponent, MdTextComponent } from './';

import { CommonModule } from '@angular/common';
import { MarkdownContent } from '@peterjokumsen/ts-md-models';
import { WithId } from '../../models';

@Component({
  selector: 'pj-mdr-md-rich-content',
  standalone: true,
  imports: [CommonModule, MdTextComponent, MdLinkComponent, MdImageComponent],
  template: `
    @for (element of elements(); track element.id) {
      @switch (element.type) {
        @case ('text') {
          <pj-mdr-md-text [content]="element" />
        }
        @case ('link') {
          <pj-mdr-md-link [content]="element" />
        }
        @case ('image') {
          <pj-mdr-md-image [content]="element" />
        }
        @default {
          <span>Unhandled type</span>
          <code>{{ element | json }}</code>
        }
      }
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdRichContentComponent {
  elements = input<WithId<MarkdownContent>[]>([]);
}
