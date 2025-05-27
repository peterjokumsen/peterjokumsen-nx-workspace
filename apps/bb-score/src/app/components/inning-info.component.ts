import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { map } from 'rxjs';
import { InningDetails } from '../models';
import { GameStore } from '../signal-store';

@Component({
  selector: 'app-inning-info',
  imports: [CommonModule, MatTableModule, MatIcon],
  template: `
    <table mat-table [dataSource]="dataSource()" class="mat-elevation-z8">
      <ng-container matColumnDef="inning">
        <th mat-header-cell *matHeaderCellDef>Inning</th>
        <td mat-cell *matCellDef="let element">{{ element.inning }}</td>
      </ng-container>

      <ng-container matColumnDef="frame">
        <th mat-header-cell *matHeaderCellDef>Frame</th>
        <td mat-cell *matCellDef="let element">
          <mat-icon>
            @switch (element.frame) {
              @case ('top') {
                arrow_upward
              }
              @case ('bottom') {
                arrow_downward
              }
            }
          </mat-icon>
        </td>
      </ng-container>

      <ng-container matColumnDef="outs">
        <th mat-header-cell *matHeaderCellDef>Outs</th>
        <td mat-cell *matCellDef="let element">{{ element.outs }}</td>
      </ng-container>

      <ng-container matColumnDef="strikes">
        <th mat-header-cell *matHeaderCellDef>Strikes</th>
        <td mat-cell *matCellDef="let element">{{ element.strikes }}</td>
      </ng-container>

      <ng-container matColumnDef="balls">
        <th mat-header-cell *matHeaderCellDef>Balls</th>
        <td mat-cell *matCellDef="let element">{{ element.balls }}</td>
      </ng-container>

      <ng-container matColumnDef="pitcher">
        <th mat-header-cell *matHeaderCellDef>Pitching</th>
        <td mat-cell *matCellDef="let element">
          @let pitcher = element.pitcher;
          @if (pitcher) {
            @if (isLarge()) {
              {{ pitcher.name }}
            }
            #{{ pitcher.number }}
          }
        </td>
      </ng-container>

      <ng-container matColumnDef="batter">
        <th mat-header-cell *matHeaderCellDef>Batting</th>
        <td mat-cell *matCellDef="let element">
          @let batter = element.batter;
          @if (batter) {
            @if (isLarge()) {
              {{ batter.name }}
            }
            #{{ batter.number }}
          }
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  styles: `
    th,
    td {
      text-align: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InningInfoComponent {
  private _store = inject(GameStore);
  private _breakpoint = inject(BreakpointObserver);

  isLarge = toSignal(
    this._breakpoint
      .observe('(min-width: 1000px)')
      .pipe(map((result) => result.matches)),
  );

  displayedColumns: Array<keyof InningDetails> = [
    'inning',
    'frame',
    'outs',
    'strikes',
    'balls',
    'pitcher',
    'batter',
  ];
  dataSource = computed(() => [this._store.inningDetails()]);
}
