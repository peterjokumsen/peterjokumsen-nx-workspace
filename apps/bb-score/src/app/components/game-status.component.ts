import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { GameStore } from '../signal-store';
import { MatIcon } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-game-status',
  imports: [CommonModule, MatTableModule, MatIcon, MatExpansionModule],
  template: `
    <h3>Inning</h3>
    <p class="inning">
      <mat-icon>arrow_{{ frameIcon() }}</mat-icon>
      {{ inning() }}
    </p>
    <h3>Batter</h3>
    <p>{{ currentBatter() }}</p>
    <h3>Runners</h3>
    <table mat-table [dataSource]="runners()" class="mat-elevation-z8">
      @for (column of ['name', 'number', 'base']; track column) {
        <ng-container [matColumnDef]="column">
          <th mat-header-cell *matHeaderCellDef>{{ column }}</th>
          <td mat-cell *matCellDef="let element">{{ element[column] }}</td>
        </ng-container>
      }

      <tr mat-header-row *matHeaderRowDef="['name', 'number', 'base']"></tr>
      <tr
        mat-row
        *matRowDef="let row; columns: ['name', 'number', 'base']"
      ></tr>
    </table>
    <h3>Fielders</h3>
    <table mat-table [dataSource]="fielders()" class="mat-elevation-z8">
      @for (column of ['name', 'number', 'position']; track column) {
        <ng-container [matColumnDef]="column">
          <th mat-header-cell *matHeaderCellDef>{{ column }}</th>
          <td mat-cell *matCellDef="let element">{{ element[column] }}</td>
        </ng-container>
      }

      <tr mat-header-row *matHeaderRowDef="['name', 'number', 'position']"></tr>
      <tr
        mat-row
        *matRowDef="let row; columns: ['name', 'number', 'position']"
      ></tr>
    </table>
    <mat-expansion-panel>
      <mat-expansion-panel-header>Complete status</mat-expansion-panel-header>
      <pre><code>{{ gameStatus() | json }}</code></pre>
    </mat-expansion-panel>
  `,
  styles: `
    .inning {
      display: flex;
      align-items: center;
      gap: 1ch;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameStatusComponent {
  private _store = inject(GameStore);
  gameStatus = this._store.status;
  currentBatter = this._store.currentBatter;
  fielders = this._store.fieldingPlayers;
  runners = this._store.runners;
  inning = computed(() => this._store.status().inning);
  frameIcon = computed(() => {
    return this._store.status().frame === 'top' ? 'upward' : 'downward';
  });
}
