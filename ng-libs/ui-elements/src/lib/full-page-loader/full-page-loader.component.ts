import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'pj-ui-full-page-loader',
  standalone: true,
  imports: [CommonModule, FaIconComponent],
  template: `
    <fa-icon [icon]="spinnerIcon" size="3x" animation="spin-pulse"></fa-icon>
  `,
  styles: `
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      width: 100vw;
      color: #1a202c;
      background-color: #f7fafc;

      @media (prefers-color-scheme: dark) {
        background-color: #1a202c;
        color: #f7fafc;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullPageLoaderComponent {
  spinnerIcon = faSpinner;
}
