import { PrimaryComponent } from './primary.component';
import { Route } from '@angular/router';
import { providePjArticleParser } from '@peterjokumsen/ng-services';

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
      import('./pages/about-me').then((m) => m.AboutMeComponent),
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
    providers: [providePjArticleParser()],
  },
];
