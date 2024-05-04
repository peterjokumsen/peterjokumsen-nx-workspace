import { BlogContainerComponent } from './blog-container.component';
import { Route } from '@angular/router';

export const blogContainerRoutes: Route[] = [
  {
    path: '',
    component: BlogContainerComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/blog-index/blog-index.component').then(
            (c) => c.BlogIndexComponent,
          ),
      },
      {
        path: ':title',
        loadComponent: () =>
          import('./pages/blog-entry/blog-entry.component').then(
            (c) => c.BlogEntryComponent,
          ),
      },
    ],
  },
];
