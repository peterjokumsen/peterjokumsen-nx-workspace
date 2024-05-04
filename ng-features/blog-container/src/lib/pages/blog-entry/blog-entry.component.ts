import {
  ArticleComponent,
  PjUiArticleSection,
} from '@peterjokumsen/ui-elements';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, ArticleComponent],
  template: ` <pj-ui-article [sections]="sections"></pj-ui-article> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogEntryComponent {
  readonly sections: PjUiArticleSection[] = [
    {
      title: 'Blog Entry',
      content:
        'This is a temporary blog entry, to start building the blog entry component.',
    },
    {
      title: 'Next Steps',
      content: [
        'Create a breadcrumb component to assist navigation.',
        'Create a method to generate lists in the article component.',
        'Create a method to generate code blocks in the article component.',
        'Create a method to generate images in the article component.',
        'Figure out approach for handling blog entries.',
        'Improve header to be static after scrolling.',
      ],
    },
  ];
}
