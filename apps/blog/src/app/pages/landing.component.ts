import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';

import { AboutMeComponent } from './about-me.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, AboutMeComponent],
  template: `
    <div class="background flex min-h-screen flex-col items-start">
      <div
        class="main-colors m-5 items-center rounded border-2 bg-opacity-50 p-12"
      >
        <div class="font-bold">
          <h1 class="mb-16 justify-start text-3xl">👋 Hi there!</h1>
          <p>Welcome to my blog!</p>
          <p>This is a work in progress, feel free to look around!</p>
          <div class="actions mt-8 flex flex-col gap-4">
            <a
              href="#"
              class="pj-button primary"
              (click)="navigateTo('blog', $event)"
            >
              Go to blog
            </a>
            <a
              href="#"
              class="pj-button main"
              (click)="navigateTo('about-me', $event)"
            >
              More about me
            </a>
          </div>
        </div>
      </div>
    </div>
    <div #aboutMe>
      @defer {
        <app-about-me></app-about-me>
      }
    </div>
  `,
  styleUrl: 'landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  private _router = inject(Router);

  @ViewChild('aboutMe') aboutMe!: ElementRef;

  async navigateTo(destination: 'blog' | 'about-me', event: Event) {
    event.preventDefault();

    if (destination === 'blog') {
      await this._router.navigate(['/blog']);
    } else {
      this.aboutMe?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
