import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { GameService } from '../../core/services/game.service';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  template: `
    <div class="game-list-container">
      <div class="header">
        <h1>Available Games</h1>
        <button mat-raised-button color="primary" routerLink="new">
          <mat-icon>add</mat-icon>
          New Game
        </button>
      </div>

      <div class="games-grid">
        @for (game of games(); track game.id) {
          <mat-card class="game-card">
            <mat-card-header>
              <mat-card-title>{{ game.name }}</mat-card-title>
              <mat-card-subtitle>{{ game.date | date }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>{{ game.homeTeam }} vs {{ game.awayTeam }}</p>
              <p>Status: {{ game.status }}</p>
            </mat-card-content>
            <mat-card-actions>
              <button
                mat-button
                color="primary"
                [routerLink]="['score', game.id]"
              >
                Score Game
              </button>
            </mat-card-actions>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .game-list-container {
        padding: 20px;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      .games-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
      }
      .game-card {
        height: 100%;
      }
    `,
  ],
})
export class GameListComponent {
  private _gameService = inject(GameService);
  games = toSignal(this._gameService.games$);
}
