import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
} from 'rxjs';
import { startWith } from 'rxjs/operators';
import { Team } from '../../teams';
import { GamePlayer, Lineup, Position, StartingPlayer } from '../models';
import { LineupService } from './lineup.service';
import { PlayerSelectComponent } from './player-select/player-select.component';

@Component({
  selector: 'app-lineup-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatBottomSheetModule,
    PlayerSelectComponent,
  ],
  providers: [LineupService],
  templateUrl: './lineup-edit.component.html',
  styleUrl: './lineup-edit.component.scss',
})
export class LineupEditComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _fb = inject(FormBuilder);
  private _lineupSvc = inject(LineupService);
  private _lineup: Lineup | undefined;

  currentTeam = signal<Team | null>(null);

  @Input() set team(value: Team | null) {
    const current = this.currentTeam();
    if (current?.id === value?.id) return;

    this.currentTeam.update(() => value);
    this.populateLineupForm();
  }

  @Input() set lineup(value: Lineup | undefined) {
    this._lineup = value;
    if (value && this.currentTeam()) {
      this.populateLineupForm(value);
    }
  }

  @Output() saveLineup = new EventEmitter<Lineup>();
  @Output() lineupUpdate = new EventEmitter<Lineup>();

  lineupForm = this._fb.group({
    starters: this._fb.array(
      this._lineupSvc.fieldPositions.map(() =>
        this.createStarterPlayerFormGroup(),
      ),
    ),
    bench: this._fb.array([this.createPlayerFormGroup()]),
  });

  get starterFormGroups(): Array<
    ReturnType<LineupEditComponent['createStarterPlayerFormGroup']>
  > {
    const arr = this.lineupForm.get('starters') as FormArray;
    return arr.controls as FormGroup[];
  }

  get benchFormGroups(): FormGroup[] {
    const arr = this.lineupForm.get('bench') as FormArray;
    return arr.controls as FormGroup[];
  }

  private subscribeToSaveValueChanges(): void {
    this.lineupForm.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef), debounceTime(500))
      .subscribe((value) => {
        console.log('lineupUpdate', value);
        this.lineupUpdate.emit(value as Lineup);
      });
  }

  ngOnInit(): void {
    const positionValueChanges: Observable<Position | null>[] = [];
    for (const ctrl of this.starterFormGroups.map((c) => c.controls.position)) {
      positionValueChanges.push(
        ctrl.valueChanges.pipe(
          startWith(ctrl.value),
          map((v) => v ?? null),
          distinctUntilChanged(),
        ),
      );
    }

    combineLatest(positionValueChanges)
      .pipe(takeUntilDestroyed(this._destroyRef), debounceTime(10))
      .subscribe((positions) => {
        this._lineupSvc.updateDisabledPositions(positions.filter((p) => !!p));
      });

    this.subscribeToSaveValueChanges();
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

  onSaveLineup(): void {
    this.saveLineup.emit(this.lineupForm.value as Lineup);
  }

  populateLineupForm(lineup?: Lineup): void {
    lineup = lineup ?? this._lineup;

    const startingPlayers = this._lineupSvc.fieldPositions.map(
      (_, i) => lineup?.starters[i] ?? {},
    );
    this.lineupForm.controls.starters.patchValue(startingPlayers);

    // clear and populate bench
    this.lineupForm.controls.bench.clear();
    if (Array.isArray(lineup?.bench)) {
      lineup.bench.forEach((benchPlayer) => {
        this.lineupForm.controls.bench.push(
          this.createPlayerFormGroup(benchPlayer),
        );
      });
    }

    // Add empty bench slots if needed to reach 6
    const currentBenchCount = this.lineupForm.controls.bench.length;
    for (let i = currentBenchCount; i < 6; i++) {
      this.lineupForm.controls.bench.push(this.createPlayerFormGroup());
    }
  }
}
