import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import {
  MarkdownContent,
  MarkdownContentType,
  mdModelCheck,
} from '@peterjokumsen/ts-md-models';

import { CommonModule } from '@angular/common';
import { HasContent } from './has-content.directive';
import { MdRichContentComponent } from './rich-content';
import { WithId } from '../models';

@Component({
  selector: 'pj-mdr-paragraph',
  standalone: true,
  imports: [CommonModule, MdRichContentComponent],
  template: `
    <div class="md-paragraph">
      @if (simpleParagraph()) {
        <p class="simple-paragraph">{{ simpleParagraph() }}</p>
      } @else {
        <p class="rich-paragraph">
          <pj-mdr-md-rich-content [elements]="richElements()" />
        </p>
      }
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParagraphComponent extends HasContent {
  protected override _contentType: MarkdownContentType = 'paragraph';

  paragraph = computed(() => {
    const content = this.contentComputed();
    if (!content) return null;
    if (mdModelCheck('text', content)) return content;
    if (mdModelCheck('paragraph', content)) return content;

    this._logger?.to.warn(
      `"%o" content provided for paragraph component, incompatible for paragraph.`,
      content,
    );
    return null;
  });

  simpleParagraph = computed(() => {
    const paragraph = this.paragraph();
    if (!paragraph) return null;
    if (typeof paragraph.content === 'string') {
      return paragraph.content;
    }
    return null;
  });

  richElements = computed<WithId<MarkdownContent>[]>(() => {
    const paragraph = this.paragraph();
    if (!paragraph) return [];
    if (typeof paragraph.content === 'string') {
      return [];
    }

    this._logger?.to.log('Rich elements: %o', paragraph.content);
    return paragraph.content.map((pc) => this._mdContentService.mapContent(pc));
  });
}
