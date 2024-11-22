import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

import { CommonModule } from '@angular/common';
import { LoadingIndicatorComponent } from '@peterjokumsen/loading-indicator';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { TaskState } from './models';
import { TasksDataService } from './services';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'task-mgr-task-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    LoadingIndicatorComponent,
    ReactiveFormsModule,
    MatIcon,
    MatToolbar,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatButton,
  ],
  providers: [TasksDataService],
  templateUrl: './task-management.component.html',
  styleUrl: './task-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskManagementComponent {
  private _tasksDataService = inject(TasksDataService);
  private _mappedContext$ = combineLatest([
    this._tasksDataService.currentContext$,
    this._tasksDataService.contextDescriptions$,
  ]).pipe(map(([c, descriptions]) => descriptions[c]));

  statuses$ = this._tasksDataService.statuses$;
  contexts$ = this._tasksDataService.contexts$;

  currentContext = toSignal(this._mappedContext$);

  onFilterChange(type: 'context' | 'status', value: string) {
    if (type === 'context') {
      this._tasksDataService.selectContext(value);
    } else {
      this._tasksDataService.selectStatus(value as TaskState | 'all');
    }
  }
}
