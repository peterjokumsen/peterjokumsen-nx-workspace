import {
  BehaviorSubject,
  Observable,
  combineLatest,
  debounceTime,
  delay,
  finalize,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { DescribedTask, OptionDetail, Task, TaskState } from '../models';
import { Injectable, InjectionToken, inject } from '@angular/core';

import { LoadingService } from '@peterjokumsen/loading-indicator';
import { staticTasks } from './static-tasks';

export const USE_DELAY = new InjectionToken<boolean>('TOGGLE_RESPONSE_DELAY');

const storageKeys = {
  context: 'currentContext',
  status: 'currentStatus',
};

@Injectable()
export class TasksDataService {
  private _loadingService = inject(LoadingService);
  private _useResponseDelay = inject(USE_DELAY, { optional: true }) ?? true;
  private _instanceTasks: Task[] = [...staticTasks];

  private _currentContext = new BehaviorSubject(
    localStorage?.getItem(storageKeys.context) || 'general',
  );
  private _currentStatus = new BehaviorSubject(
    (localStorage?.getItem(storageKeys.status) || 'active') as
      | TaskState
      | 'all',
  );

  currentStatus$ = this._currentStatus
    .asObservable()
    .pipe(tap((status) => localStorage.setItem(storageKeys.status, status)));

  statuses$ = this.getReferences('status').pipe(
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  statusDescriptions$ = this.statuses$.pipe(
    map((statuses) => this.reduceOptions(statuses)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  currentContext$ = this._currentContext
    .asObservable()
    .pipe(tap((context) => localStorage.setItem(storageKeys.context, context)));

  contexts$ = this.getReferences('context').pipe(
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  contextDescriptions$ = this.contexts$.pipe(
    map((contexts) => this.reduceOptions(contexts)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  tasks$ = combineLatest([this.currentContext$, this.currentStatus$]).pipe(
    debounceTime(10),
    switchMap(([context, status]) =>
      this.getTasks(context, status).pipe(startWith([])),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  private reduceOptions(options: OptionDetail[]): Record<string, string> {
    return options.reduce(
      (acc, option) => {
        acc[option.value] = option.label;
        return acc;
      },
      {} as Record<string, string>,
    );
  }

  private randomizeResponseTime<T>(value: T): Observable<T> {
    const timeout = this._useResponseDelay ? Math.random() * 1000 : 0;
    return of(null).pipe(
      tap(() => this._loadingService.startLoading()),
      delay(timeout),
      switchMap(() => of(value)),
      finalize(() => this._loadingService.completeLoading()),
    );
  }

  private getReferences(
    type: 'status' | 'context',
  ): Observable<OptionDetail[]> {
    switch (type) {
      case 'status': {
        const statuses: Record<TaskState, string> = {
          active: 'Active',
          backlog: 'Backlog',
          completed: 'Completed',
          overdue: 'Overdue',
        };
        return this.randomizeResponseTime([
          { value: 'all', label: 'All', sequence: 0 },
          ...Object.entries(statuses).map(([value, label], sequence) => ({
            value,
            label,
            sequence: sequence + 1,
          })),
        ]);
      }
      case 'context': {
        return this.randomizeResponseTime([
          { value: 'general', label: 'General', sequence: 0 },
          { value: 'work', label: 'Work', sequence: 1 },
          { value: 'personal', label: 'Personal', sequence: 2 },
        ]);
      }
      default: {
        const _: never = type;
        throw new Error(`Unhandled type for references: ${type}`);
      }
    }
  }

  private getTasks(
    context: string,
    status: TaskState | 'all',
  ): Observable<DescribedTask[]> {
    return this.randomizeResponseTime(this._instanceTasks).pipe(
      map((tasks) => {
        if (status !== 'all') {
          tasks = tasks.filter((task) => task.status === status);
        }

        return tasks.map((task) => ({
          ...task,
          description: `${context.toUpperCase()} - ${task.description}`,
        }));
      }),
      switchMap((tasks) => {
        return combineLatest([
          this.contextDescriptions$,
          this.statusDescriptions$,
        ]).pipe(
          map(([contexts, statuses]) => {
            return tasks.map((task) => ({
              ...task,
              contextDescription: contexts[context],
              statusDescription: statuses[task.status ?? 'active'],
            }));
          }),
        );
      }),
    );
  }

  selectContext(context: string): void {
    this._currentContext.next(context);
  }

  selectStatus(status: TaskState | 'all'): void {
    this._currentStatus.next(status);
  }
}
