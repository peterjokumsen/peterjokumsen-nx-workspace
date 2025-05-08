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
import { map, Observable } from 'rxjs';
import { Player, PlayerEditComponent, TeamService } from '../../../teams';
import { LineupService } from '../lineup.service';

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
  private _lineupService = inject(LineupService);
  private _teamService = inject(TeamService);

  team = toSignal(this._teamService.selectedTeam$);
  @Input() playerForm!: FormGroup;
  @Input() label = 'Player';
  @Input() isStarter = false;

  fieldPositions = this._lineupService.fieldPositions;
  disabledPositions = toSignal(this._lineupService.disabledPositions$);

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

  private updatePlayerNumber(playerNumber: number | undefined): void {
    if (!this.playerNumberControl || this.playerNumberControl.value) return;
    this.playerNumberControl.patchValue(playerNumber ?? null);
  }

  private initFilteredPlayers(): void {
    if (this.playerIdControl) {
      this.filteredPlayers$ = this.playerIdControl.valueChanges.pipe(
        map((value) => (value?.length >= 1 ? this.filterPlayers(value) : [])),
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
