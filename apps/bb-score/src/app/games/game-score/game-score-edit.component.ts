import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { distinctUntilChanged, filter, map } from 'rxjs';
import { BasesStatusComponent } from './scoring/bases-status.component';
import { FieldStatusComponent } from './scoring/field-status.component';
import { ScoringService } from './scoring/scoring.service';
import { ScoreStatusComponent } from './scoring/status.component';

@Component({
  selector: 'app-game-score-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule,
    ScoreStatusComponent,
    BasesStatusComponent,
    FieldStatusComponent,
    MatButton,
  ],
  providers: [ScoringService],
  template: `
    @switch (state()) {
      @case ('ready') {
        <div class="score-edit-container">
          <mat-card class="score-card">
            <mat-card-header>
              <mat-card-title>Game Scoring</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <router-outlet></router-outlet>
              <div class="admin-controls">
                <button
                  mat-raised-button
                  (click)="scoringService.updateState({ type: 'out' })"
                >
                  Out
                </button>
                <button
                  mat-raised-button
                  (click)="scoringService.updateState({ type: 'ballgame' })"
                >
                  Ballgame
                </button>
                @if (currentAction() === 'time-out') {
                  <button
                    mat-raised-button
                    (click)="scoringService.updateState({ type: 'time-in' })"
                  >
                    Time In
                  </button>
                } @else {
                  <button
                    mat-raised-button
                    (click)="scoringService.updateState({ type: 'time-out' })"
                  >
                    Time Out
                  </button>
                }
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="status-card">
            <mat-card-header>
              <mat-card-title>Game Status</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <app-score-status></app-score-status>
            </mat-card-content>
          </mat-card>

          <mat-card class="bases-status">
            <mat-card-header>
              <mat-card-title>Bases Status</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <app-bases-status></app-bases-status>
            </mat-card-content>
          </mat-card>

          <mat-card class="field-status">
            <mat-card-header>
              <mat-card-title>Field Status</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <app-field-status></app-field-status>
            </mat-card-content>
          </mat-card>
        </div>
      }
      @case ('loading') {
        <p>Loading...</p>
      }
      @default {
        <p>Something went wrong loading game to score...</p>
      }
    }
  `,
  styles: `
    .admin-controls {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-top: 15px;
      background: var(--mat-sys-outline);
      color: var(--mat-sys-on-outline);
      padding: 5px;
      border-radius: 10px;
    }

    .score-edit-container {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
      padding: 16px;

      @media (min-width: 768px) {
        grid-template-columns: repeat(2, minmax(200px, 1fr));
      }

      @media (min-width: 1400px) {
        grid-template-columns: repeat(4, minmax(200px, 1fr));
      }
    }

    .score-card,
    .status-card {
      height: 100%;
    }

    mat-card-header {
      background-color: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
      border-radius: 12px 12px 0 0;
      padding-bottom: 10px;
    }

    mat-card-content {
      padding: 16px;
    }
  `,
})
export class GameScoreEditComponent implements OnInit {
  scoringService = inject(ScoringService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _state$ = this.scoringService.latestState$.pipe(
    map((s) => s.state),
    filter((s) => !!s),
    distinctUntilChanged(),
    takeUntilDestroyed(),
  );

  currentAction = toSignal(
    this.scoringService.latestState$.pipe(map((s) => s.currentAction)),
  );

  state = signal<'loading' | 'ready' | 'failed'>('loading');

  async ngOnInit() {
    const result = await this.scoringService.load();
    this.state.update(() => result);
    if (result !== 'failed') {
      this._state$.subscribe((state) =>
        this._router.navigate([state], { relativeTo: this._route }),
      );
    }
  }
}
