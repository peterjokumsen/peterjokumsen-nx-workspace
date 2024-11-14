import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Task } from '../models';

@Component({
  selector: 'task-mgr-task-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task-view">
      <h2>{{ task()?.title }}</h2>
      <p>{{ task()?.description }}</p>
      <p class="notes" *ngIf="task()?.notes as notes">{{ notes }}</p>
      <p class="due-date" *ngIf="task()?.dueDate as dueDate">
        Due: {{ dueDate }}
      </p>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskViewComponent {
  task = input<Task>();
}
