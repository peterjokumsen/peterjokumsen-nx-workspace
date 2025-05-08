import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { map, startWith, switchMap } from 'rxjs/operators';
import { GameCardComponent } from '../game-card/game-card.component';
import { GameCreateComponent } from '../game-create/game-create.component';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    RouterModule,
    ReactiveFormsModule,
    GameCardComponent,
    MatBottomSheetModule,
  ],
  templateUrl: './game-list.component.html',
  styleUrl: 'game-list.component.scss',
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            stagger(100, [
              animate(
                '0.3s ease-out',
                style({ opacity: 1, transform: 'translateY(0)' }),
              ),
            ]),
          ],
          { optional: true },
        ),
      ]),
    ]),
  ],
})
export class GameListComponent {
  private _gameService = inject(GameService);
  private _fb = inject(FormBuilder);
  private _bottomSheet = inject(MatBottomSheet);

  games = toSignal(this._gameService.getGames());

  filters = this._fb.group({
    league: [''],
    team: [''],
    status: [''],
  });

  uniqueLeagues = toSignal(
    this._gameService.games$.pipe(
      map((games) => [...new Set(games.map((g) => g.league))]),
    ),
  );

  uniqueTeams = toSignal(
    this._gameService.games$.pipe(
      map((games) => [
        ...new Set(games.flatMap((g) => [g.homeTeamName, g.awayTeamName])),
      ]),
    ),
  );

  filteredGames = toSignal(
    this._gameService.games$.pipe(
      switchMap((games) =>
        this.filters.valueChanges.pipe(
          startWith(this.filters.getRawValue()),
          map((filters) => ({ games, filters })),
        ),
      ),
      map(({ games, filters }) => {
        return games.filter((game) => {
          if (filters.league && game.league !== filters.league) return false;
          if (
            filters.team &&
            game.homeTeamName !== filters.team &&
            game.awayTeamName !== filters.team
          ) {
            return false;
          }

          return !(filters.status && game.status !== filters.status);
        });
      }),
    ),
  );

  clearFilters(): void {
    this.filters.reset({
      league: '',
      team: '',
      status: '',
    });
  }

  openCreateGameSheet(): void {
    this._bottomSheet.open(GameCreateComponent);
  }

  deleteGame(gameId: string): void {
    if (!confirm('Are you sure you want to delete this game?')) return;
    this._gameService.deleteGame(gameId);
  }
}
