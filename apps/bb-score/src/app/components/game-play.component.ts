import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { firstValueFrom } from 'rxjs';
import { HitAction, PitchAction, PlayerIdentifier } from '../models';
import { GameStore } from '../signal-store';
import { DidTheySwingComponent } from './did-they-swing.component';
import { GameActionsComponent } from './game-actions.component';
import { InningInfoComponent } from './inning-info.component';

@Component({
  selector: 'app-game-play',
  imports: [
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
        <div class="group">
          <h4>Pitching</h4>
          <button mat-button (click)="onPitch('strike')">Strike</button>
          <button mat-button (click)="onPitch('ball')">Ball</button>
          <button mat-button (click)="onPitch('batter-hit')">Batter hit</button>
          @if (hasRunners()) {
            <button mat-button (click)="onPitch('balk')">Balk</button>
          }
        </div>
        <div class="group">
          <h4>Batting</h4>
          <button mat-button (click)="onPitch('hit')">Hit</button>
          @if (liveBall()) {
            <h5>Where did the ball go?</h5>
            <button mat-button (click)="onHit('foul')">Foul</button>
          }
        </div>
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
    }

    @media (min-width: 768px) {
      :host {
        grid-template-columns: 1fr 1fr;

        .action-history {
          grid-column: 1 / -1;
        }
      }

      .action-history {
        grid-column: 1 / -1;
      }
    }

    .inning-details {
      padding: 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePlayComponent {
  private _bottomSheet = inject(MatBottomSheet);
  private _store = inject(GameStore);
  private _isNextStrikeThird = computed(
    () => this._store.status().strikes === 2,
  );
  liveBall = computed(() => this._store.status().ballState !== 'dead');
  hasRunners = computed(() => {
    const runners = this._store.status().currentRunners;
    console.log(
      'runners',
      Object.entries(runners)
        .map(([k, v]) => `${k} => ${v.id}`)
        .join(', '),
    );
    return !!runners['1B'] || !!runners['2B'] || !!runners['3B'];
  });

  async onPitch(pitch: PitchAction['type']) {
    if (pitch === 'strike' && this._isNextStrikeThird()) {
      const instance = this._bottomSheet.open(DidTheySwingComponent);
      const swung = await firstValueFrom(instance.afterDismissed());
      this._store.update({
        type: pitch,
        swung,
        pitcher: this._store.currentPitcher(),
        batter: this._store.currentBatter(),
      });
      return;
    }

    this._store.update({
      type: pitch,
      pitcher: this._store.currentPitcher(),
      batter: this._store.currentBatter(),
    });
  }

  onHit(hit: HitAction['type'], fielder?: PlayerIdentifier) {
    this._store.update({
      batter: this._store.currentBatter(),
      type: hit,
      fielder,
    });
  }
}
