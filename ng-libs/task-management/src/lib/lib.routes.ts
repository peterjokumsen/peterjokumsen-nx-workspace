import { Route } from '@angular/router';
import { TaskManagementComponent } from './task-management.component';
import { provideLoadingIndicator } from '@peterjokumsen/loading-indicator';

export const taskManagementRoutes: Route[] = [
  {
    path: '',
    component: TaskManagementComponent,
    providers: [provideLoadingIndicator()],
    children: [
      {
        path: '',
        redirectTo: 'view',
        pathMatch: 'full',
      },
      {
        path: 'view',
        loadComponent: () =>
          import('./pages/tasks-display.component').then(
            (m) => m.TasksDisplayComponent,
          ),
      },
    ],
  },
];
