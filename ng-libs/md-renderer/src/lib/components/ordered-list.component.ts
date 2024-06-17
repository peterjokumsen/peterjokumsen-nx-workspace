import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { MarkdownContentType, mdModelCheck } from '@peterjokumsen/ts-md-models';

import { CommonModule } from '@angular/common';
import { HasContent } from './has-content.directive';
import { ParagraphComponent } from './paragraph.component';

@Component({
  selector: 'pj-mdr-ordered-list',
  standalone: true,
  imports: [CommonModule, ParagraphComponent],
  template: `
    @if (orderedList()) {
      <ol>
        @for (element of orderedList(); track element.id) {
          <li>
            <pj-mdr-paragraph [content]="element"></pj-mdr-paragraph>
          </li>
        }
      </ol>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderedListComponent extends HasContent {
  protected override _contentType: MarkdownContentType = 'ordered-list';

  orderedList = computed(() => {
    const content = this.contentComputed();
    if (!content) {
      this._logger?.to.warn('No content provided for ordered-list component');
      return [];
    }

    if (mdModelCheck('ordered-list', content)) {
      return content.content.map((c) => this._mdContentService.mapContent(c));
    }

    this._logger?.to.warn(
      `"%o" content provided for ordered-list component, incompatible for ordered-list.`,
      content,
    );
    return [];
  });
}
