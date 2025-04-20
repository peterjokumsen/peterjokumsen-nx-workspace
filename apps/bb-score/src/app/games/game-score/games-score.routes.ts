import { Route } from '@angular/router';
import { GameScoreContainerComponent } from './game-score-container.component';

export const gameScoreRoutes: Route[] = [
  {
    path: ':id',
    component: GameScoreContainerComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./game-score-view.component').then(
            (m) => m.GameScoreViewComponent,
          ),
      },
      {
        path: 'score',
        loadComponent: () =>
          import('./game-score-edit.component').then(
            (m) => m.GameScoreEditComponent,
          ),
      },
      {
        path: 'manage',
        loadComponent: () =>
          import('./game-score-manage.component').then(
            (m) => m.GameScoreManageComponent,
          ),
      },
    ],
  },
];
