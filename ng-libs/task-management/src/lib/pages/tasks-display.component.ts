import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { TaskViewComponent } from '../components';
import { TasksDataService } from '../services';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'task-mgr-task-summary',
  standalone: true,
  imports: [CommonModule, TaskViewComponent],
  template: `
    <h2>{{ currentStatus() }} tasks</h2>

    <ng-container *ngIf="tasks() as tasks">
      @for (task of tasks; track task.id) {
        <task-mgr-task-view [task]="task"></task-mgr-task-view>
      }
    </ng-container>
  `,
  styles: `
    h2 {
      padding-top: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksDisplayComponent {
  private _tasksData = inject(TasksDataService);
  private _tasks$ = this._tasksData.tasks$;

  currentStatus = toSignal(
    combineLatest([
      this._tasksData.currentStatus$,
      this._tasksData.statusDescriptions$,
    ]).pipe(map(([s, descriptions]) => descriptions[s])),
  );

  tasks = toSignal(this._tasks$);
}
