import { GetTasksQuery, Task } from '../models';
import { Injectable, InjectionToken, inject } from '@angular/core';

import { Observable } from 'rxjs';
import { staticTasks } from './static-tasks';

export const TOGGLE_RESPONSE_DELAY = new InjectionToken<boolean>(
  'TOGGLE_RESPONSE_DELAY',
);

@Injectable()
export class TasksDataService {
  private _useResponseDelay =
    inject(TOGGLE_RESPONSE_DELAY, { optional: true }) ?? true;
  private _instanceTasks: Task[] = [...staticTasks];

  private randomizeResponseTime<T>(value: T): Observable<T> {
    const timeout = this._useResponseDelay ? Math.random() * 1000 : 0;
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next(value);
        observer.complete();
      }, timeout);
    });
  }

  getTasks(query?: GetTasksQuery): Observable<Task[]> {
    const filter = query?.filter ?? 'all';
    const tasks = this._instanceTasks.filter((task) => {
      return filter === 'all' || task.status === filter;
    });

    return this.randomizeResponseTime(tasks);
  }
}
