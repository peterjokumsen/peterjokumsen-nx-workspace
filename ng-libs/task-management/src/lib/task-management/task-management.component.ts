import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';
import { LoadingIndicatorComponent } from '@peterjokumsen/loading-indicator';
import { TasksDataService } from '../services';

@Component({
  selector: 'task-mgr-task-management',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, LoadingIndicatorComponent],
  providers: [TasksDataService],
  templateUrl: './task-management.component.html',
  styleUrl: './task-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskManagementComponent {}
