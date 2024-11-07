import { Route } from '@angular/router';
import { hasAuthenticatedGuard } from './guards/has-authenticated.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/primary-landing.component').then(
        (m) => m.PrimaryLandingComponent,
      ),
  },
  {
    path: 'app',
    loadComponent: () =>
      import('./pages/tasks/simple-tasks.component').then(
        (m) => m.SimpleTasksComponent,
      ),
    canActivate: [hasAuthenticatedGuard],
  },
];
