import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  Signal,
  ViewChild,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { PjUiArticleNavElement, PjUiArticleSection } from '../models';
import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

import { ArticleNavService } from '../services';
import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';

type ArticleNavSection = Pick<PjUiArticleSection, 'title'>;

@Component({
  selector: 'pj-ui-article-nav',
  standalone: true,
  imports: [
    CommonModule,
    FaIconComponent,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatButton,
    MatMiniFabButton,
  ],
  templateUrl: './article-nav.component.html',
  styleUrl: './article-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('inOutAnimation', [
      state('in', style({ transform: 'translateX(0)', height: '*' })),
      transition(':enter', [
        animate(
          300,
          keyframes([
            style({ offset: 0, transform: 'translateX(100%)', height: 0 }),
            style({ offset: 0.25, transform: 'translateX(80%)', height: '*' }),
            style({ offset: 0.5, transform: 'translateX(60%)' }),
            style({ offset: 0.75, transform: 'translateX(20%)' }),
            style({ offset: 1, transform: 'translateX(0)' }),
          ]),
        ),
      ]),
      transition(':leave', [
        animate(
          300,
          keyframes([
            style({ offset: 0, transform: 'translateX(0)' }),
            style({ offset: 0.25, transform: 'translateX(50%)' }),
            style({ offset: 0.5, transform: 'translateX(75%)' }),
            style({ offset: 0.75, transform: 'translateX(100%)', height: '*' }),
            style({ offset: 1, height: 0 }),
          ]),
        ),
      ]),
    ]),
  ],
})
export class ArticleNavComponent {
  private _navSvc = inject(ArticleNavService);

  sections = input<ArticleNavSection[]>();
  inViewId = signal<string>('');

  navElements: Signal<PjUiArticleNavElement[]> = computed(() => {
    const elements =
      this.sections()?.map((section) => this.mapToNavElement(section)) ?? [];
    if (this.inViewId() !== '') {
      elements.unshift({ id: '#', title: 'Back to top' });
    } else if (elements?.[0]?.id === '#') {
      elements.shift();
    }

    return elements;
  });
  expandIcon = faMapLocationDot;
  navExpanded = false;

  @ViewChild('content') content!: ElementRef;
  @ViewChild('navShowHide') navShowHide!: ElementRef;

  @Output()
  navigateClick = new EventEmitter<PjUiArticleNavElement>();

  @HostListener('window:scroll')
  onScroll() {
    for (const nav of this.navElements()) {
      const element = document.getElementById(nav.id);
      if (!element) continue;
      const rect = element.getBoundingClientRect();
      if (rect.top <= 0 && rect.top + rect.height > 0) {
        if (this.inViewId() !== nav.id) {
          this.inViewId.update(() => nav.id);
        }

        return;
      }
    }

    this.inViewId.update(() => '');
  }

  private mapToNavElement(section: ArticleNavSection): PjUiArticleNavElement {
    return {
      id: this._navSvc.generateId(section.title),
      title: section.title,
    };
  }

  navigateClicked(nav: PjUiArticleNavElement) {
    this.navigateClick.emit(nav);
  }
}
