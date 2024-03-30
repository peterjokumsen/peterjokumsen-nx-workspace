import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center h-screen">
      <div class="bg-stone-100 border-2 border-stone-400 rounded p-12 items-center">
        <h1 class="text-3xl justify-start mb-16">👋 Hi there!</h1>
        <p>Welcome to my blog!</p>
        <p>This is a work in progress.</p>
        <p>Please bear with me, while I practice my skills.</p>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {}
