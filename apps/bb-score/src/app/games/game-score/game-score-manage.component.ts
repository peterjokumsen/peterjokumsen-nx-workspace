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
  templateUrl: './game-score-manage.component.html',
  styleUrl: './game-score-manage.component.scss',
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
