import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Game } from '../models';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>
          {{ game().homeTeamName }} vs {{ game().awayTeamName }} ({{
            game().status
          }})
        </mat-card-title>
        <mat-card-subtitle>
          <span class="league">{{ game().league }}</span>
          <span class="date">{{ game().date | date: 'fullDate' }}</span>
        </mat-card-subtitle>
      </mat-card-header>
      <ng-content select="mat-card-content">
        <mat-card-content class="default-card-content">
          @if (game().status === 'pending') {
            <p>Game has not started yet...</p>
          } @else {
            <span>Not pending, other status not yet implemented...</span>
          }
        </mat-card-content>
      </ng-content>
      <ng-content select="mat-card-actions" />
    </mat-card>
  `,
  styles: `
    mat-card-header {
      background-color: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);

      border-radius: 12px 12px 0 0;
      padding-bottom: 10px;

      ::ng-deep .mat-mdc-card-header-text {
        width: 100%;
      }
    }

    mat-card-subtitle {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .default-card-content {
      padding: 15px;
    }

    .score {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 24px;
    }

    .home-score {
      color: var(--mat-sys-primary);
    }

    .away-score {
      color: var(--mat-sys-primary);
    }
  `,
})
export class GameCardComponent {
  game = input.required<Game>();
}
