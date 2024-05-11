import { Injectable } from '@angular/core';
import { LogFns } from './log-fns.type';

@Injectable()
export abstract class PjLogger {
  abstract get to(): LogFns;
}
