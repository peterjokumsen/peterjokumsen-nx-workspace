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
import { combineLatest, firstValueFrom, Observable, of } from 'rxjs';
import { map, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { TeamService } from '../../teams';
import { GameService } from '../game.service';

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
    <form [formGroup]="gameForm" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Date</mat-label>
        <input matInput [matDatepicker]="picker" formControlName="date" />
        <mat-datepicker-toggle
          matIconSuffix
          [for]="picker"
        ></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
        @if (inputs.date.hasError('required')) {
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
        @if (inputs.homeTeam.hasError('required')) {
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
        @if (inputs.awayTeam.hasError('required')) {
          <mat-error>Away team is required</mat-error>
        }
      </mat-form-field>

      <div class="button-container">
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
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
  `,
  styles: [
    `
      .create-header {
        padding: 10px 0;
      }

      .full-width {
        width: 100%;
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
  private _teamService = inject(TeamService);
  private _bottomSheetRef = inject(MatBottomSheetRef);

  @ViewChild('homeTeamInput') homeTeamInput!: ElementRef<HTMLInputElement>;

  gamesCreated = 0;

  gameForm = this._fb.group({
    date: [new Date(), Validators.required],
    homeTeam: ['', Validators.required],
    awayTeam: ['', Validators.required],
  });

  get inputs() {
    return this.gameForm.controls;
  }

  // Get team names from TeamService
  private _teams$ = this.getTeamNames();
  private _teamIdByName$ = this._teamService.teams$.pipe(
    map((teams) =>
      teams.reduce(
        (acc, team) => {
          acc[team.name] = team.id;
          return acc;
        },
        {} as Record<string, string>,
      ),
    ),
    shareReplay(1),
  );

  // Create filtered observables for autocomplete
  filteredHomeTeams$ = this.createFilteredObservable('homeTeam', this._teams$);
  filteredAwayTeams$ = this.createFilteredObservable('awayTeam', this._teams$);

  private getTeamNames(): Observable<string[]> {
    return this._teamService.getTeamSummaries().pipe(
      map((teams) => teams.map((team) => team.name)),
      shareReplay(1),
    );
  }

  private createFilteredObservable(
    controlName: 'homeTeam' | 'awayTeam',
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

  async onSubmit(addAnother = false): Promise<void> {
    if (this.gameForm.valid) {
      const teams = await firstValueFrom(this._teamIdByName$);
      const fv = this.gameForm.value;
      this._gameService.createGame({
        homeTeamId: teams[fv.homeTeam as string],
        homeTeamName: fv.homeTeam as string,
        awayTeamId: teams[fv.awayTeam as string],
        awayTeamName: fv.awayTeam as string,
        date: fv.date as Date,
      });

      this.gamesCreated++;

      if (addAnother) {
        // Get current date and add 7 days
        const currentDate = this.gameForm.value.date as Date;
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 7);

        // Reset form but keep the league and update date
        this.gameForm.reset({
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
