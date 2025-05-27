import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GameStore } from '../signal-store';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { InningInfoComponent } from './inning-info.component';

@Component({
  selector: 'app-game-play',
  imports: [CommonModule, MatButton, MatCardModule, InningInfoComponent],
  template: `
    <mat-card class="inning-details" appearance="outlined">
      <app-inning-info />
    </mat-card>
    <mat-card class="game-controls" appearance="outlined">
      <mat-card-content>
        <button mat-button (click)="onStrike()">Strike</button>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    :host {
      display: grid;
      gap: 10px;
      grid-template-columns: 1fr;

      @media (min-width: 768px) {
        grid-template-columns: 1fr 1fr;
      }
    }

    .inning-details {
      padding: 1rem;
    }
  `,
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
