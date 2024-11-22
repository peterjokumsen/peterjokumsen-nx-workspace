import { Task } from './task';

export interface DescribedTask extends Task {
  contextDescription: string;
  statusDescription: string;
}
