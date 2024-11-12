import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'task-mgr-task-management',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './task-management.component.html',
  styleUrl: './task-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskManagementComponent {}
