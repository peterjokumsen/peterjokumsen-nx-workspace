import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import {
  MarkdownContent,
  MarkdownContentType,
  mdModelCheck,
} from '@peterjokumsen/ts-md-models';

import { CommonModule } from '@angular/common';
import { HasContent } from '../has-content.directive';
import { MdImageComponent } from './md-image.component';
import { MdTextComponent } from './md-text.component';
import { WithId } from '../../models';

@Component({
  selector: 'pj-mdr-md-link',
  standalone: true,
  imports: [CommonModule, MdTextComponent, MdImageComponent],
  template: `
    @if (link()) {
      <a [href]="linkHref()" class="md-paragraph-link">
        @if (linkContentIsSimple()) {
          {{ linkContent() }}
        } @else {
          @for (element of linkContents(); track element.id) {
            @switch (element.type) {
              @case ('text') {
                <pj-mdr-md-text [content]="element" />
              }
              @case ('image') {
                <pj-mdr-md-image [content]="element" />
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
export class MdLinkComponent extends HasContent {
  protected override _contentType: MarkdownContentType = 'link';

  link = computed(() => {
    const content = this.contentComputed();
    if (!content) return null;
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

  linkContents = computed<WithId<MarkdownContent>[]>(() => {
    const content = this.linkContent();
    if (!content || typeof content === 'string') return [];
    return content.map((c) => this._mdContentService.mapContent(c));
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
