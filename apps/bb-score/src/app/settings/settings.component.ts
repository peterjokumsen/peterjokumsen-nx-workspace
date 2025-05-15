import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { GameService } from '../games/game.service';
import { TeamService } from '../teams';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatIcon, MatButton],
  template: `
    <h2>Settings</h2>
    <p>Configure your application settings here.</p>
    <button mat-button (click)="reset()">
      <mat-icon>delete</mat-icon> Reset all
    </button>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 1rem;
      }
    `,
  ],
})
export class SettingsComponent {
  private _gameService = inject(GameService);
  private _teamService = inject(TeamService);

  reset() {
    if (
      !confirm(
        'Are you sure you want to reset all data? This cannot be undone.',
      )
    )
      return;
    this._gameService.resetGames();
    this._teamService.resetTeams();
  }
}
