import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
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
    data: { title: 'Blog' },
  },
];
