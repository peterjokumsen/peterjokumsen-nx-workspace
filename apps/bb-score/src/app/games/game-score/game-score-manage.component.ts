import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { Team } from '../../teams';
import { GameService } from '../game.service';
import { LineupEditComponent } from '../lineup-edit/lineup-edit.component';
import { Lineup, StartingPlayer } from '../models';

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
    MatExpansionModule,
  ],
  templateUrl: './game-score-manage.component.html',
  styleUrl: './game-score-manage.component.scss',
})
export class GameScoreManageComponent implements OnInit {
  private _gameService = inject(GameService);
  private _snackBar = inject(MatSnackBar);
  private _currentTeam: 'home' | 'away' = 'home';

  game = toSignal(this._gameService.selectedGame$);
  homeTeamId = computed(() => this.game()?.homeTeamId ?? '');
  homeTeamName = computed(() => this.game()?.homeTeamName ?? '');
  homeLineup = computed(() => this.game()?.homeLineup);

  awayTeamId = computed(() => this.game()?.awayTeamId ?? '');
  awayTeamName = computed(() => this.game()?.awayTeamName ?? '');
  awayLineup = computed(() => this.game()?.awayLineup);
  expandLineup = false;

  missingStarters = computed(() => {
    const home = this.getValid(this.game()?.homeLineup?.starters);
    const away = this.getValid(this.game()?.awayLineup?.starters);
    if (home.length === 9 && away.length === 9) return '';
    const messages = [
      home.length !== 9 ? 'home' : null,
      away.length !== 9 ? 'away' : null,
    ].filter((m) => m);
    const prefix = messages.join(' & ');
    return `, ${prefix} team${messages.length > 1 ? 's are' : ' is'} missing starting players`;
  });

  private getValid(starters: StartingPlayer[] | undefined): StartingPlayer[] {
    return (
      starters?.filter((s) => s.position && s.playerId && s.playerNumber) ?? []
    );
  }

  private getTeam(id: string | null, teams: Team[] | undefined): Team | null {
    if (!id || !teams) return null;
    return teams.find((t) => t.id === id) ?? null;
  }

  ngOnInit() {
    if (this.missingStarters()) this.expandLineup = true;
  }

  onTeamTabChange(index: number): void {
    // Switch between home and away team
    if (index === 0 && this.homeTeamId()) {
      this._currentTeam = 'home';
    } else if (index === 1 && this.awayTeamId()) {
      this._currentTeam = 'away';
    }
  }

  saveLineup(lineupData: Lineup | null, hideMessage = false): void {
    const game = this.game();
    if (!game) {
      if (hideMessage) return;
      this._snackBar.open('No game selected', 'Close', {
        duration: 3000,
      });
      return;
    }

    const isHomeTeam = this._currentTeam === 'home';
    const updatedGame = { ...game };

    // Update the appropriate lineup
    if (isHomeTeam) {
      updatedGame.homeLineup = lineupData ?? undefined;
    } else {
      updatedGame.awayLineup = lineupData ?? undefined;
    }

    // Save the updated game
    this._gameService.updateGame(updatedGame);
    if (hideMessage) {
      return;
    }

    // Show success message
    const teamType = isHomeTeam ? 'Home' : 'Away';
    this._snackBar.open(`${teamType} team lineup saved successfully`, 'Close', {
      duration: 3000,
    });
  }
}
