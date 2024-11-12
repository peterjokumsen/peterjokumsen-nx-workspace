import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';
import { TasksDataService } from '../services';

@Component({
  selector: 'task-mgr-task-management',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  providers: [TasksDataService],
  templateUrl: './task-management.component.html',
  styleUrl: './task-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskManagementComponent {}
