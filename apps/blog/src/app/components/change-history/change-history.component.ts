import {
  ArticleComponent,
  PjUiArticleSection,
} from '@peterjokumsen/ui-elements';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-history',
  standalone: true,
  imports: [CommonModule, ArticleComponent],
  templateUrl: './change-history.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeHistoryComponent {
  sections: PjUiArticleSection[] = [
    {
      title: 'Work in progress',
      content: [
        'There are quite a number of pieces I would like to get in place to complete this page. Some of the things I am considering are:',
        ' - A process to publish documentation of projects in this workspace',
        ' - Notes on process applied to get this blog up and running',
        ' - Notes on the development and projects done for this blog',
        ' - Notes on the design choices',
      ],
    },
  ];
}
