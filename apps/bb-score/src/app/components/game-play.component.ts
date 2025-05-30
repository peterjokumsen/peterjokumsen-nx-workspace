import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { GameStore } from '../signal-store';
import { GameActionsComponent } from './game-actions.component';
import { InningInfoComponent } from './inning-info.component';

@Component({
  selector: 'app-game-play',
  imports: [
    CommonModule,
    GameActionsComponent,
    MatButton,
    MatCardModule,
    InningInfoComponent,
    MatExpansionModule,
  ],
  template: `
    <mat-card class="inning-details" appearance="outlined">
      <app-inning-info />
    </mat-card>
    <mat-card class="game-controls" appearance="outlined">
      <mat-card-content>
        <button mat-button (click)="onPitch('strike')">Strike</button>
        <button mat-button (click)="onPitch('ball')">Ball</button>
      </mat-card-content>
    </mat-card>
    <mat-expansion-panel class="action-history">
      <mat-expansion-panel-header> Action history </mat-expansion-panel-header>
      <app-game-actions />
    </mat-expansion-panel>
  `,
  styles: `
    :host {
      display: grid;
      gap: 10px;
      grid-template-columns: 1fr;

      @media (min-width: 768px) {
        grid-template-columns: 1fr 1fr;

        .action-history {
          grid-column: 1 / -1;
        }
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

  onPitch(pitch: 'strike' | 'ball') {
    this._store.update({
      type: pitch,
      pitcher: this._store.currentPitcher(),
      batter: this._store.currentBatter(),
    });
  }
}
