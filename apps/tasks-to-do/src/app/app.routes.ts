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
    path: 'tasks',
    loadChildren: () =>
      import('@peterjokumsen/task-management').then(
        (m) => m.taskManagementRoutes,
      ),
    canActivate: [hasAuthenticatedGuard],
  },
];
