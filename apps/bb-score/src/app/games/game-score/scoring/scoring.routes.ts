import { Route } from '@angular/router';

export const scoringRoutes: Route[] = [
  {
    path: 'batting',
    loadComponent: () =>
      import('./batting.component').then((c) => c.BattingComponent),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'batting',
  },
];
