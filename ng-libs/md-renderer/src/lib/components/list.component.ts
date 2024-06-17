import { ChangeDetectionStrategy, Component, computed } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HasContent } from './has-content.directive';
import { ParagraphComponent } from './paragraph.component';
import { mdModelCheck } from '@peterjokumsen/ts-md-models';

@Component({
  selector: 'pj-mdr-list',
  standalone: true,
  imports: [CommonModule, ParagraphComponent],
  template: `
    <ul>
      @for (listElement of listElements(); track listElement) {
        <li><pj-mdr-paragraph [content]="listElement" /></li>
      }
    </ul>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent extends HasContent {
  listElements = computed(() => {
    const content = this.content();
    if (!content) {
      this._logger?.to.warn('No content provided for list component');
      return [];
    }
    if (mdModelCheck('list', content)) {
      return content.content;
    }

    this._logger?.to.warn(
      `"%o" content provided for list component, incompatible for list.`,
      content,
    );
    return [];
  });
}
