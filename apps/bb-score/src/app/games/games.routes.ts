import { Routes } from '@angular/router';
import { GameListComponent } from './game-list/game-list.component';

export const gamesRoutes: Routes = [
  {
    path: '',
    component: GameListComponent,
  },
  {
    path: 'score',
    loadChildren: () =>
      import('./game-score/games-score.routes').then((m) => m.gameScoreRoutes),
  },
];
