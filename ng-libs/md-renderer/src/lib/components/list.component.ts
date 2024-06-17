import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { MarkdownContentType, mdModelCheck } from '@peterjokumsen/ts-md-models';

import { CommonModule } from '@angular/common';
import { HasContent } from './has-content.directive';
import { ParagraphComponent } from './paragraph.component';

@Component({
  selector: 'pj-mdr-list',
  standalone: true,
  imports: [CommonModule, ParagraphComponent],
  template: `
    <ul>
      @for (listElement of listElements(); track listElement.id) {
        <li>
          <pj-mdr-paragraph [content]="listElement" />
        </li>
      }
    </ul>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent extends HasContent {
  protected override _contentType: MarkdownContentType = 'list';

  listElements = computed(() => {
    const content = this.contentComputed();
    if (!content) {
      this._logger?.to.warn('No content provided for list component');
      return [];
    }

    if (mdModelCheck('list', content)) {
      return content.content.map((c) => this._mdContentService.mapContent(c));
    }

    this._logger?.to.warn(
      `"%o" content provided for list component, incompatible for list.`,
      content,
    );
    return [];
  });
}
