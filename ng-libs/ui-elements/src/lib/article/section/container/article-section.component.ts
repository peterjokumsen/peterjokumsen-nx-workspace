import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { PjUiArticleSection, PjUiContent } from '../../models';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'pj-ui-article-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './article-section.component.html',
  styleUrl: './article-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleSectionComponent {
  section = input<PjUiArticleSection>();

  contents = computed(() =>
    this.isBasicContent(this.section()?.content ?? '')
      ? [this.section()?.content]
      : this.section()?.content ?? [],
  );

  isBasicContent(content: PjUiContent | PjUiContent[]): content is string {
    return typeof content === 'string';
  }
}
