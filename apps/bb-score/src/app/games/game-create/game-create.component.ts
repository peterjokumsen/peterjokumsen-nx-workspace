import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { combineLatest, Observable, of } from 'rxjs';
import { map, shareReplay, startWith, switchMap } from 'rxjs/operators';
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
    MatAutocompleteModule,
  ],
  providers: [provideNativeDateAdapter()],
  template: `
    <div class="create-header">
      <h1>Create New Game</h1>
      <h3 *ngIf="gamesCreated > 0">
        {{ gamesCreated }} game{{ gamesCreated > 1 ? 's' : '' }} created
      </h3>
    </div>
      <div class="create-form">
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
              #homeTeamInput
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
              type="button"
              [disabled]="!gameForm.valid"
              (click)="onSubmit(true)"
            >
              Add Another Game
            </button>
            <button
              mat-raised-button
              color="accent"
              type="submit"
              [disabled]="!gameForm.valid"
            >
              Save and Close
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
export class GameCreateComponent {
  private _fb = inject(FormBuilder);
  private _gameService = inject(GameService);
  private _bottomSheetRef = inject(MatBottomSheetRef);

  @ViewChild('homeTeamInput') homeTeamInput!: ElementRef<HTMLInputElement>;

  gamesCreated = 0;

  gameForm = this._fb.group({
    league: ['', Validators.required],
    date: [new Date(), Validators.required],
    homeTeam: ['', Validators.required],
    awayTeam: ['', Validators.required],
  });

  // Get unique leagues and teams from existing games
  private _leagues$ = this.getUniqueValues('league');
  private _teams$ = this.getUniqueValues('homeTeam', 'awayTeam');

  // Create filtered observables for autocomplete
  filteredLeagues$ = this.createFilteredObservable('league', this._leagues$);
  filteredHomeTeams$ = this.createFilteredObservable('homeTeam', this._teams$);
  filteredAwayTeams$ = this.createFilteredObservable('awayTeam', this._teams$);

  private getUniqueValues(...fields: Array<keyof Game>): Observable<string[]> {
    return this._gameService.games$.pipe(
      map((games) => {
        const values = new Set<string>();
        games.forEach((game) => {
          fields.forEach((field) => {
            if (game[field]) {
              values.add(game[field] as string);
            }
          });
        });
        return Array.from(values);
      }),
      shareReplay(1),
    );
  }

  private createFilteredObservable(
    controlName: 'league' | 'homeTeam' | 'awayTeam',
    options: Observable<string[]>,
  ): Observable<string[]> {
    return (
      this.gameForm.get(controlName)?.valueChanges.pipe(
        startWith(''),
        switchMap((value) => {
          const otherControl =
            controlName === 'homeTeam'
              ? this.gameForm.get('awayTeam')
              : this.gameForm.get('homeTeam');
          const otherValue$ = (otherControl?.valueChanges ?? of(null)).pipe(
            startWith(otherControl?.value),
          );

          const filterValue = value?.toLowerCase() ?? '';
          return combineLatest([options, otherValue$]).pipe(
            map(([options, otherCtrlValue]) =>
              options.filter(
                (option) =>
                  option !== otherCtrlValue &&
                  option.toLowerCase().includes(filterValue),
              ),
            ),
          );
        }),
      ) ?? of([])
    );
  }

  onCancel(): void {
    this._bottomSheetRef.dismiss();
  }

  onSubmit(addAnother = false): void {
    if (this.gameForm.valid) {
      this._gameService.createGame({
        league: this.gameForm.value.league as string,
        homeTeam: this.gameForm.value.homeTeam as string,
        awayTeam: this.gameForm.value.awayTeam as string,
        date: this.gameForm.value.date as Date,
      });

      this.gamesCreated++;

      if (addAnother) {
        // Get current date and add 7 days
        const currentDate = this.gameForm.value.date as Date;
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 7);

        // Reset form but keep the league and update date
        const league = this.gameForm.value.league;
        this.gameForm.reset({
          league,
          date: nextDate,
          homeTeam: '',
          awayTeam: '',
        });

        // Focus and scroll to home team input
        setTimeout(() => {
          this.homeTeamInput.nativeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
          this.homeTeamInput.nativeElement.focus();
        });
      } else {
        this._bottomSheetRef.dismiss();
      }
    }
  }
}
