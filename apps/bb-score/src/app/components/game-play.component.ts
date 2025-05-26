import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { GameStore } from '../signal-store';
import { GameAction } from '../models';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-game-play',
  imports: [CommonModule, MatButton, MatCardModule],
  template: `
    <mat-card class="initial-card" appearance="outlined">
      <mat-card-header>
        <mat-card-title>Pitching</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <button mat-button (click)="onStrike()">Strike</button>
      </mat-card-content>
    </mat-card>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePlayComponent {
  private _store = inject(GameStore);

  onStrike(): void {
    this._store.update({
      type: 'strike',
      pitcher: this._store.currentPitcher(),
      batter: this._store.currentBatter(),
    });
  }
}
