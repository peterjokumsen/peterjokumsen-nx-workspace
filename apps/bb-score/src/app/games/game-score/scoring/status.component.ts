import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { map } from 'rxjs';
import { ScoringService } from './scoring.service';

@Component({
  selector: 'app-score-status',
  standalone: true,
  imports: [CommonModule, MatIcon],
  template: `
    <div class="status-table">
      <div class="row">
        <span class="header">Inning</span>
        <span class="label">
          @switch (frame()) {
            @case ('top') {
              <mat-icon>arrow_circle_up</mat-icon>
            }
            @case ('bottom') {
              <mat-icon>arrow_circle_down</mat-icon>
            }
          }
          {{ inning() }}
        </span>
      </div>

      <div class="row">
        <span class="header">Outs</span>
        <span class="label">{{ outs() }}</span>
      </div>

      <div class="row">
        <span class="header">Strikes</span>
        <span class="label">{{ strikes() }}</span>
      </div>

      <div class="row">
        <span class="header">Balls</span>
        <span class="label">{{ balls() }}</span>
      </div>
    </div>
  `,
  styles: `
    .status-table {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .row {
      display: grid;
      column-gap: 10px;
      row-gap: 10px;
      grid-template-columns: 1fr 1fr;
    }

    .header {
      font-weight: bold;
      font-size: 1.2rem;
    }

    .label {
      align-items: center;
      display: flex;
      gap: 5px;
      justify-content: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreStatusComponent {
  private _scoringService = inject(ScoringService);
  inning = toSignal(
    this._scoringService.latestState$.pipe(map((m) => m.inning)),
  );
  frame = toSignal(this._scoringService.latestState$.pipe(map((m) => m.frame)));
  outs = toSignal(this._scoringService.latestState$.pipe(map((m) => m.outs)));
  strikes = toSignal(
    this._scoringService.latestState$.pipe(map((m) => m.strikes)),
  );
  balls = toSignal(this._scoringService.latestState$.pipe(map((m) => m.balls)));
}
