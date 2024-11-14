import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { LoadingService } from './loading.service';

export function provideLoadingIndicator(): EnvironmentProviders {
  return makeEnvironmentProviders([
    // keep split
    LoadingService,
  ]);
}
