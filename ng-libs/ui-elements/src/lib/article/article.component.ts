import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { PjUiArticleSection } from './models';

@Component({
  selector: 'pj-ui-article',
  standalone: true,
  imports: [CommonModule],
  template: `<p>article works!</p>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleComponent {
  sections = input<PjUiArticleSection[]>();
}
