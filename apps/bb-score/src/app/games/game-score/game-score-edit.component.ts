import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { ScoringService } from './scoring/scoring.service';
import { ScoreStatusComponent } from './scoring/status.component';

@Component({
  selector: 'app-game-score-edit',
  standalone: true,
  imports: [CommonModule, MatCardModule, RouterModule, ScoreStatusComponent],
  providers: [ScoringService],
  template: `
    <div class="score-edit-container">
      <mat-card class="score-card">
        <mat-card-header>
          <mat-card-title>Game Scoring</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <router-outlet></router-outlet>
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
    </div>
  `,
  styles: `
    .score-edit-container {
      display: grid;
      grid-template-columns: repeat(2, minmax(400px, 1fr));
      gap: 20px;
      padding: 16px;
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

    @media (max-width: 800px) {
      .score-edit-container {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class GameScoreEditComponent {}
