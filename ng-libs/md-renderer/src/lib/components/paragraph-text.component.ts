import { ChangeDetectionStrategy, Component, computed } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HasContent } from './has-content.directive';
import { mdModelCheck } from '@peterjokumsen/ts-md-models';

@Component({
  selector: 'pj-mdr-paragraph-text',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (textContent()) {
      <span>{{ textContent() }}</span>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParagraphTextComponent extends HasContent {
  textContent = computed(() => {
    const content = this.content();
    if (!content) {
      this._logger?.to.warn('No content provided for paragraph-text component');
      return null;
    }
    if (mdModelCheck('text', content)) {
      return content.content;
    }

    this._logger?.to.warn(
      `"%o" content provided for paragraph-text component, incompatible for text.`,
      content,
    );
    return null;
  });
}
