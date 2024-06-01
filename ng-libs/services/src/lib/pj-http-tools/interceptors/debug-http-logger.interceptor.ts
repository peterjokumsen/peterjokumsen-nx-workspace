import { HttpHandlerFn, HttpRequest } from '@angular/common/http';

import { PjLogger } from '../../pj-logger';
import { finalize } from 'rxjs';
import { inject } from '@angular/core';

export function debugHttpLoggerInterceptor<T>(
  req: HttpRequest<T>,
  next: HttpHandlerFn,
) {
  const logger = inject(PjLogger, { optional: true });
  logger?.to.group(`${req.method} | ${req.url}`);
  return next(req).pipe(
    finalize(() => {
      logger?.to.log('finalize: "%s". headers: %o', req.url, req.headers);
      logger?.to.groupEnd();
    }),
  );
}
