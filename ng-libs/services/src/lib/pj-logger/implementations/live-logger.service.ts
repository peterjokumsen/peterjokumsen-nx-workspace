import { Injectable } from '@angular/core';
import { LogFns } from '../log-fns.type';
import { PjLogger } from '../pj-logger.service';

@Injectable()
export class LiveLoggerService extends PjLogger {
  private readonly _emptyFn = () => {
    /* Do nothing */
  };

  private readonly _liveLogger: LogFns = {
    clear: this._emptyFn,
    count: this._emptyFn,
    countReset: this._emptyFn,
    debug: this._emptyFn,
    error: this._emptyFn,
    group: this._emptyFn,
    groupCollapsed: this._emptyFn,
    groupEnd: this._emptyFn,
    info: this._emptyFn,
    log: this._emptyFn,
    table: this._emptyFn,
    trace: this._emptyFn,
    warn: this._emptyFn,
  };

  get to() {
    return this._liveLogger;
  }
}
