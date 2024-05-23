import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { ArticleComponent } from '@peterjokumsen/ui-elements';
import { CommonModule } from '@angular/common';
import { PjArticleParser } from '@peterjokumsen/ng-services';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-change-history',
  standalone: true,
  imports: [CommonModule, ArticleComponent],
  templateUrl: './change-history.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeHistoryComponent {
  private _parser = inject(PjArticleParser);

  private readonly _markdown = `
  ## Work in progress

  There are quite a number of pieces I would like to get in place to complete this page. Some of the things I am considering are:
  - A process to publish documentation of projects in this workspace
  - Notes on process applied to get this blog up and running
  - Notes on the development and projects done for this blog
  - Notes on the design choices
  - Records of changes made to the blog
  `;

  article = toSignal(this._parser.fromSource(this._markdown));
  sections = computed(() => this.article()?.sections ?? []);
}
