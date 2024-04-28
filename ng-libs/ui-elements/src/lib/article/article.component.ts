import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { PjUiArticleNavElement, PjUiArticleSection } from './models';

import { ArticleNavComponent } from './article-nav';
import { ArticleNavService } from './services';
import { ArticleSectionComponent } from './section';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pj-ui-article',
  standalone: true,
  imports: [CommonModule, ArticleNavComponent, ArticleSectionComponent],
  template: `
    <pj-ui-article-nav
      [sections]="sections()"
      (navigateClick)="navigateTo($event)"
    >
      @for (section of sections(); track section.title) {
        <pj-ui-article-section
          [section]="section"
          [id]="navSvc.generateId(section.title)"
        ></pj-ui-article-section>
      }
    </pj-ui-article-nav>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleComponent {
  navSvc = inject(ArticleNavService);
  sections = input<PjUiArticleSection[]>();

  navigateTo(navElement: PjUiArticleNavElement) {
    // find elememt by id and scroll to it
    const element = document.getElementById(navElement.id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
