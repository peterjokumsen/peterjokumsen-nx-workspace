import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Position } from '../models';

@Injectable()
export class LineupService {
  private _inUsePositions = new BehaviorSubject<Position[]>([]);
  disabledPositions$ = this._inUsePositions.asObservable();

  readonly fieldPositions: Array<{
    value: Position;
    label: string;
    positionNumber: number;
  }> = [
    this.createPlayerLookup('P', 'Pitcher', 1),
    this.createPlayerLookup('C', 'Catcher', 2),
    this.createPlayerLookup('1', '1st Base', 3),
    this.createPlayerLookup('2', '2nd Base', 4),
    this.createPlayerLookup('3', '3rd Base', 5),
    this.createPlayerLookup('SS', 'Shortstop', 6),
    this.createPlayerLookup('LF', 'Left Field', 7),
    this.createPlayerLookup('CF', 'Center Field', 8),
    this.createPlayerLookup('RF', 'Right Field', 9),
  ];

  private createPlayerLookup(
    value: Position,
    label: string,
    positionNumber: number,
  ) {
    return { value, label, positionNumber };
  }

  updateDisabledPositions(positions: Position[]): void {
    this._inUsePositions.next(positions);
  }
}
