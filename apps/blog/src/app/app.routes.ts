import { Route } from '@angular/router';
import { providePjArticleParser } from '@peterjokumsen/ng-services';
import { PrimaryComponent } from './primary.component';

export const childRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing').then((m) => m.LandingComponent),
    data: { title: 'Home' },
  },
  {
    path: 'articles/:articlePath',
    loadComponent: () =>
      import('./pages/markdown-entry').then((m) => m.MarkdownEntryComponent),
  },
  {
    path: '404',
    loadComponent: () =>
      import('./pages/not-found').then((m) => m.NotFoundComponent),
  },
  {
    path: '**',
    redirectTo: '404',
  },
];

export const appRoutes: Route[] = [
  {
    path: '',
    component: PrimaryComponent,
    loadChildren: () => childRoutes,
    providers: [providePjArticleParser()],
  },
];
