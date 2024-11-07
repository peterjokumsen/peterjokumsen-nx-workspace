import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { TaskService } from './task.service';

@Component({
  selector: 'ttd-simple-tasks',
  standalone: true,
  imports: [CommonModule],
  providers: [TaskService],
  template: `
    <h2>Tasks</h2>
    <div class="tasks-container">
      @for (task of tasks$ | async; track task.id) {
        <div class="task">
          <pre><code>{{ task | json }}</code></pre>
        </div>
        <hr />
      }
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleTasksComponent {
  private _taskService = inject(TaskService);

  loading = true;

  tasks$ = this._taskService.getTasks();
}
