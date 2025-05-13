import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { TeamCreateComponent } from '../team-create/team-create.component';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-teams-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatBottomSheetModule,
  ],
  template: `
    <div class="teams-container">
      <div class="header">
        <h1>Teams</h1>
        <button mat-fab color="primary" (click)="openCreateTeam()">
          <mat-icon>add</mat-icon>
        </button>
      </div>

      <div class="teams-list">
        @if (teams$ | async; as teams) {
          @if (teams.length === 0) {
            <mat-card>
              <mat-card-content>
                <p class="no-teams">No teams found.</p>
                <p class="no-teams">Create a team to get started.</p>
              </mat-card-content>
            </mat-card>
          } @else {
            <mat-card>
              <mat-nav-list>
                @for (team of teams; track team.id) {
                  <a mat-list-item (click)="viewTeam(team.id)">
                    <span matListItemTitle>{{ team.name }}</span>
                    <span matListItemLine>
                      {{ team.playerCount }} player(s)
                    </span>
                  </a>
                }
              </mat-nav-list>
            </mat-card>
          }
        }
      </div>
    </div>
  `,
  styles: [
    `
      .teams-container {
        padding: 16px;
        max-width: 800px;
        margin: 0 auto;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      mat-card > mat-card-content {
        align-items: center;
        display: flex;
        flex-flow: column nowrap;
        gap: 16px;
        justify-content: center;
        padding: 24px;
      }

      .no-teams {
        text-align: center;
        padding: 0;
        margin: 0;
        color: var(--mat-sys-on-surface);
      }

      .teams-list {
        --mat-list-active-indicator-shape: 0;
        margin-bottom: 16px;
      }
    `,
  ],
})
export class TeamsListComponent {
  private _teamService = inject(TeamService);
  private _bottomSheet = inject(MatBottomSheet);
  private _router = inject(Router);

  teams$ = this._teamService.getTeamSummaries();

  openCreateTeam(): void {
    this._bottomSheet.open(TeamCreateComponent);
  }

  viewTeam(teamId: string): void {
    this._router.navigate(['/teams', teamId]);
  }
}
