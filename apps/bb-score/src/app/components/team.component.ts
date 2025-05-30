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
          <th mat-header-cell *matHeaderCellDef>{{ column }}</th>
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
  displayedColumns: Array<keyof PlayerDetails> = [
    'name',
    'number',
    'position',
    'battingPosition',
    'strikes',
    'balls',
    'outs',
    'walks',
    'struckOut',
    'struckOutSwung',
    'walked',
    'walkedByHit',
    'earnedRuns',
    'homeRuns',
    'runs',
    'assists',
    'errors',
  ];
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
