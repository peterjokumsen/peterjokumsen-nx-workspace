import { Route } from '@angular/router';
import { gameGuard } from '../game.guard';
import { GameScoreContainerComponent } from './game-score-container.component';

export const gameScoreRoutes: Route[] = [
  {
    path: ':id',
    component: GameScoreContainerComponent,
    canActivate: [gameGuard],
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
        loadChildren: () =>
          import('./scoring/scoring.routes').then((r) => r.scoringRoutes),
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
