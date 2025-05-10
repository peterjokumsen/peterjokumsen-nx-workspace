import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Lineup, Position } from '../models';

@Injectable()
export class LineupService {
  private _playerIdsUsed = new BehaviorSubject<string[]>([]);
  private _inUsePositions = new BehaviorSubject<Position[]>([]);
  disabledPositions$ = this._inUsePositions.asObservable();
  playerIdsUsed$ = this._playerIdsUsed.asObservable();

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

  updatePlayersUsed(lineup: Partial<Lineup>): void {
    const starterIds = (lineup?.starters
      ?.map((s) => s.playerId)
      .filter((pId) => !!pId) ?? []) as string[];
    const benchIds = (lineup?.bench
      ?.map((b) => b.playerId)
      .filter((pId) => !!pId) ?? []) as string[];
    this._playerIdsUsed.next([...starterIds, ...benchIds]);
  }
}
