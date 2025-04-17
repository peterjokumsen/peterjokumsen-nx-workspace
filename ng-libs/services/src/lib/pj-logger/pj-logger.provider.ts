import { Provider } from '@angular/core';
import { DebugLoggerService } from './implementations/debug-logger.service';
import { LiveLoggerService } from './implementations/live-logger.service';
import { PjLogger } from './pj-logger.service';

export function providePjLogger(env?: { production?: boolean }): Provider[] {
  const implementation = env?.production
    ? LiveLoggerService
    : DebugLoggerService;
  return [implementation, { provide: PjLogger, useExisting: implementation }];
}
