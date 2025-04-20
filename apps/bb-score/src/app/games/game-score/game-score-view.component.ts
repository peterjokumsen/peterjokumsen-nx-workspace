import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game-score-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="score-container">
      @if (game(); as game) {
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
export class GameScoreViewComponent {
  private _gameService = inject(GameService);
  game = toSignal(this._gameService.selectedGame$);
}
