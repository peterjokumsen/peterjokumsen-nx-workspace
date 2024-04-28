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
  template: `
    <ng-template #navTemplate>
      <div
        class="nav-elements sticky top-0 flex max-h-screen flex-col justify-around gap-2 overflow-y-auto p-2"
      >
        @for (nav of navElements(); track nav.id) {
          <a
            class="nav-button primary-block alt-text rounded border px-4 py-2 font-bold"
            href="#"
            (click)="navigateClicked($event, nav)"
          >
            {{ nav.title }}
          </a>
        }
      </div>
    </ng-template>
    <div class="content grid grid-cols-5">
      <div
        #content
        class="col-span-5 md:col-span-3 md:col-start-1 lg:col-span-2 lg:col-start-2"
      >
        <div class="sticky top-1 col-span-5 md:hidden">
          <div class="control m-5 flex justify-end">
            <button
              class="nav-button primary-block rounded p-2 px-4"
              [ngClass]="{ active: navExpanded }"
              (click)="showOrHideToc()"
              aria-label="Show or hide page navigation"
            >
              <fa-icon [icon]="expandIcon"></fa-icon>
            </button>
          </div>
          <div #navShowHide class="show-hide">
            <div class="primary-block mt-2 rounded-2xl border-2 p-4">
              <ng-container *ngTemplateOutlet="navTemplate"></ng-container>
            </div>
          </div>
        </div>
        <ng-content></ng-content>
      </div>
      <div
        class="col-span-2 col-start-4 hidden md:block lg:col-span-1 lg:col-start-5"
      >
        <ng-container *ngTemplateOutlet="navTemplate"></ng-container>
      </div>
    </div>
  `,
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
