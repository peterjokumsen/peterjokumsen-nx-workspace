import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="background">
      <div class="flex min-h-screen flex-col items-start">
        <div
          class="main-colors m-5 items-center rounded border-2 bg-opacity-50 p-12"
        >
          <div class="font-bold">
            <h1 class="mb-16 justify-start text-3xl">👋 Hi there!</h1>
            <p>Welcome to my blog!</p>
            <p>This is a work in progress.</p>
            <p>Please bear with me, while I practice my skills.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: 'landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {}
