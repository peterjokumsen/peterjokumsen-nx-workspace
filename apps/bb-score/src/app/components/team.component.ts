import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import {
  BattingPosition,
  GamePosition,
  GameTeam,
  PlayerIdentifier,
  PlayerWithStats,
} from '../models';
import { GameStore } from '../signal-store';

type PlayerDetails = PlayerWithStats & {
  position?: GamePosition;
  battingPosition?: BattingPosition;
};

@Component({
  selector: 'app-team',
  imports: [CommonModule, MatTableModule],
  template: `
    <h2>{{ side() }}</h2>
    <table mat-table [dataSource]="players()" class="mat-elevation-z8">
      @for (column of displayedColumns; track column) {
        <ng-container [matColumnDef]="column">
          <th mat-header-cell *matHeaderCellDef>
            {{ columnDescription[column] }}
          </th>
          <td mat-cell *matCellDef="let element">{{ element[column] }}</td>
        </ng-container>
      }

      <tr mat-header-row *matHeaderRowDef="columnsToDisplay"></tr>
      <tr mat-row *matRowDef="let row; columns: columnsToDisplay"></tr>
    </table>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamComponent {
  private _store = inject(GameStore);
  columnDescription: Record<keyof PlayerDetails, string> = {
    id: 'ID',
    number: '#',
    name: 'Name',
    position: 'Position',
    battingPosition: 'Batting position',
    hits: 'Hits',
    errors: 'Errors',
    homeRuns: 'Home runs',
    runs: 'Runs',
    earnedRuns: 'Earned runs',
    strikes: 'Strikes',
    balls: 'Balls',
    balks: 'Balks',
    walks: 'Walks',
    fouls: 'Fouls',
    walked: 'Walked',
    walkedByHit: 'Hit by pitch',
    struckOut: 'K',
    struckOutSwung: 'ꓘ',
    outs: 'Outs',
    assists: 'Assists',
  };
  displayedColumns = (
    Object.keys(this.columnDescription) as Array<keyof PlayerDetails>
  ).filter((k) => this.columnDescription[k] !== '');
  columnsToDisplay: string[] = this.displayedColumns.slice();

  side = input.required<GameTeam>();

  players = computed<PlayerDetails[]>(() => {
    const lineup = this._store.game()[this.side()];
    return Object.entries(lineup.players).reduce((all, [id, player]) => {
      const position = this.getValue(id, lineup.positions);
      const battingPosition = this.getValue(id, lineup.battingOrder);
      all.push({ ...player, position, battingPosition });
      return all;
    }, [] as PlayerDetails[]);
  });

  private getValue<T extends BattingPosition | GamePosition>(
    id: string,
    record: Record<T, PlayerIdentifier>,
  ): T | undefined {
    return Object.entries(record).find(
      ([, value]) => (value as PlayerIdentifier)?.id === id,
    )?.[0] as T;
  }
}
