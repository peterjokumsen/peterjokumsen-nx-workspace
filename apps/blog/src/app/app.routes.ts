import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing').then((m) => m.LandingComponent),
    data: { title: 'Home' },
  },
  {
    path: 'blog',
    loadChildren: () =>
      import('@peterjokumsen/blog-container').then(
        (m) => m.blogContainerRoutes,
      ),
    // data: { title: 'Blog' },
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
