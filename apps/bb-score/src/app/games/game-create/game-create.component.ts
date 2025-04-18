import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GameService } from '../game.service';
import { Game } from '../models';

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
    MatAutocompleteModule,
  ],
  template: `
    <div class="create-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Create New Game</mat-card-title>
        </mat-card-header>
        <mat-card-content class="create-form">
          <form [formGroup]="gameForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>League</mat-label>
              <input
                matInput
                formControlName="league"
                placeholder="Enter league name"
                [matAutocomplete]="leagueAuto"
              />
              <mat-autocomplete #leagueAuto="matAutocomplete">
                @for (option of filteredLeagues$ | async; track option) {
                  <mat-option [value]="option">{{ option }}</mat-option>
                }
              </mat-autocomplete>
              @if (gameForm.get('league')?.hasError('required')) {
                <mat-error>League is required</mat-error>
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
                [matAutocomplete]="homeTeamAuto"
              />
              <mat-autocomplete #homeTeamAuto="matAutocomplete">
                @for (option of filteredHomeTeams$ | async; track option) {
                  <mat-option [value]="option">{{ option }}</mat-option>
                }
              </mat-autocomplete>
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
                [matAutocomplete]="awayTeamAuto"
              />
              <mat-autocomplete #awayTeamAuto="matAutocomplete">
                @for (option of filteredAwayTeams$ | async; track option) {
                  <mat-option [value]="option">{{ option }}</mat-option>
                }
              </mat-autocomplete>
              @if (gameForm.get('awayTeam')?.hasError('required')) {
                <mat-error>Away team is required</mat-error>
              }
            </mat-form-field>

            <div class="button-container">
              <button mat-button type="button" (click)="onCancel()">
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

      .create-form {
        padding-top: 15px;
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

  gameForm = this._fb.group({
    league: ['', Validators.required],
    date: [new Date(), Validators.required],
    homeTeam: ['', Validators.required],
    awayTeam: ['', Validators.required],
  });

  // Get unique leagues and teams from existing games
  private leagues = this.getUniqueValues('league');
  private teams = this.getUniqueValues('homeTeam', 'awayTeam');

  // Create filtered observables for autocomplete
  filteredLeagues$ = this.createFilteredObservable('league', this.leagues);
  filteredHomeTeams$ = this.createFilteredObservable('homeTeam', this.teams);
  filteredAwayTeams$ = this.createFilteredObservable('awayTeam', this.teams);

  private getUniqueValues(...fields: Array<keyof Game>): string[] {
    const values = new Set<string>();
    this._gameService.getGames().subscribe((games) => {
      games.forEach((game) => {
        fields.forEach((field) => {
          if (game[field]) {
            values.add(game[field] as string);
          }
        });
      });
    });
    return Array.from(values);
  }

  private createFilteredObservable(
    controlName: string,
    options: string[],
  ): Observable<string[]> {
    return (
      this.gameForm.get(controlName)?.valueChanges.pipe(
        startWith(''),
        map((value) => {
          const filterValue = value.toLowerCase();
          return options.filter((option) =>
            option.toLowerCase().includes(filterValue),
          );
        }),
      ) ?? of([])
    );
  }

  onCancel(): void {
    this._router.navigate(['/games']);
  }

  onSubmit(): void {
    if (this.gameForm.valid) {
      this.gameForm.getRawValue();
      this._gameService.createGame({
        league: this.gameForm.value.league as string,
        homeTeam: this.gameForm.value.homeTeam as string,
        awayTeam: this.gameForm.value.awayTeam as string,
        date: this.gameForm.value.date as Date,
      });
      this._router.navigate(['/games']);
    }
  }
}
