import { ApplicationConfig, isDevMode } from '@angular/core';
import {
  providePjArticleParser,
  providePjBrowserTools,
  providePjLogger,
  providePjTheme,
} from '@peterjokumsen/ng-services';

import { appRoutes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideClientHydration(),
    provideRouter(appRoutes),
    providePjBrowserTools(),
    providePjLogger({ production: !isDevMode() }),
    providePjTheme(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    providePjArticleParser(),
  ],
};
