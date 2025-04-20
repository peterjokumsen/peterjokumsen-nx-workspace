import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardActions, MatCardContent } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { GameCardComponent } from '../game-card/game-card.component';
import { GameService } from '../game.service';
import { Game } from '../models';

@Component({
  selector: 'app-game-score-container',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    GameCardComponent,
    MatCardContent,
    MatCardActions,
  ],
  template: `
    @if (game(); as game) {
      <app-game-card [game]="game">
        <mat-card-content>
          <div class="content">
            <router-outlet></router-outlet>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <a
            mat-button
            routerLink="."
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            View
          </a>
          <a mat-button routerLink="score" routerLinkActive="active">Score</a>
          <a mat-button routerLink="manage" routerLinkActive="active">Manage</a>
          <a mat-button routerLink="/games">
            <mat-icon>arrow_back</mat-icon>
            Back to Games
          </a>
        </mat-card-actions>
      </app-game-card>
    }
  `,
  styles: [
    `
      mat-card-actions {
        gap: 10px;
      }

      a.active {
        color: var(--mat-sys-on-primary);
        background-color: var(--mat-sys-primary);
      }

      .content {
        padding: 10px 0;
      }
    `,
  ],
})
export class GameScoreContainerComponent {
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
