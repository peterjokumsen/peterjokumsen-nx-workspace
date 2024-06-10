import { ApplicationConfig, isDevMode } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withPreloading,
} from '@angular/router';

import { appInitialRoutes } from './app-initial.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration } from '@angular/platform-browser';
import { providePjHttpTools } from '@peterjokumsen/ng-services';
import { provideServiceWorker } from '@angular/service-worker';
import { withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideClientHydration(),
    provideRouter(appInitialRoutes, withPreloading(PreloadAllModules)),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    providePjHttpTools({ production: !isDevMode() }, withFetch()),
  ],
};
