import { TaskState } from './task-state';

export interface Task {
  id: string;
  title: string;
  description: string;
  notes: string;
  dueDate: string;
  completed: boolean;
  status?: TaskState;
}
