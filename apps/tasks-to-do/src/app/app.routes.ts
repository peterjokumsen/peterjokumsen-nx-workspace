import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/primary-landing.component').then(
        (m) => m.PrimaryLandingComponent,
      ),
  },
];
