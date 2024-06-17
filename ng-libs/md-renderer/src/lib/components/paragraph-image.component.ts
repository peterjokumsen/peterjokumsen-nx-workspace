import { ChangeDetectionStrategy, Component, computed } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HasContent } from './has-content.directive';
import { mdModelCheck } from '@peterjokumsen/ts-md-models';

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
  image = computed(() => {
    const content = this.content();
    if (!content) {
      this._logger?.to.warn(
        'No content provided for paragraph-image component',
      );
      return null;
    }

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
