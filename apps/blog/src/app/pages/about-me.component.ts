import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  imports: [CommonModule, FaIconComponent],
  template: `
    <ng-template #headersTemplate>
      <div
        class="table-of-contents sticky top-0 flex max-h-screen flex-col justify-around gap-4 overflow-scroll p-2"
      >
        @for (header of headers(); track header.title) {
          <a
            class="rounded border bg-pink-600 p-6 text-white hover:bg-gray-800"
            href="#"
            (click)="navigateTo(header.element)"
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
export class AboutMeComponent implements AfterViewInit {
  headers = signal<Array<{ id: string; element: HTMLElement; title: string }>>(
    [],
  );
  expandIcon = faGear;

  @ViewChild('content') content!: ElementRef;
  @ViewChild('toc') toc!: ElementRef;

  ngAfterViewInit(): void {
    const headers = Array.from(
      this.content.nativeElement.querySelectorAll('h1, h2, h3, h4, h5, h6'),
    )
      .map((el) => {
        const header = el as HTMLElement;
        const id = header.innerText
          ?.toLowerCase()
          .replace(/[\W]/g, '')
          .replace(/ /g, '-');
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
  }

  navigateTo(element: HTMLElement): boolean {
    console.log(element);
    element.parentElement?.scrollIntoView({ behavior: 'smooth' });
    this.showOrHideToc(true);
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
