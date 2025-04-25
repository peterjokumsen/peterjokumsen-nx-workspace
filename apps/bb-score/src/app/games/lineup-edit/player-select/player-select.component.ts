import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { map, Observable, startWith } from 'rxjs';
import { Player, Team } from '../../../teams';

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
          (click)="onAddNewPlayer($event)"
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
    </div>
  `,
  styles: `
    .player-select-container {
      display: flex;
      align-items: center;
    }

    .player-select {
      flex: 1;
    }
  `,
})
export class PlayerSelectComponent implements OnInit, OnChanges {
  @Input() team!: Team;
  @Input() playerForm!: FormGroup;
  @Input() label = 'Player';
  @Output() addPlayer = new EventEmitter<string>();

  filteredPlayers$!: Observable<Player[]>;

  ngOnInit(): void {
    this.initFilteredPlayers();
  }

  ngOnChanges(): void {
    if (this.team && this.playerForm) {
      this.initFilteredPlayers();
    }
  }

  private initFilteredPlayers(): void {
    const playerIdControl = this.playerForm.get('playerId');

    if (playerIdControl) {
      this.filteredPlayers$ = playerIdControl.valueChanges.pipe(
        startWith(''),
        map((value) => (value.length < 1 ? [] : this.filterPlayers(value))),
      );
    }
  }

  private filterPlayers(value: string | null): Player[] {
    if (!this.team || !this.team.players) {
      return [];
    }

    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';

    return this.team.players.filter(
      (player) =>
        player.name.toLowerCase().includes(filterValue) ||
        (player.number && player.number.toString().includes(filterValue)),
    );
  }

  displayFn(playerId: string): string {
    if (!playerId || !this.team || !this.team.players) {
      return '';
    }

    const player = this.team.players.find((p) => p.id === playerId);
    return player
      ? player.name + (player.number ? ' #' + player.number : '')
      : '';
  }

  onAddNewPlayer(event: MouseEvent): void {
    event.preventDefault();
    this.addPlayer.emit(this.team.id);
  }
}
