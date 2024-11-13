import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { map, switchMap } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TaskState } from '../models';
import { TasksDataService } from '../services';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'task-mgr-task-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>{{ currentFilter() }} tasks</h2>

    <ng-container *ngIf="tasks() as tasks">
      @for (task of tasks; track task.id) {
        <pre><code>{{ task | json }}</code></pre>
      }
    </ng-container>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksDisplayComponent {
  private readonly _statuses: TaskState[] = [
    'backlog',
    'active',
    'completed',
    'overdue',
  ];
  private _route = inject(ActivatedRoute);
  private _tasksData = inject(TasksDataService);
  private _filter$ = this._route.data.pipe(map((data) => data?.['filter']));

  currentFilter = toSignal(this._filter$);
  tasks = toSignal(
    this._filter$.pipe(
      switchMap((filter) => {
        const queryFilter = !filter
          ? 'all'
          : this._statuses.find((status) => status === filter.toLowerCase());
        return this._tasksData.getTasks({ filter: queryFilter ?? 'all' });
      }),
    ),
  );
}
