import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { GameService } from '../../core/services/game.service';

@Component({
  selector: 'app-game-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  template: `
    <div class="create-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Create New Game</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="gameForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Game Name</mat-label>
              <input
                matInput
                formControlName="name"
                placeholder="Enter game name"
              />
              @if (gameForm.get('name')?.hasError('required')) {
                <mat-error>Game name is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Date</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="date" />
              <mat-datepicker-toggle
                matIconSuffix
                [for]="picker"
              ></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              @if (gameForm.get('date')?.hasError('required')) {
                <mat-error>Date is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Home Team</mat-label>
              <input
                matInput
                formControlName="homeTeam"
                placeholder="Enter home team name"
              />
              @if (gameForm.get('homeTeam')?.hasError('required')) {
                <mat-error>Home team is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Away Team</mat-label>
              <input
                matInput
                formControlName="awayTeam"
                placeholder="Enter away team name"
              />
              @if (gameForm.get('awayTeam')?.hasError('required')) {
                <mat-error>Away team is required</mat-error>
              }
            </mat-form-field>

            <div class="button-container">
              <button mat-button type="button" routerLink="/games">
                Cancel
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="!gameForm.valid"
              >
                Create Game
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .create-container {
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
      }
      .full-width {
        width: 100%;
        margin-bottom: 16px;
      }
      .button-container {
        display: flex;
        justify-content: flex-end;
        gap: 16px;
        margin-top: 16px;
      }
    `,
  ],
})
export class GameCreateComponent {
  private _fb = inject(FormBuilder);
  private _gameService = inject(GameService);
  private _router = inject(Router);

  gameForm: FormGroup = this._fb.group({
    name: ['', Validators.required],
    date: [new Date(), Validators.required],
    homeTeam: ['', Validators.required],
    awayTeam: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.gameForm.valid) {
      this._gameService.createGame(this.gameForm.value);
      this._router.navigate(['/games']);
    }
  }
}
