import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import {
  MarkdownContent,
  MarkdownParagraph,
  mdModelCheck,
} from '@peterjokumsen/ts-md-models';

import { CommonModule } from '@angular/common';
import { HasContent } from './has-content.directive';
import { ParagraphLinkComponent } from './paragraph-link.component';
import { ParagraphTextComponent } from './paragraph-text.component';
import { PjLogger } from '@peterjokumsen/ng-services';

@Component({
  selector: 'pj-mdr-paragraph',
  standalone: true,
  imports: [CommonModule, ParagraphTextComponent, ParagraphLinkComponent],
  template: `
    <div class="md-paragraph">
      @if (simpleParagraph()) {
        <p class="simple-paragraph">{{ simpleParagraph() }}</p>
      } @else {
        <p class="rich-paragraph">
          @for (element of richElements(); track element.type) {
            @switch (element.type) {
              @case ('text') {
                <pj-mdr-paragraph-text [content]="element" />
              }
              @case ('link') {
                <pj-mdr-paragraph-link [content]="element" />
              }
            }
          }
        </p>
      }
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParagraphComponent extends HasContent {
  paragraph = computed(() => {
    const content = this.content();
    if (!content) {
      this._logger?.to.warn('No content provided for paragraph component');
      return null;
    }
    if (!mdModelCheck('paragraph', content)) {
      this._logger?.to.warn(
        `"%o" content provided for paragraph component, incompatible for paragraph.`,
        content,
      );
      return null;
    }

    return content;
  });
  simpleParagraph = computed(() => {
    const paragraph = this.paragraph();
    if (!paragraph) return null;
    if (typeof paragraph.content === 'string') {
      return paragraph.content;
    }
    return null;
  });

  richElements = computed(() => {
    const paragraph = this.paragraph();
    if (!paragraph) return null;
    if (typeof paragraph.content === 'string') {
      return null;
    }

    this._logger?.to.log('Rich elements: %o', paragraph.content);
    return paragraph.content;
  });
}
