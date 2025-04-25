import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'scores',
    loadComponent: () =>
      import('./scores/scores.component').then((m) => m.ScoresComponent),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./settings/settings.component').then((m) => m.SettingsComponent),
  },
  {
    path: 'games',
    loadChildren: () =>
      import('./games/games.routes').then((m) => m.gamesRoutes),
  },
  {
    path: 'teams',
    loadChildren: () =>
      import('./teams/teams.routes').then((m) => m.teamsRoutes),
  },
];
