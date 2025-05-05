import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { Team, TeamService } from '../../teams';
import { GameService } from '../game.service';
import { LineupEditComponent } from '../lineup-edit/lineup-edit.component';
import { Lineup } from '../models';

@Component({
  selector: 'app-game-score-manage',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    MatBottomSheetModule,
    MatSnackBarModule,
    LineupEditComponent,
  ],
  template: `
    <div class="game-lineup-container">
      <h2>Game Lineup</h2>

      <mat-tab-group (selectedIndexChange)="onTeamTabChange($event)">
        <mat-tab label="Home Team">
          <app-lineup-edit
            [team]="currentTeam$ | async"
            [lineup]="homeLineup()"
            (saveLineup)="saveLineup($event)"
          >
          </app-lineup-edit>
        </mat-tab>

        <mat-tab label="Away Team">
          <app-lineup-edit
            [team]="currentTeam$ | async"
            [lineup]="awayLineup()"
            (saveLineup)="saveLineup($event)"
          >
          </app-lineup-edit>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: `
    .game-lineup-container {
      padding: 16px;
      max-width: 800px;
      margin: 0 auto;
    }

    .team-info {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
    }

    .team-card {
      flex: 1;
      padding: 16px;
      border-radius: 8px;
      background-color: #f5f5f5;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .team-card h3 {
      margin-top: 0;
      color: #555;
    }

    .team-card p {
      font-size: 18px;
      font-weight: 500;
      margin-bottom: 0;
    }
  `,
})
export class GameScoreManageComponent implements OnInit {
  private _teamService = inject(TeamService);
  private _gameService = inject(GameService);
  private _snackBar = inject(MatSnackBar);
  private _currentTeamIdSubject = new BehaviorSubject<string | null>(null);
  private _game = toSignal(this._gameService.selectedGame$);

  homeTeamId = computed(() => this._game()?.homeTeamId ?? '');
  awayTeamId = computed(() => this._game()?.awayTeamId ?? '');
  homeTeamName = computed(() => this._game()?.homeTeamName ?? '');
  awayTeamName = computed(() => this._game()?.awayTeamName ?? '');
  homeLineup = computed(() => this._game()?.homeLineup);
  awayLineup = computed(() => this._game()?.awayLineup);

  currentTeam$: Observable<Team | null> = this._currentTeamIdSubject.pipe(
    switchMap((teamId) => {
      if (!teamId) return of(null);
      return this._teamService.getTeam(teamId);
    }),
  );

  ngOnInit() {
    this._currentTeamIdSubject.next(this.homeTeamId());
  }

  onTeamTabChange(index: number): void {
    // Switch between home and away team
    if (index === 0 && this.homeTeamId()) {
      this._currentTeamIdSubject.next(this.homeTeamId());
    } else if (index === 1 && this.awayTeamId()) {
      this._currentTeamIdSubject.next(this.awayTeamId());
    }
  }

  saveLineup(lineupData: Lineup | null): void {
    const game = this._game();
    if (!game) {
      this._snackBar.open('No game selected', 'Close', {
        duration: 3000,
      });
      return;
    }

    // Determine if we're saving home or away lineup based on the current team
    const currentTeamId = this._currentTeamIdSubject.value;
    const isHomeTeam = currentTeamId === game.homeTeamId;

    // Create a copy of the game to update
    const updatedGame = { ...game };

    // Update the appropriate lineup
    if (isHomeTeam) {
      updatedGame.homeLineup = lineupData ?? undefined;
    } else {
      updatedGame.awayLineup = lineupData ?? undefined;
    }

    // Save the updated game
    this._gameService.updateGame(updatedGame);

    // Show success message
    const teamType = isHomeTeam ? 'Home' : 'Away';
    this._snackBar.open(`${teamType} team lineup saved successfully`, 'Close', {
      duration: 3000,
    });
  }
}
