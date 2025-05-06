import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Player, Team } from '../models';
import { PlayerEditComponent } from '../player-edit/player-edit.component';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-team-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatSnackBarModule,
    MatBottomSheetModule,
  ],
  template: `
    <div class="team-container" *ngIf="team() as team">
      <div class="header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>{{ team.name }}</h1>
        <button mat-icon-button color="warn" (click)="deleteTeam(team)">
          <mat-icon>delete</mat-icon>
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <div class="team-info">
            <p *ngIf="uniqueLeagues()">
              <strong>League(s):</strong> {{ uniqueLeagues() }}
            </p>
            <p><strong>Players:</strong> {{ team.players.length }}</p>
          </div>
        </mat-card-content>
      </mat-card>

      <div class="section-header">
        <h2>Players</h2>
        <button mat-mini-fab color="primary" (click)="openAddPlayer(team.id)">
          <mat-icon>add</mat-icon>
        </button>
      </div>

      <div class="players-list">
        @if (team.players.length === 0) {
          <mat-card>
            <mat-card-content>
              <p class="no-players">No players added to this team yet.</p>
            </mat-card-content>
          </mat-card>
        } @else {
          <mat-card>
            <mat-nav-list>
              @for (player of team.players; track player.id) {
                <mat-list-item>
                  <div class="player-title" matListItemTitle>
                    <span>{{ player.name }}</span>

                    <span class="spacer"></span>
                    <span class="title-controls">
                      <button
                        mat-icon-button
                        (click)="openEditPlayer(team.id, player)"
                      >
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button
                        mat-icon-button
                        color="warn"
                        (click)="removePlayer(team.id, player.id)"
                      >
                        <mat-icon>delete</mat-icon>
                      </button>
                    </span>
                  </div>
                  <span matListItemLine *ngIf="player.number">
                    # {{ player.number }}
                  </span>
                  @if (player.league; as playerLeagues) {
                    <span matListItemLine>
                      {{ playerLeagues.join(', ') }}
                    </span>
                  }
                </mat-list-item>
              }
            </mat-nav-list>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .team-container {
        padding: 16px;
        max-width: 800px;
        margin: 0 auto;
      }

      .header {
        display: flex;
        align-items: center;
        margin-bottom: 16px;
      }

      .header h1 {
        flex: 1;
        margin: 0 16px;
      }

      .team-info {
        margin-bottom: 16px;
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 24px 0 16px;
      }

      .no-players {
        text-align: center;
        padding: 24px;
        margin: 0;
        color: var(--mat-sys-on-surface);
      }

      .players-list {
        margin-bottom: 16px;
        --mat-list-active-indicator-shape: 0;

        .player-title {
          display: flex;
          align-items: center;

          .spacer {
            flex-grow: 1;
          }
        }
      }
    `,
  ],
})
export class TeamDetailComponent {
  private _router = inject(Router);
  private _teamService = inject(TeamService);
  private _snackBar = inject(MatSnackBar);
  private _bottomSheet = inject(MatBottomSheet);

  team = toSignal(this._teamService.selectedTeam$);
  uniqueLeagues = computed(() => {
    const team = this.team();
    if (!team) return '';
    const unique = team.players
      .flatMap((player) => player.league ?? [])
      .filter((v, i, a) => a.indexOf(v) === i);
    return unique.join(', ');
  });

  goBack(): void {
    this._router.navigate(['/teams']);
  }

  deleteTeam(team: Team): void {
    if (confirm(`Are you sure you want to delete the team "${team.name}"?`)) {
      this._teamService.deleteTeam(team.id);
      this._router.navigate(['/teams']);
    }
  }

  openAddPlayer(teamId: string): void {
    this._bottomSheet.open(PlayerEditComponent, {
      data: { teamId },
    });
  }

  openEditPlayer(teamId: string, player: Player): void {
    this._bottomSheet.open(PlayerEditComponent, {
      data: { teamId, player },
    });
  }

  removePlayer(teamId: string, playerId: string): void {
    this._teamService.removePlayer(teamId, playerId);
    this._snackBar.open('Player removed', 'Close', { duration: 3000 });
  }
}
