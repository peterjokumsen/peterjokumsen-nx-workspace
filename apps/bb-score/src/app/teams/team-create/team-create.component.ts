import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-team-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
  template: `
    <div class="create-header">
      <h1>Create New Team</h1>
    </div>
    <div class="create-form">
      <form [formGroup]="teamForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Team Name</mat-label>
          <input
            matInput
            formControlName="name"
            placeholder="Enter team name"
          />
          @if (teamForm.controls.name.hasError('required')) {
            <mat-error>Team name is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Location</mat-label>
          <input
            matInput
            formControlName="location"
            placeholder="Team location"
          />
        </mat-form-field>

        <div class="button-container">
          <button mat-button type="button" (click)="onCancel()">Cancel</button>
          <button
            mat-raised-button
            color="primary"
            type="submit"
            [disabled]="!teamForm.valid"
          >
            Create Team
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .create-form {
        max-width: 600px;
      }

      .create-header {
        padding: 10px 0;
      }

      .full-width {
        width: 100%;
        margin-bottom: 16px;
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
export class TeamCreateComponent {
  private _fb = inject(FormBuilder);
  private _teamService = inject(TeamService);
  private _bottomSheetRef = inject(MatBottomSheetRef);

  teamForm = this._fb.group({
    name: ['', Validators.required],
    location: [''],
  });

  onCancel(): void {
    this._bottomSheetRef.dismiss();
  }

  onSubmit(): void {
    if (this.teamForm.valid) {
      this._teamService.createTeam({
        name: this.teamForm.value.name as string,
        location: this.teamForm.value.location || undefined,
      });
      this._bottomSheetRef.dismiss();
    }
  }
}
