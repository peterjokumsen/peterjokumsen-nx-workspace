import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import {
  HttpFeature,
  HttpFeatureKind,
  HttpInterceptorFn,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';

import { debugHttpLoggerInterceptor } from './interceptors';

export function providePjHttpTools(
  options: { production: boolean },
  ...features: HttpFeature<HttpFeatureKind>[]
): EnvironmentProviders {
  const interceptors: HttpInterceptorFn[] = [];
  if (!options.production) {
    interceptors.push(debugHttpLoggerInterceptor);
  }

  return makeEnvironmentProviders([
    provideHttpClient(...features, withInterceptors(interceptors)),
  ]);
}
