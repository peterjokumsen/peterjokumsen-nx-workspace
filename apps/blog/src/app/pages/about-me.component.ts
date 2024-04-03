import { ActivatedRoute, Router } from '@angular/router';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { Subject, firstValueFrom, map } from 'rxjs';

import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  imports: [CommonModule, FaIconComponent],
  template: `
    <ng-template #headersTemplate>
      <div
        class="table-of-contents sticky top-0 flex max-h-screen flex-col justify-around gap-2 overflow-y-auto p-2"
      >
        @for (header of headers(); track header.title) {
          <a
            class="rounded border bg-pink-600 px-4 py-2 text-white hover:bg-gray-800"
            href="#"
            (click)="selectHeader(header.id)"
          >
            {{ header.title }}
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
          <div class="control flex justify-end">
            <button
              class="rounded bg-pink-600 p-2 px-4 text-white"
              (click)="showOrHideToc()"
            >
              <fa-icon [icon]="expandIcon"></fa-icon>
            </button>
          </div>
          <div #toc class="show-hide">
            <div class="mt-2 rounded border-2 border-pink-600 bg-stone-300 p-4">
              <ng-container *ngTemplateOutlet="headersTemplate"></ng-container>
            </div>
          </div>
        </div>
        <div class="about-me-section">
          <h1 class="text-4xl font-bold">Who am I?</h1>
          <p class="text-lg">
            I am a software engineer who loves to build things. I have been
            working in the software industry for over 10 years.
          </p>
          <p class="text-lg">
            I am passionate about learning new technologies and solving problems
            in interesting ways.
          </p>
        </div>
        <div class="about-me-section">
          <h1 class="text-2xl font-bold">What is the purpose of this blog?</h1>
          <p class="text-lg">
            The purpose of this blog is to share my knowledge and experiences
            with others. I hope to help others learn new things and grow as
            software engineers.
          </p>
        </div>
        <div class="about-me-section">
          <h1 class="text-2xl font-bold">What will you find on this blog?</h1>
          <p class="text-lg">
            On this blog, you will find articles on various topics related to
            software engineering. I will cover topics such as programming
            languages, frameworks, tools, best practices, workarounds that I've
            found and some completely unrelated topics too.
          </p>
        </div>
      </div>
      <div
        class="col-span-2 col-start-4 hidden md:block lg:col-span-1 lg:col-start-5"
      >
        <ng-container *ngTemplateOutlet="headersTemplate"></ng-container>
      </div>
    </div>
  `,
  styles: `
    .about-me-section {
      @apply flex h-screen flex-col items-center justify-center gap-6 p-6;
    }

    .show-hide {
      transition: opacity 0.5s;
      opacity: 0;
      height: 0;

      &.show {
        opacity: 1;
      }

      .table-of-contents {
        max-height: calc(100vh - 6rem);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutMeComponent implements AfterViewInit, OnDestroy, OnInit {
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  private _selectedHeader$ = new Subject<string>();
  headers = signal<Array<{ id: string; element: HTMLElement; title: string }>>(
    [],
  );
  expandIcon = faGear;

  @ViewChild('content') content!: ElementRef;
  @ViewChild('toc') toc!: ElementRef;

  async ngOnInit() {
    const selectedHeader = await firstValueFrom(
      this._route.queryParams.pipe(
        map((qp) => qp['header'] as string | undefined),
      ),
    );
    if (selectedHeader) {
      this._selectedHeader$.next(selectedHeader);
    }
  }

  ngOnDestroy() {
    this._selectedHeader$.complete();
  }

  ngAfterViewInit(): void {
    const headers = Array.from(
      this.content.nativeElement.querySelectorAll('h1, h2, h3, h4, h5, h6'),
    )
      .map((el) => {
        const header = el as HTMLElement;
        const id = header.innerText
          ?.toLowerCase()
          .split(' ')
          .map((word) => word.replace(/[^a-zA-Z0-9-]/g, ''))
          .join('-');
        return {
          id,
          element: header,
          title: header.innerText,
        };
      })
      .filter((header) => header.id);

    this.headers.update(() => [
      { id: 'top', element: this.content.nativeElement, title: 'Top' },
      ...headers,
    ]);

    this._selectedHeader$.subscribe((headerId) => this.navigateTo(headerId));
  }

  private navigateTo(headerId: string): void {
    const element =
      this.headers()?.find((header) => header.id === headerId)?.element ??
      (this.content?.nativeElement as HTMLElement);
    if (!element) {
      return;
    }

    if (headerId) {
      this._router
        .navigate([], {
          queryParams: { header: headerId },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        })
        .then();
    } else {
      this._router.navigate([], { queryParams: {}, replaceUrl: true }).then();
    }

    const scrollElement = element.parentElement ?? element;
    if (!scrollElement.scrollIntoView) return;
    scrollElement.scrollIntoView({ behavior: 'smooth' });
    this.showOrHideToc(true);
  }

  selectHeader(headerId: string): boolean {
    headerId = headerId === 'top' ? '' : headerId;
    this._selectedHeader$.next(headerId);
    return false;
  }

  showOrHideToc(forceHide = false) {
    const element = this.toc?.nativeElement as HTMLElement;
    if (!element) return;

    if (element.classList.contains('show')) {
      element.classList.remove('show');
      return;
    }

    if (forceHide) return;

    element.classList.add('show');
  }
}
