import {
  providePjArticleParser,
  providePjBrowserTools,
  providePjLogger,
  providePjTheme,
} from '@peterjokumsen/ng-services';

import { PrimaryComponent } from './primary.component';
import { Route } from '@angular/router';
import { isDevMode } from '@angular/core';

const config = { production: !isDevMode() };

export const childRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing').then((m) => m.LandingComponent),
    data: { title: 'Home' },
  },
  {
    path: 'development-notes',
    loadComponent: () =>
      import('./pages/development-notes').then(
        (m) => m.DevelopmentNotesComponent,
      ),
    data: { title: 'Development Notes' },
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found').then((m) => m.NotFoundComponent),
  },
];

export const appRoutes: Route[] = [
  {
    path: '',
    component: PrimaryComponent,
    loadChildren: () => childRoutes,
    providers: [
      providePjArticleParser(),
      providePjBrowserTools(),
      providePjLogger(config),
      providePjTheme(),
    ],
  },
];
