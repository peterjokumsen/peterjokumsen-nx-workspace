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
import { Position } from '../../models';

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
  templateUrl: './player-select.component.html',
  styleUrl: './player-select.component.scss',
})
export class PlayerSelectComponent implements OnInit, OnChanges {
  private _bottomSheet = inject(MatBottomSheet);
  private _teamService = inject(TeamService);

  team = toSignal(this._teamService.selectedTeam$);
  @Input() playerForm!: FormGroup;
  @Input() label = 'Player';
  @Input() isStarter = false;

  fieldPositions: Array<{ value: Position; viewValue: string }> = [
    this.createPlayerLookup('P', 'Pitcher'),
    this.createPlayerLookup('C', 'Catcher'),
    this.createPlayerLookup('1', '1st Base'),
    this.createPlayerLookup('2', '2nd Base'),
    this.createPlayerLookup('3', '3rd Base'),
    this.createPlayerLookup('SS', 'Shortstop'),
    this.createPlayerLookup('LF', 'Left Field'),
    this.createPlayerLookup('CF', 'Center Field'),
    this.createPlayerLookup('RF', 'Right Field'),
  ];

  filteredPlayers$!: Observable<Player[]>;

  get playerIdControl() {
    return this.playerForm.get('playerId');
  }

  get playerNumberControl() {
    return this.playerForm.get('playerNumber');
  }

  private createPlayerLookup(value: Position, viewValue: string) {
    return { value, viewValue };
  }

  private updatePlayerNumber(playerNumber: number | undefined): void {
    if (!this.playerNumberControl || this.playerNumberControl.value) return;
    this.playerNumberControl.patchValue(playerNumber ?? null);
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
          if (!this.playerNumberControl) return;
          this.updatePlayerNumber(selectedPlayer?.number);
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

  ngOnInit(): void {
    this.initFilteredPlayers();
  }

  ngOnChanges(): void {
    if (this.team() && this.playerForm) {
      this.initFilteredPlayers();
    }
  }

  displayFn(playerId: string): string {
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
          this.updatePlayerNumber(p.number);
        }
      });
  }
}
