import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { GameAction, GameActionKeys, PlayerIdentifier } from '../models';
import { GameStore } from '../signal-store';

@Component({
  selector: 'app-game-actions',
  imports: [CommonModule, MatTableModule],
  template: `
    @let data = dataSource();
    @if (data.length > 0) {
      <table mat-table [dataSource]="data" class="mat-elevation-z8 demo-table">
        @for (column of columns; track column) {
          <ng-container [matColumnDef]="column">
            <th mat-header-cell *matHeaderCellDef>{{ columnNames[column] }}</th>
            <td mat-cell *matCellDef="let element">
              {{ getValue(element, column) }}
            </td>
          </ng-container>
        }

        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns"></tr>
      </table>
    } @else {
      <p>No actions</p>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameActionsComponent {
  private _store = inject(GameStore);
  columnNames: Record<GameActionKeys, string> = {
    type: 'Type',
    adjustment: 'Adjustment',
    base: 'Base',
    batter: 'Batter',
    endFielder: 'End Fielder',
    fielder: 'Fielder',
    newPlayer: 'New Player',
    oldPlayer: 'Old Player',
    pitcher: 'Pitcher',
    positions: 'Positions',
    result: 'Result',
    runner: 'Runner',
    startingFielder: 'Starting Fielder',
    swung: 'Swung',
    team: 'Team',
  };
  columns = Object.keys(this.columnNames) as Array<GameActionKeys>;

  dataSource = this._store.status.actions;

  private getPlayerName(identifier?: PlayerIdentifier): string {
    if (!identifier) return '';
    return this._store.players()[identifier.id].name;
  }

  getValue(entity: GameAction, key: GameActionKeys): string {
    switch (key) {
      case 'type':
        return entity[key];
      case 'swung':
        if (key in entity) return entity[key] ? 'Yes' : 'No';
        return '';
      case 'pitcher':
        if (key in entity) return this.getPlayerName(entity[key]);
        return '';
      case 'batter':
        if (key in entity) return this.getPlayerName(entity[key]);
        return '';
      case 'fielder':
        if (key in entity) return this.getPlayerName(entity[key]);
        return '';
      case 'startingFielder':
        if (key in entity) return this.getPlayerName(entity[key]);
        return '';
      case 'endFielder':
        if (key in entity) return this.getPlayerName(entity[key]);
        return '';
      case 'result':
        if (key in entity) {
          const val = entity[key];
          if (!val?.runnerOut) return 'Safe';
          return `${this.getPlayerName(val.runnerOut)} Out`;
        }
        return '';
      case 'runner':
        if (key in entity) return this.getPlayerName(entity[key]);
        return '';
      case 'base':
        if (key in entity) return entity[key];
        return '';
      case 'team':
        if (key in entity) return entity[key];
        return '';
      case 'newPlayer':
        if (key in entity) return this.getPlayerName(entity[key]);
        return '';
      case 'oldPlayer':
        if (key in entity) return this.getPlayerName(entity[key]);
        return '';
      case 'positions':
        if (key in entity) return entity[key].join(' <-> ');
        return '';
      case 'adjustment':
        if (key in entity) return entity[key];
        return '';
    }
  }
}
