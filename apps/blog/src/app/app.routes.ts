import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'about-me',
    loadComponent: () =>
      import('./pages/about-me.component').then((m) => m.AboutMeComponent),
  },
];
