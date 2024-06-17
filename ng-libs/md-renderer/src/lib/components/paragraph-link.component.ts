import { ChangeDetectionStrategy, Component, computed } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HasContent } from './has-content.directive';
import { ParagraphImageComponent } from './paragraph-image.component';
import { ParagraphTextComponent } from './paragraph-text.component';
import { mdModelCheck } from '@peterjokumsen/ts-md-models';

@Component({
  selector: 'pj-mdr-paragraph-link',
  standalone: true,
  imports: [CommonModule, ParagraphTextComponent, ParagraphImageComponent],
  template: `
    @if (link()) {
      <a [href]="linkHref()" class="md-paragraph-link">
        @if (linkContentIsSimple()) {
          {{ linkContent() }}
        } @else {
          @for (element of linkContents(); track element.type) {
            @switch (element.type) {
              @case ('text') {
                <pj-mdr-paragraph-text
                  [content]="element"
                ></pj-mdr-paragraph-text>
              }
              @case ('image') {
                <pj-mdr-paragraph-image
                  [content]="element"
                ></pj-mdr-paragraph-image>
              }
              @default {
                <span>Unsupported content type</span>
              }
            }
          }
        }
      </a>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParagraphLinkComponent extends HasContent {
  link = computed(() => {
    const content = this.contentComputed();
    if (!content) {
      this._logger?.to.warn('No content provided for paragraph-link component');
      return null;
    }

    if (mdModelCheck('link', content)) {
      return content;
    }

    this._logger?.to.warn(
      `"%o" content provided for paragraph-link component, incompatible for link.`,
      content,
    );
    return null;
  });

  linkContent = computed(() => {
    const link = this.link();
    if (!link) return null;
    return link.content;
  });

  linkContents = computed(() => {
    const content = this.linkContent();
    if (!content || typeof content === 'string') return [];
    return content;
  });

  linkContentIsSimple = computed(() => {
    const link = this.link();
    if (!link) return false;
    return typeof link.content === 'string';
  });

  linkHref = computed(() => {
    const link = this.link();
    if (!link) return null;
    return link.href;
  });
}
