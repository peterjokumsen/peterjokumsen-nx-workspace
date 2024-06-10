import { Route } from '@angular/router';

export const appInitialRoutes: Route[] = [
  {
    path: '',
    loadChildren: () => import('./app.routes').then((m) => m.appRoutes),
  },
];
