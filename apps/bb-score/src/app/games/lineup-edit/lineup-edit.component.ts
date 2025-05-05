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
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Team } from '../../teams';
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
  currentTeam = signal<Team | null>(null);

  @Input() set team(value: Team | null) {
    const current = this.currentTeam();
    if (current?.id === value?.id) return;

    this.currentTeam.update(() => value);
    this.resetLineupForm();
  }

  @Output() saveLineup = new EventEmitter<unknown>();

  lineupForm = this._fb.group({
    starters: this._fb.array<FormGroup>([]),
    bench: this._fb.array<FormGroup>([]),
  });

  get starterFormGroups(): FormGroup[] {
    const arr = this.lineupForm.get('starters') as FormArray;
    return arr.controls as FormGroup[];
  }

  get benchFormGroups(): FormGroup[] {
    const arr = this.lineupForm.get('bench') as FormArray;
    return arr.controls as FormGroup[];
  }

  resetLineupForm(): void {
    // Clear existing form arrays
    this.lineupForm.controls.starters.clear();
    this.lineupForm.controls.bench.clear();

    // Add 9 starter slots
    for (let i = 0; i < 9; i++) {
      this.lineupForm.controls.starters.push(this.createPlayerFormGroup(true));
    }

    // Add 6 bench slots
    for (let i = 0; i < 6; i++) {
      this.lineupForm.controls.bench.push(this.createPlayerFormGroup());
    }
  }

  createPlayerFormGroup(starter = false): FormGroup {
    if (starter) {
      return this._fb.group({
        playerId: [null],
        playerNumber: [null],
        position: [null],
      });
    }

    return this._fb.group({
      playerId: [null],
      playerNumber: [null],
    });
  }

  onSaveLineup(): void {
    if (this.lineupForm.valid) {
      this.saveLineup.emit(this.lineupForm.value);
    }
  }
}
