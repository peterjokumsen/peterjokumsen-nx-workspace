import { ApplicationConfig, isDevMode } from '@angular/core';
import {
  providePjBrowserProviders,
  providePjLogger,
  providePjTheme,
} from '@peterjokumsen/ng-services';

import { appRoutes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideClientHydration(),
    provideRouter(appRoutes),
    providePjBrowserProviders(),
    providePjLogger({ production: !isDevMode() }),
    providePjTheme(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
