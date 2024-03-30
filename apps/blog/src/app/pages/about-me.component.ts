import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center h-screen">
      <code
        class="bg-stone-100 border-2 border-stone-400 rounded p-12 items-center"
      >
        // TODO: Add content here
      </code>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutMeComponent {}
