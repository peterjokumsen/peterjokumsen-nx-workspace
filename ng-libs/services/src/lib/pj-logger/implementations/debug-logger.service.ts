import { Injectable } from '@angular/core';
import { LogFns } from '../log-fns.type';
import { PjLogger } from '../pj-logger.service';

@Injectable()
export class DebugLoggerService extends PjLogger {
  private readonly _console: LogFns = console;

  get to() {
    return this._console;
  }
}
