import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { GameStore } from '../signal-store';

@Component({
  selector: 'app-game-status',
  imports: [CommonModule, MatTableModule, MatIcon, MatExpansionModule],
  template: `
    <mat-expansion-panel>
      <mat-expansion-panel-header>
        <mat-panel-title>Inning</mat-panel-title>
        <mat-panel-description>
          <mat-icon>arrow_{{ frameIcon() }}</mat-icon>
          {{ inning() }}
        </mat-panel-description>
      </mat-expansion-panel-header>
      <p class="inning"></p>
    </mat-expansion-panel>

    <mat-expansion-panel>
      <mat-expansion-panel-header>
        <mat-panel-title>Batting</mat-panel-title>
        <mat-panel-description>{{ currentBatter() }}</mat-panel-description>
      </mat-expansion-panel-header>
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
    </mat-expansion-panel>

    <mat-expansion-panel>
      <mat-expansion-panel-header>
        <mat-panel-title>Fielding</mat-panel-title>
      </mat-expansion-panel-header>
      <table mat-table [dataSource]="fielders()" class="mat-elevation-z8">
        @for (column of ['name', 'number', 'position']; track column) {
          <ng-container [matColumnDef]="column">
            <th mat-header-cell *matHeaderCellDef>{{ column }}</th>
            <td mat-cell *matCellDef="let element">{{ element[column] }}</td>
          </ng-container>
        }

        <tr
          mat-header-row
          *matHeaderRowDef="['name', 'number', 'position']"
        ></tr>
        <tr
          mat-row
          *matRowDef="let row; columns: ['name', 'number', 'position']"
        ></tr>
      </table>
    </mat-expansion-panel>
    <mat-expansion-panel>
      <mat-expansion-panel-header>
        <mat-panel-title>Raw game</mat-panel-title>
        <mat-panel-description>Complete game object</mat-panel-description>
      </mat-expansion-panel-header>
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
  currentBatter = computed(() => this._store.currentBatter()?.name);
  fielders = this._store.fieldingPlayers;
  runners = this._store.runners;
  inning = computed(() => this._store.status().inning);
  frameIcon = computed(() => {
    return this._store.status().frame === 'top' ? 'upward' : 'downward';
  });
}
