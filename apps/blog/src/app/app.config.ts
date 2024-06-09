import { ApplicationConfig, isDevMode } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withPreloading,
} from '@angular/router';
import {
  providePjArticleParser,
  providePjBrowserTools,
  providePjHttpTools,
  providePjLogger,
  providePjTheme,
} from '@peterjokumsen/ng-services';

import { appRoutes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';
import { withFetch } from '@angular/common/http';

const config = { production: !isDevMode() };

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideClientHydration(),
    provideRouter(appRoutes, withPreloading(PreloadAllModules)),
    providePjHttpTools(config, withFetch()),
    providePjLogger(config),
    providePjTheme(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    providePjArticleParser(),
    providePjBrowserTools(),
  ],
};
