import { ApplicationConfig, isDevMode } from '@angular/core';
import {
  providePjBrowserTools,
  providePjHttpTools,
  providePjLogger,
  providePjTheme,
} from '@peterjokumsen/ng-services';

import { appInitialRoutes } from './app-initial.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideClientHydration(),
    provideRouter(appInitialRoutes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),

    providePjBrowserTools(),
    providePjLogger({ production: !isDevMode() }),
    providePjTheme(),
    providePjHttpTools({ production: !isDevMode() }, withFetch()),
  ],
};
