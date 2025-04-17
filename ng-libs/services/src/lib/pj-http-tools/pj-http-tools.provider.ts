import {
  HttpFeature,
  HttpFeatureKind,
  HttpInterceptorFn,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import {
  debugHttpLoggerInterceptor,
  httpCountInterceptor,
} from './interceptors';

import { HttpCallCountService } from './http-call-count.service';

export function providePjHttpTools(
  options: { production: boolean },
  ...features: HttpFeature<HttpFeatureKind>[]
): EnvironmentProviders {
  const interceptors: HttpInterceptorFn[] = [httpCountInterceptor];
  if (!options.production) {
    interceptors.push(debugHttpLoggerInterceptor);
  }

  return makeEnvironmentProviders([
    provideHttpClient(...features, withInterceptors(interceptors)),
    HttpCallCountService,
  ]);
}
