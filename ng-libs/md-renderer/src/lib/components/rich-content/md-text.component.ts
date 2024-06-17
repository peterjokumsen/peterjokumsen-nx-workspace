import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { MarkdownContentType, mdModelCheck } from '@peterjokumsen/ts-md-models';

import { CommonModule } from '@angular/common';
import { HasContent } from '../has-content.directive';

@Component({
  selector: 'pj-mdr-md-text',
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
export class MdTextComponent extends HasContent {
  protected override _contentType: MarkdownContentType = 'text';

  textContent = computed(() => {
    const content = this.contentComputed();
    if (!content) return null;
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
