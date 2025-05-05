import { Routes } from '@angular/router';
import { TeamDetailComponent } from './team-detail/team-detail.component';
import { teamGuard } from './team.guard';
import { TeamsListComponent } from './teams-list/teams-list.component';

export const teamsRoutes: Routes = [
  {
    path: '',
    component: TeamsListComponent,
  },
  {
    path: ':id',
    component: TeamDetailComponent,
    canActivate: [teamGuard],
  },
];
