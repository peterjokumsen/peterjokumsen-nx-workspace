import { Route } from '@angular/router';
import { TaskManagementComponent } from './task-management/task-management.component';

export const taskManagementRoutes: Route[] = [
  { path: '', component: TaskManagementComponent },
];
