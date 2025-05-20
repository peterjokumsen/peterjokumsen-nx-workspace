import { Route } from '@angular/router';

export const scoringRoutes: Route[] = [
  {
    path: 'batting',
    loadComponent: () =>
      import('./batting.component').then((c) => c.BattingComponent),
  },
  {
    path: 'fielding',
    loadComponent: () =>
      import('./fielding.component').then((c) => c.FieldingComponent),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'batting',
  },
];
