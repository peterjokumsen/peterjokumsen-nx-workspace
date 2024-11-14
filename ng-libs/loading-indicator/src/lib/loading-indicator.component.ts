import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

import { CommonModule } from '@angular/common';
import { LoadingService } from './loading.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'pj-loading-indicator',
  standalone: true,
  imports: [CommonModule, MatProgressSpinner],
  template: `
    @if (service?.isLoading()) {
      <div class="loading-indicator" [@fadeInOut]>
        @defer {
          <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
        }
      </div>
    }
  `,
  styles: `
    .loading-indicator {
      position: fixed;
      right: 1rem;
      bottom: 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('200ms', style({ transform: 'translateY(0)' })),
      ]),
      transition(':leave', [animate('500ms', style({ opacity: 0 }))]),
    ]),
  ],
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
