import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'bu-jo-landing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <ul>
        <li>Journal</li>
      </ul>
    </div>
  `,
  styles: `
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {}
