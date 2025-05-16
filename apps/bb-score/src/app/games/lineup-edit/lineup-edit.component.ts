import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  EventEmitter,
  inject,
  input,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { debounceTime } from 'rxjs';
import { Game, Lineup } from '../models';
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
  private _lineupSvc = inject(LineupService);
  private _lineup: Lineup | undefined;
  private _teams = toSignal(this._lineupSvc.teams$);

  readonly lineupForm = this._lineupSvc.lineupForm;

  game = input.required<Game | null>();
  teamType = input.required<'home' | 'away'>();
  currentTeam = computed(() => {
    const game = this.game();
    const teamType = this.teamType();
    const teams = this._teams();
    if (!game || !teamType || !teams) return null;
    const id = game[`${teamType}TeamId`];
    return teams.find((t) => t.id === id) ?? null;
  });

  @Input() set lineup(value: Lineup | undefined) {
    if (value && this.currentTeam() && !this._lineup) {
      this._lineupSvc.populateLineupForm(value);
    }
  }

  @Output() saveLineup = new EventEmitter<Lineup>();
  @Output() lineupUpdate = new EventEmitter<Lineup>();

  get starterFormGroups(): Array<
    ReturnType<LineupService['createStarterPlayerFormGroup']>
  > {
    const arr = this._lineupSvc.lineupForm.get('starters') as FormArray;
    return arr.controls as FormGroup[];
  }

  get benchFormGroups(): FormGroup[] {
    const arr = this._lineupSvc.lineupForm.get('bench') as FormArray;
    return arr.controls as FormGroup[];
  }

  private subscribeToSaveValueChanges(): void {
    this._lineupSvc.lineupForm.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef), debounceTime(500))
      .subscribe((value) => {
        this.lineupUpdate.emit(value as Lineup);
      });
  }

  ngOnInit(): void {
    this.subscribeToSaveValueChanges();
  }

  onSaveLineup(): void {
    this._lineup = this._lineupSvc.lineupForm.value as Lineup;
    this.saveLineup.emit(this._lineup);
  }
}
