import { Route } from '@angular/router';
import { TaskManagementComponent } from './task-management/task-management.component';
import { provideLoadingIndicator } from '@peterjokumsen/loading-indicator';

export const taskManagementRoutes: Route[] = [
  {
    path: '',
    component: TaskManagementComponent,
    providers: [provideLoadingIndicator()],
    children: [
      {
        path: '',
        redirectTo: 'pending',
        pathMatch: 'full',
      },
      {
        path: 'pending',
        loadComponent: () =>
          import('./pages/tasks-display.component').then(
            (m) => m.TasksDisplayComponent,
          ),
        data: { filter: 'Pending' },
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./pages/tasks-display.component').then(
            (m) => m.TasksDisplayComponent,
          ),
        data: { filter: 'New' },
      },
      {
        path: 'completed',
        loadComponent: () =>
          import('./pages/tasks-display.component').then(
            (m) => m.TasksDisplayComponent,
          ),
        data: { filter: 'Completed' },
      },
      {
        path: 'all',
        loadComponent: () =>
          import('./pages/tasks-display.component').then(
            (m) => m.TasksDisplayComponent,
          ),
        data: { filter: 'All' },
      },
    ],
  },
];