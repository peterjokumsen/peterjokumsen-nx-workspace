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
  template: `
    <div class="game-list-container">
      <div class="header">
        <h1>Available Games</h1>
        <button
          mat-raised-button
          color="primary"
          (click)="openCreateGameSheet()"
        >
          <mat-icon>add</mat-icon>
          New Game(s)
        </button>
      </div>

      <div class="filters">
        <mat-form-field>
          <mat-label>League</mat-label>
          <mat-select [formControl]="filters.controls.league">
            <mat-option [value]="''">All Leagues</mat-option>
            @for (league of uniqueLeagues(); track league) {
              <mat-option [value]="league">{{ league }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Team</mat-label>
          <mat-select [formControl]="filters.controls.team">
            <mat-option [value]="''">All Teams</mat-option>
            @for (team of uniqueTeams(); track team) {
              <mat-option [value]="team">{{ team }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Status</mat-label>
          <mat-select [formControl]="filters.controls.status">
            <mat-option [value]="''">All Statuses</mat-option>
            <mat-option value="pending">Pending</mat-option>
            <mat-option value="in-progress">In Progress</mat-option>
            <mat-option value="completed">Completed</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div class="filter-controls">
        <button
          mat-stroked-button
          (click)="clearFilters()"
          [disabled]="!filters.dirty"
        >
          <mat-icon>clear_all</mat-icon>
          Clear Filters
        </button>
      </div>

      <div class="games-grid" [@listAnimation]>
        @for (game of filteredGames(); track game.id) {
          <app-game-card [game]="game">
            <mat-card-actions>
              <button mat-raised-button [routerLink]="['score', game.id]">
                Score Game
              </button>
            </mat-card-actions>
          </app-game-card>
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

      .filters {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
      }

      .filter-controls {
        display: flex;
        flex-direction: row-reverse;
        gap: 16px;
        margin-bottom: 20px;
      }

      .filters mat-form-field {
        flex: 1;
        min-width: 200px;
      }

      .games-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
      }
    `,
  ],
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

  games = toSignal(this._gameService.games$);

  filters = this._fb.group({
    league: [''],
    team: [''],
    status: [''],
  });

  get isFiltered(): boolean {
    return (
      !this.filters.dirty &&
      !!(
        this.filters.value.league ||
        this.filters.value.team ||
        this.filters.value.status
      )
    );
  }

  uniqueLeagues = toSignal(
    this._gameService.games$.pipe(
      map((games) => [...new Set(games.map((g) => g.league))]),
    ),
  );

  uniqueTeams = toSignal(
    this._gameService.games$.pipe(
      map((games) => [
        ...new Set(games.flatMap((g) => [g.homeTeam, g.awayTeam])),
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
            game.homeTeam !== filters.team &&
            game.awayTeam !== filters.team
          )
            return false;
          if (filters.status && game.status !== filters.status) return false;
          return true;
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
}
