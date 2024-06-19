import { Injectable } from '@angular/core';
import { LogFns } from '../log-fns.type';
import { PjLogger } from '../pj-logger.service';

@Injectable()
export class DebugLoggerService extends PjLogger {
  private _titles: string[] = [];
  private readonly _console: LogFns = {
    ...console,
    group: (title) => {
      console.groupCollapsed(title);
      console.time(title);
      this._titles.push(title);
    },
    groupEnd: () => {
      if (this._titles.length > 0) {
        const title = this._titles.pop();
        console.timeEnd(title);
      }

      console.groupEnd();
    },
  };

  get to() {
    return this._console;
  }
}
