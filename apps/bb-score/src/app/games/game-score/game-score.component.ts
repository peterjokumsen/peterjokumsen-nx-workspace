import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { GameService } from '../game.service';
import { Game } from '../models';

@Component({
  selector: 'app-game-score',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  template: `
    <div class="score-container">
      @if (game(); as game) {
        <mat-card>
          <mat-card-header>
            <mat-card-title
              >{{ game.homeTeam }} vs {{ game.awayTeam }}</mat-card-title
            >
            <mat-card-subtitle
              >{{ game.league }} - {{ game.date | date }}</mat-card-subtitle
            >
          </mat-card-header>
          <mat-card-content>
            <div class="teams">
              <div class="team">
                <h2>{{ game.homeTeam }}</h2>
                <div class="score">0</div>
              </div>
              <div class="vs">VS</div>
              <div class="team">
                <h2>{{ game.awayTeam }}</h2>
                <div class="score">0</div>
              </div>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" routerLink="/games">
              Back to Games
            </button>
          </mat-card-actions>
        </mat-card>
      }
    </div>
  `,
  styles: [
    `
      .score-container {
        padding: 20px;
      }
      .teams {
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin: 20px 0;
      }
      .team {
        text-align: center;
      }
      .score {
        font-size: 2em;
        font-weight: bold;
        margin: 10px 0;
      }
      .vs {
        font-size: 1.5em;
        font-weight: bold;
      }
    `,
  ],
})
export class GameScoreComponent {
  private _route = inject(ActivatedRoute);
  private _gameService = inject(GameService);
  game = toSignal(
    this._route.params.pipe(
      map((params) => params['id']),
      switchMap((id) => this._gameService.getGame(id)),
      filter((game): game is Game => game !== null),
    ),
  );
}
