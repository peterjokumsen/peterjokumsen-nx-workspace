import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing.component').then((m) => m.LandingComponent),
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
  {
    path: 'about-me',
    loadComponent: () =>
      import('./pages/about-me.component').then((m) => m.AboutMeComponent),
    data: { title: 'About Me' },
  },
];
