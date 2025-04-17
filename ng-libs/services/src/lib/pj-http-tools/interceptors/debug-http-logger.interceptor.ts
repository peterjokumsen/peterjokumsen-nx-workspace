import { HttpHandlerFn, HttpRequest } from '@angular/common/http';

import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { PjLogger } from '../../pj-logger';

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
