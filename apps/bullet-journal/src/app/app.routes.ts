import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./pages/landing.component').then(m => m.LandingComponent),
  }
];
