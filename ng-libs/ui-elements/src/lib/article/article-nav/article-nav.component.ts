import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  Signal,
  ViewChild,
  computed,
  inject,
  input,
} from '@angular/core';
import { PjUiArticleNavElement, PjUiArticleSection } from '../models';

import { ArticleNavService } from '../services';
import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';

type ArticleNavSection = Pick<PjUiArticleSection, 'title'>;

@Component({
  selector: 'pj-ui-article-nav',
  standalone: true,
  imports: [CommonModule, FaIconComponent],
  templateUrl: './article-nav.component.html',
  styleUrl: './article-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleNavComponent {
  navSvc = inject(ArticleNavService);

  sections = input<ArticleNavSection[]>();

  navElements: Signal<PjUiArticleNavElement[]> = computed(
    () =>
      this.sections()?.map((section) => this.mapToNavElement(section)) ?? [],
  );
  expandIcon = faMapLocationDot;
  navExpanded = false;

  @ViewChild('content') content!: ElementRef;
  @ViewChild('navShowHide') navShowHide!: ElementRef;

  @Output()
  navigateClick = new EventEmitter<PjUiArticleNavElement>();

  private mapToNavElement(section: ArticleNavSection): PjUiArticleNavElement {
    return {
      id: this.navSvc.generateId(section.title),
      title: section.title,
    };
  }

  showOrHideToc(forceHide = false) {
    const element = this.navShowHide?.nativeElement as HTMLElement;
    if (!element) return;

    if (element.classList.contains('show')) {
      this.navExpanded = false;
      element.classList.remove('show');
      return;
    }

    if (forceHide) return;

    this.navExpanded = true;
    element.classList.add('show');
  }

  navigateClicked(event: MouseEvent, nav: PjUiArticleNavElement) {
    event.preventDefault();
    this.showOrHideToc(true);
    this.navigateClick.emit(nav);
  }
}
