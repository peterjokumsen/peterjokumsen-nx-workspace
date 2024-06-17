import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { MarkdownContentType, mdModelCheck } from '@peterjokumsen/ts-md-models';

import { CommonModule } from '@angular/common';
import { HasContent } from './has-content.directive';

@Component({
  selector: 'pj-mdr-paragraph-image',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (image()) {
      <img [src]="image()?.src" [alt]="image()?.alt" />
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParagraphImageComponent extends HasContent {
  protected override _contentType: MarkdownContentType = 'image';

  image = computed(() => {
    const content = this.contentComputed();
    if (!content) return null;
    if (mdModelCheck('image', content)) {
      return content;
    }

    this._logger?.to.warn(
      `"%o" content provided for paragraph-image component, incompatible for image.`,
      content,
    );
    return null;
  });
}
