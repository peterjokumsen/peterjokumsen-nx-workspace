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
    path: 'about-me',
    loadComponent: () =>
      import('./pages/markdown-entry').then((m) => m.MarkdownEntryComponent),
    data: { filePath: 'assets/docs/about-me.md' },
  },
  {
    path: 'development-notes',
    loadComponent: () =>
      import('./pages/markdown-entry').then((m) => m.MarkdownEntryComponent),
    data: { filePath: '/assets/docs/development-notes/README.md' },
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
    providers: [providePjArticleParser()],
  },
];
