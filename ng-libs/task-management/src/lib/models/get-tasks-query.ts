import { TaskState } from './task-state';

export interface GetTasksQuery {
  filter?: 'all' | TaskState;
}
