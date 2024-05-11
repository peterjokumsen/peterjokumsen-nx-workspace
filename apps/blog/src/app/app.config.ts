import { ApplicationConfig, isDevMode } from '@angular/core';
import {
  providePjBrowserProviders,
  providePjLogger,
} from '@peterjokumsen/ng-services';

import { appRoutes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideRouter(appRoutes),
    providePjLogger({ production: !isDevMode() }),
    providePjBrowserProviders(),
  ],
};
