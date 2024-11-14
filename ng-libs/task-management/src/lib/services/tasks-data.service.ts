import { Injectable, InjectionToken, inject } from '@angular/core';

import { Observable } from 'rxjs';
import { Task } from '../models';
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

  getTasks(): Observable<Task[]> {
    return this.randomizeResponseTime(this._instanceTasks);
  }
}
