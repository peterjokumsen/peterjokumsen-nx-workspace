import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, switchMap } from 'rxjs';
import { GameService } from '../game.service';
import { Position } from '../models';

@Injectable()
export class LineupService {
  private _gameService = inject(GameService);
  private _currentSide = new BehaviorSubject<'home' | 'away'>('home');
  private _currentLineup$ = this._currentSide.pipe(
    switchMap((side) =>
      this._gameService.selectedGame$.pipe(
        map((game) => game?.[`${side}Lineup`]),
      ),
    ),
  );
  disabledPositions$ = this._currentLineup$.pipe(
    map((lineup) => {
      const positions = lineup?.starters?.map((s) => s.position) ?? [];
      return (positions.filter((p) => !!p) as Position[]) ?? [];
    }),
  );
  playerIdsUsed$ = this._currentLineup$.pipe(
    map((lineup) => {
      const starterIds = (lineup?.starters
        ?.map((s) => s.playerId)
        .filter((pId) => !!pId) ?? []) as string[];
      const benchIds = (lineup?.bench
        ?.map((b) => b.playerId)
        .filter((pId) => !!pId) ?? []) as string[];
      return [...starterIds, ...benchIds];
    }),
  );

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

  sideChanged(side: 'home' | 'away'): void {
    this._currentSide.next(side);
  }
}
