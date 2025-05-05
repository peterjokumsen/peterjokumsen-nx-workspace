import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { firstValueFrom, Observable } from 'rxjs';
import { Player } from '../models';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-player-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="edit-header">
      <h1>{{ isEdit ? 'Edit Player' : 'Add Player' }}</h1>
    </div>
    <div class="edit-form">
      <form [formGroup]="playerForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Player Name</mat-label>
          <input
            matInput
            formControlName="name"
            placeholder="Enter player name"
          />
          @if (playerForm.controls.name.hasError('required')) {
            <mat-error>Player name is required</mat-error>
          }
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Number</mat-label>
            <input
              matInput
              formControlName="number"
              type="number"
              placeholder="Jersey number"
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Registered league(s)</mat-label>
            <input
              matInput
              formControlName="league"
              placeholder="League(s) separated by spaces"
            />
          </mat-form-field>
        </div>

        <div class="button-container">
          <button mat-button type="button" (click)="onCancel()">Cancel</button>
          <button
            mat-raised-button
            color="primary"
            type="submit"
            [disabled]="!playerForm.valid"
          >
            {{ isEdit ? 'Update Player' : 'Add Player' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .edit-form {
        max-width: 600px;
      }

      .edit-header {
        padding: 10px 0;
      }

      .full-width {
        width: 100%;
        margin-bottom: 16px;
      }

      .form-row {
        display: flex;
        gap: 16px;
      }

      .half-width {
        width: 50%;
      }

      .button-container {
        gap: 16px;
        display: flex;
        flex-direction: column-reverse;

        @media (min-width: 600px) {
          margin-top: 16px;
          flex-direction: row;
          justify-content: flex-end;
        }
      }
    `,
  ],
})
export class PlayerEditComponent {
  private _fb = inject(FormBuilder);
  private _teamService = inject(TeamService);
  private _bottomSheetRef = inject(MatBottomSheetRef);
  private _snackBar = inject(MatSnackBar);
  private _data: { teamId: string; player?: Player } = inject(
    MAT_BOTTOM_SHEET_DATA,
  );

  get teamId(): string {
    return this._data.teamId;
  }

  get player(): Player | undefined {
    return this._data.player;
  }

  get isEdit(): boolean {
    return !!this.player;
  }

  playerForm = this._fb.group({
    name: [this._data.player?.name ?? '', Validators.required],
    number: [this._data.player?.number ?? (null as number | null)],
    league: [this._data.player?.league?.join(' ') ?? ''],
  });

  onCancel(): void {
    this._bottomSheetRef.dismiss(null);
  }

  async onSubmit(): Promise<void> {
    if (!this.playerForm.valid) {
      this._snackBar.open('Unable to submit player details', 'Close', {
        duration: 3000,
      });
      return;
    }

    const playerData: Omit<Player, 'id'> = {
      name: this.playerForm.value.name as string,
      number: this.playerForm.value.number || undefined,
      league: (this.playerForm.value.league ?? '').split(' ').filter((l) => l),
    };

    let resultPlayer$: Observable<Player | null>;
    let snackBarMessage: string;
    if (this.isEdit && this.player) {
      resultPlayer$ = this._teamService.updatePlayer(this.teamId, {
        ...this.player,
        ...playerData,
      });
      snackBarMessage = 'Player updated successfully';
    } else {
      resultPlayer$ = this._teamService.addPlayer(this.teamId, playerData);
      snackBarMessage = 'Player added successfully';
    }

    const result = await firstValueFrom(resultPlayer$);
    this._snackBar.open(snackBarMessage, 'Close', {
      duration: 3000,
    });

    this._bottomSheetRef.dismiss(result);
  }
}
