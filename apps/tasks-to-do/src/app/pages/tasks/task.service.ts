import { Injectable, isDevMode } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  order: number;
}

export interface TaskResult {
  status: 'success' | 'error';
  errorMessage?: string;
}

export interface TaskAddResult extends TaskResult {
  task?: Task;
}

@Injectable()
export class TaskService {
  private _tasks: Task[] = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      completed: false,
      order: 1,
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Description 2',
      completed: false,
      order: 2,
    },
    {
      id: '3',
      title: 'Task 3',
      description: 'Description 3',
      completed: false,
      order: 3,
    },
    {
      id: '4',
      title: 'Task 4',
      description: 'Description 4',
      completed: false,
      order: 4,
    },
    {
      id: '5',
      title: 'Task 5',
      description: 'Description 5',
      completed: false,
      order: 5,
    },
  ];

  private createObservable<T>(value: T): Observable<T> {
    // random delay to simulate network latency
    const delayInMs = isDevMode() ? Math.random() * 1000 : 0;
    return of(value).pipe(delay(delayInMs));
  }

  getTasks(): Observable<Task[]> {
    return this.createObservable(this._tasks);
  }

  addTask(task: Omit<Task, 'id'>): Observable<TaskAddResult> {
    const id = Math.random().toString(36);
    const newTask = { ...task, id };
    return this.createObservable<TaskResult>({ status: 'success' }).pipe(
      map((result) => {
        if (result.status === 'success') {
          this._tasks.push(newTask);
          return { ...result, task: newTask };
        }

        return result;
      }),
    );
  }

  deleteTask(id: string): Observable<TaskResult> {
    this._tasks = this._tasks.filter((task) => task.id !== id);
    return this.createObservable({ status: 'success' });
  }

  updateTask(task: Task): Observable<TaskResult> {
    const index = this._tasks.findIndex((t) => t.id === task.id);
    if (index === -1) {
      return this.createObservable({
        status: 'error',
        errorMessage: 'Task not found',
      });
    }
    this._tasks[index] = task;
    return this.createObservable({ status: 'success' });
  }
}
