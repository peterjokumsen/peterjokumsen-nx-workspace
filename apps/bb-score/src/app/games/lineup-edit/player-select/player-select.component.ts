import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  Input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { map, Observable } from 'rxjs';
import { Player, PlayerEditComponent, Team } from '../../../teams';
import {
  BenchFormGroup,
  LineupService,
  StarterFormGroup,
} from '../lineup.service';

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
export class PlayerSelectComponent implements OnInit {
  private _bottomSheet = inject(MatBottomSheet);
  private _lineupService = inject(LineupService);
  private _fb = inject(FormBuilder);
  private _destroyRef = inject(DestroyRef);

  team = input.required<Team | null>();
  playerForm = input.required<StarterFormGroup | BenchFormGroup>();
  @Input() label = 'Player';

  isStarter = computed(() => 'position' in this.playerForm().controls);

  playerFilterFormGroup = this._fb.group({
    searchPlayer: [''],
  });

  fieldPositions = this._lineupService.fieldPositions;
  disabledPositions = toSignal(this._lineupService.disabledPositions$);
  playerIdsInUse = toSignal(this._lineupService.playerIdsUsed$);

  filteredPlayers$: Observable<Player[]> =
    this.playerFilterFormGroup.controls.searchPlayer.valueChanges.pipe(
      map((value) => {
        return this.filterPlayers(value);
      }),
    );

  get playerIdControl() {
    return this.playerForm().controls.playerId;
  }

  get playerNumberControl() {
    return this.playerForm().controls.playerNumber;
  }

  get playerPositionControl() {
    const fg = this.playerForm();
    return this.isStarterFormGroup(fg) ? fg.controls.position : null;
  }

  private isStarterFormGroup(
    group: StarterFormGroup | BenchFormGroup,
  ): group is StarterFormGroup {
    return 'position' in group.controls;
  }

  private updatePlayerNumber(playerNumber: number | undefined): void {
    if (!this.playerNumberControl || this.playerNumberControl.value) return;
    this.playerNumberControl.patchValue(
      playerNumber ? `${playerNumber}` : null,
    );
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

  ngOnInit() {
    this.playerFilterFormGroup.controls.searchPlayer.patchValue(
      this.playerIdControl?.value ?? '',
      { emitEvent: false },
    );

    if (!this.playerIdControl) return;
    this.playerIdControl.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((value) => {
        if (value === this.playerFilterFormGroup.controls.searchPlayer.value)
          return;
        this.playerFilterFormGroup.controls.searchPlayer.patchValue(value, {
          emitEvent: false,
        });
      });
  }

  displayFn(playerId: string): string {
    if (!playerId || !this.team() || !this.team()?.players) {
      return '';
    }

    const player = this.team()?.players.find((p) => p.id === playerId);
    if (player && this.playerIdControl?.value !== playerId) {
      this.playerIdControl?.patchValue(player.id);
      this.updatePlayerNumber(player.number);
    }

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
