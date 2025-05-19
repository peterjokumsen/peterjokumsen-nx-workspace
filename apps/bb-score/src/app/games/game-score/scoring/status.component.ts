import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { ScoringService } from './scoring.service';

@Component({
  selector: 'app-score-status',
  standalone: true,
  imports: [CommonModule, MatIcon],
  template: `
    <div class="status-table">
      <div class="score">
        <div class="team">
          <mat-icon>home</mat-icon>
          <span class="label">{{ homeScore() }}</span>
        </div>

        <div class="team">
          <span class="label">{{ awayScore() }}</span>
          <mat-icon>toys</mat-icon>
        </div>
      </div>

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

      &:nth-child(odd) {
        color: var(--mat-sys-primary-container);
      }
    }

    .score {
      padding: 10px;
      display: flex;
      border-radius: 10px;
      border: 1px solid var(--mat-sys-primary-container);
      justify-content: space-around;
      margin-bottom: 1.5rem;
    }

    .team {
      display: flex;
      align-items: center;
      gap: 5px;
      justify-content: center;
    }

    .header {
      font-weight: bold;
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
  private _state = toSignal(this._scoringService.latestState$);
  awayScore = computed(() => this._state()?.awayScore ?? 0);
  homeScore = computed(() => this._state()?.homeScore ?? 0);
  inning = computed(() => this._state()?.inning ?? '');
  frame = computed(() => this._state()?.frame ?? '');
  outs = computed(() => this._state()?.outs ?? '');
  strikes = computed(() => this._state()?.strikes ?? '');
  balls = computed(() => this._state()?.balls ?? '');
}
