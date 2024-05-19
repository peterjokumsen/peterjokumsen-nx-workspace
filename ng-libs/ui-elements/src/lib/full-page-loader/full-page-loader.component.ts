import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'pj-ui-full-page-loader',
  standalone: true,
  imports: [CommonModule, FaIconComponent],
  template: `
    <div class="loader-container">
      <fa-icon [icon]="spinnerIcon" size="3x" animation="spin-pulse"></fa-icon>
    </div>
  `,
  styles: `
    .loader-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      width: 100vw;
      color: #1a202c;
    }

    @media (prefers-color-scheme: dark) {
      .loader-container {
        color: #f7fafc;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullPageLoaderComponent {
  spinnerIcon = faSpinner;
}
