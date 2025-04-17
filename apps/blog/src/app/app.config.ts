import { ApplicationConfig, isDevMode } from '@angular/core';
import {
  providePjBrowserTools,
  providePjHttpTools,
  providePjLogger,
  providePjMarkdownClient,
} from '@peterjokumsen/ng-services';

import { withFetch } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { appInitialRoutes } from './app-initial.routes';

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
    providePjMarkdownClient(),
    providePjHttpTools({ production: !isDevMode() }, withFetch()),
  ],
};
