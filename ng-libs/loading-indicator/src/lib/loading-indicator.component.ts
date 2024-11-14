import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { LoadingService } from './loading.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'pj-loading-indicator',
  standalone: true,
  imports: [CommonModule, MatProgressSpinner],
  template: `
    <div class="loading-indicator">
      <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.display]': 'service?.isLoading() ? "block" : "none"',
  },
})
export class LoadingIndicatorComponent implements OnInit {
  service = inject(LoadingService, { optional: true });

  ngOnInit() {
    if (!this.service) {
      throw new Error(
        [
          'LoadingIndicatorComponent (pj-loading-indicator)',
          'requires LoadingService to be provided,',
          'use provideLoadingIndicator() from @peterjokumsen/loading-indicator',
        ].join(' '),
      );
    }
  }
}
