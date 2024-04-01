import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-template #headersTemplate>
      <div
        class="table-of-contents sticky top-0 flex flex-col justify-around gap-4 p-2"
      >
        @for (header of headers(); track header.title) {
          <a
            class="rounded border bg-pink-600 p-6 text-white hover:bg-gray-800"
            href="#"
            (click)="navigateTo(header.element)"
            >{{ header.title }}</a
          >
        }
      </div>
    </ng-template>
    <div class="content grid grid-cols-5">
      <div class="col-span-5 md:hidden">
        <ng-container *ngTemplateOutlet="headersTemplate"></ng-container>
      </div>
      <div #content class="col-span-5 md:col-span-2 md:col-start-2">
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
      <div class="col-span-1 col-start-5 hidden md:block">
        <ng-container *ngTemplateOutlet="headersTemplate"></ng-container>
      </div>
    </div>
  `,
  styles: `
    .about-me-section {
      @apply flex h-screen flex-col items-center justify-around p-6;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutMeComponent implements AfterViewInit {
  headers = signal<Array<{ id: string; element: HTMLElement; title: string }>>(
    [],
  );

  @ViewChild('content') content!: ElementRef;

  ngAfterViewInit(): void {
    const headers = Array.from(
      this.content.nativeElement.querySelectorAll('h1, h2, h3, h4, h5, h6'),
    ).map((el) => {
      const header = el as HTMLElement;
      const id = header.innerText
        .toLowerCase()
        .replace(/[\W]/g, '')
        .replace(/ /g, '-');
      return {
        id,
        element: header,
        title: header.innerText,
      };
    });

    this.headers.update(() => headers);
  }

  navigateTo(element: HTMLElement): boolean {
    console.log(element);
    element.scrollIntoView({ behavior: 'smooth' });
    return false;
  }
}
