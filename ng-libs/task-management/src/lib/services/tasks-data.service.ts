import { Injectable, InjectionToken, inject } from '@angular/core';

import { LoadingService } from '@peterjokumsen/loading-indicator';
import { Observable } from 'rxjs';
import { Task } from '../models';
import { staticTasks } from './static-tasks';

export const RESPONSE_DELAY = new InjectionToken<boolean>(
  'TOGGLE_RESPONSE_DELAY',
);

@Injectable()
export class TasksDataService {
  private _loadingService = inject(LoadingService);
  private _useResponseDelay =
    inject(RESPONSE_DELAY, { optional: true }) ?? true;
  private _instanceTasks: Task[] = [...staticTasks];

  private randomizeResponseTime<T>(value: T): Observable<T> {
    const timeout = this._useResponseDelay ? Math.random() * 1000 : 0;
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next(value);
        this._loadingService.completeLoading();
        observer.complete();
      }, timeout);
    });
  }

  getTasks(): Observable<Task[]> {
    this._loadingService.startLoading();
    return this.randomizeResponseTime(this._instanceTasks);
  }
}
