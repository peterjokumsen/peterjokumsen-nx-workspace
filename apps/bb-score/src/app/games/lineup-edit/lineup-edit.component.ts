import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
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
import { Team } from '../../teams';
import { GamePlayer, Lineup, StartingPlayer } from '../models';
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
  template: `
    @let team = currentTeam();
    <div class="lineup-form" *ngIf="team">
      <h3>{{ team.name }} Lineup</h3>
      <form [formGroup]="lineupForm">
        <div formArrayName="starters">
          <h4>Starting Lineup (9)</h4>
          <div
            class="player-row"
            *ngFor="let playerCtrl of starterFormGroups; let i = index"
          >
            <div [formGroupName]="i">
              <app-player-select
                [playerForm]="playerCtrl"
                [label]="'Player ' + (i + 1)"
                [isStarter]="true"
              ></app-player-select>
            </div>
          </div>
        </div>

        <div formArrayName="bench">
          <h4>Bench Players</h4>
          <div
            class="player-row"
            *ngFor="let playerCtrl of benchFormGroups; let i = index"
          >
            <div [formGroupName]="i">
              <app-player-select
                [playerForm]="playerCtrl"
                [label]="'Bench Player ' + (i + 1)"
              ></app-player-select>
            </div>
          </div>
        </div>

        <div class="actions">
          <button
            mat-raised-button
            color="primary"
            type="button"
            (click)="onSaveLineup()"
          >
            Save Lineup
          </button>
        </div>
      </form>
    </div>
  `,
  styles: `
    .lineup-form {
      padding: 10px;
    }

    .player-row {
      padding: 20px 10px 0;

      &:nth-child(even) {
        background-color: var(--mat-sys-surface-container-high);
      }
    }

    .player-select-container {
      display: flex;
      align-items: center;
    }

    .player-select {
      flex: 1;
    }

    .actions {
      margin-top: 24px;
      display: flex;
      justify-content: flex-end;
    }
  `,
})
export class LineupEditComponent {
  private _fb = inject(FormBuilder);
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

  lineupForm = this._fb.group({
    starters: this._fb.array([this.createStarterPlayerFormGroup()]),
    bench: this._fb.array([this.createPlayerFormGroup()]),
  });

  get starterFormGroups(): FormGroup[] {
    const arr = this.lineupForm.get('starters') as FormArray;
    return arr.controls as FormGroup[];
  }

  get benchFormGroups(): FormGroup[] {
    const arr = this.lineupForm.get('bench') as FormArray;
    return arr.controls as FormGroup[];
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
    // Clear existing form arrays
    this.lineupForm.controls.starters.clear();
    this.lineupForm.controls.bench.clear();

    console.log('lineup', lineup);

    // Populate starters
    if (Array.isArray(lineup?.starters)) {
      lineup.starters.forEach((starter) => {
        this.lineupForm.controls.starters.push(
          this.createStarterPlayerFormGroup(starter),
        );
      });
    }

    // Add empty starter slots if needed to reach 9
    const currentStarterCount = this.lineupForm.controls.starters.length;
    for (let i = currentStarterCount; i < 9; i++) {
      this.lineupForm.controls.starters.push(
        this.createStarterPlayerFormGroup(),
      );
    }

    // Populate bench
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
