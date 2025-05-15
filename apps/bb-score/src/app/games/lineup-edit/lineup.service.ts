import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, map } from 'rxjs';
import { GamePlayer, Lineup, Position, StartingPlayer } from '../models';

@Injectable()
export class LineupService {
  private _fb = inject(FormBuilder);
  private _currentLineupSubject = new BehaviorSubject<Lineup | null>(null);
  private _currentLineup$ = this._currentLineupSubject.asObservable();
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

  lineupForm = this._fb.group({
    starters: this._fb.array(
      this.fieldPositions.map(() => this.createStarterPlayerFormGroup()),
    ),
    bench: this._fb.array([this.createPlayerFormGroup()]),
  });

  private createPlayerLookup(
    value: Position,
    label: string,
    positionNumber: number,
  ) {
    return { value, label, positionNumber };
  }

  createStarterPlayerFormGroup(init?: StartingPlayer) {
    return this._fb.group({
      playerId: [init?.playerId ?? ''],
      playerNumber: [init?.playerNumber, Validators.required],
      position: [init?.position, Validators.required],
    });
  }

  createPlayerFormGroup(init?: GamePlayer) {
    return this._fb.group({
      playerId: [init?.playerId ?? ''],
      playerNumber: [init?.playerNumber, Validators.required],
    });
  }

  populateLineupForm(lineup?: Lineup): void {
    lineup = lineup ?? { starters: [], bench: [] };
    this._currentLineupSubject.next(lineup);

    const startingPlayers = this.fieldPositions.map(
      (_, i) => lineup?.starters[i] ?? {},
    );
    this.lineupForm.controls.starters.patchValue(startingPlayers, {
      emitEvent: false,
    });

    // clear and populate bench
    this.lineupForm.controls.bench.clear({ emitEvent: false });
    for (const bp of lineup.bench) {
      this.lineupForm.controls.bench.push(this.createPlayerFormGroup(bp), {
        emitEvent: false,
      });
    }

    // Add empty bench slots if needed to reach 6
    const currentBenchCount = this.lineupForm.controls.bench.length;
    for (let i = currentBenchCount; i < 6; i++) {
      this.lineupForm.controls.bench.push(this.createPlayerFormGroup(), {
        emitEvent: false,
      });
    }
  }
}

export type StarterFormGroup = ReturnType<
  LineupService['createStarterPlayerFormGroup']
>;
export type BenchFormGroup = ReturnType<LineupService['createPlayerFormGroup']>;
