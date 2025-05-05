import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { map, Observable, startWith, tap } from 'rxjs';
import { Player, PlayerEditComponent, TeamService } from '../../../teams';

@Component({
  selector: 'app-player-select',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
  ],
  template: `
    <div [formGroup]="playerForm" class="player-select-container">
      <mat-form-field appearance="outline" class="player-select">
        <mat-label>{{ label }}</mat-label>
        <input
          matInput
          formControlName="playerId"
          [matAutocomplete]="playerAuto"
          placeholder="Type player name or number to find player"
        />
        <button
          matSuffix
          mat-icon-button
          color="primary"
          type="button"
          (click)="addNewPlayer()"
          tabindex="-1"
        >
          <mat-icon>add_circle</mat-icon>
        </button>
        <mat-autocomplete
          #playerAuto="matAutocomplete"
          [displayWith]="displayFn.bind(this)"
        >
          @for (player of filteredPlayers$ | async; track player.id) {
            <mat-option [value]="player.id">
              {{ player.name }}
              {{ player.number ? '#' + player.number : '' }}
            </mat-option>
          }
        </mat-autocomplete>
      </mat-form-field>

      @if (isStarter) {
        <div class="additional-fields">
          <mat-form-field appearance="outline" class="player-number">
            <mat-label>Number</mat-label>
            <input
              matInput
              type="number"
              formControlName="playerNumber"
              placeholder="Player #"
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="player-position">
            <mat-label>Position</mat-label>
            <mat-select formControlName="position">
              @for (position of fieldPositions; track position.value) {
                <mat-option [value]="position.value">
                  {{ position.viewValue }}
                </mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>
      }
    </div>
  `,
  styles: `
    .player-select-container {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    .player-select {
      width: 100%;
    }

    .additional-fields {
      display: flex;
      gap: 16px;
      margin-top: 8px;
      width: 100%;
    }

    .player-number {
      width: 100px;
    }

    .player-position {
      flex: 1;
    }
  `,
})
export class PlayerSelectComponent implements OnInit, OnChanges {
  private _bottomSheet = inject(MatBottomSheet);
  private _teamService = inject(TeamService);

  team = toSignal(this._teamService.selectedTeam$);
  @Input() playerForm!: FormGroup;
  @Input() label = 'Player';
  @Input() isStarter = false;

  fieldPositions = [
    { value: 'P', viewValue: 'Pitcher' },
    { value: 'C', viewValue: 'Catcher' },
    { value: '1B', viewValue: '1st Base' },
    { value: '2B', viewValue: '2nd Base' },
    { value: '3B', viewValue: '3rd Base' },
    { value: 'SS', viewValue: 'Shortstop' },
    { value: 'LF', viewValue: 'Left Field' },
    { value: 'CF', viewValue: 'Center Field' },
    { value: 'RF', viewValue: 'Right Field' },
    { value: 'DH', viewValue: 'Designated Hitter' },
  ];

  filteredPlayers$!: Observable<Player[]>;

  get playerIdControl() {
    return this.playerForm.get('playerId');
  }

  get playerNumberControl() {
    return this.playerForm.get('playerNumber');
  }

  get playerPositionControl() {
    return this.playerForm.get('position');
  }

  ngOnInit(): void {
    this.initFilteredPlayers();
  }

  ngOnChanges(): void {
    if (this.team() && this.playerForm) {
      this.initFilteredPlayers();
    }
  }

  private initFilteredPlayers(): void {
    if (this.playerIdControl) {
      this.filteredPlayers$ = this.playerIdControl.valueChanges.pipe(
        tap((v) => console.log('value changed: ', v)),
        startWith(''),
        map((value) => (value.length < 1 ? [] : this.filterPlayers(value))),
      );

      // Listen for player selection changes to update number and position
      this.playerIdControl.valueChanges.subscribe((playerId) => {
        if (playerId && typeof playerId === 'string' && this.team()?.players) {
          const selectedPlayer = this.team()?.players.find(
            (p) => p.id === playerId,
          );
          if (selectedPlayer && this.playerNumberControl) {
            // Update player number if available
            this.playerNumberControl.patchValue(selectedPlayer.number || null);
          }
        }
      });
    }
  }

  private filterPlayers(value: string | null): Player[] {
    if (!this.team() || !this.team()?.players) {
      return [];
    }

    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';

    return (
      this.team()?.players.filter(
        (player) =>
          player.name.toLowerCase().includes(filterValue) ||
          (player.number && player.number.toString().includes(filterValue)),
      ) ?? []
    );
  }

  displayFn(playerId: string): string {
    console.log('displayFn: ', playerId);
    if (!playerId || !this.team() || !this.team()?.players) {
      return '';
    }

    const player = this.team()?.players.find((p) => p.id === playerId);
    return player
      ? player.name + (player.number ? ' #' + player.number : '')
      : '';
  }

  addNewPlayer(): void {
    this._bottomSheet
      .open(PlayerEditComponent, {
        data: { teamId: this.team()?.id },
      })
      .afterDismissed()
      .subscribe((p: Player | null) => {
        if (p) {
          this.playerIdControl?.patchValue(p.id);

          // If the player has a number, update the playerNumber field
          if (p.number && this.playerNumberControl) {
            this.playerNumberControl.patchValue(p.number);
          }
        }
      });
  }
}
