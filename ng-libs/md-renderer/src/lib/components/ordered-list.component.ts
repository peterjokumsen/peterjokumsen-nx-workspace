import { ChangeDetectionStrategy, Component, computed } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HasContent } from './has-content.directive';
import { ParagraphComponent } from './paragraph.component';
import { mdModelCheck } from '@peterjokumsen/ts-md-models';

@Component({
  selector: 'pj-mdr-ordered-list',
  standalone: true,
  imports: [CommonModule, ParagraphComponent],
  template: `
    @if (orderedList()) {
      <ol>
        @for (element of orderedList(); track element.type) {
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
  orderedList = computed(() => {
    const content = this.contentComputed();
    if (!content) {
      this._logger?.to.warn('No content provided for ordered-list component');
      return [];
    }

    if (mdModelCheck('ordered-list', content)) {
      return content.content;
    }

    this._logger?.to.warn(
      `"%o" content provided for ordered-list component, incompatible for ordered-list.`,
      content,
    );
    return [];
  });
}
