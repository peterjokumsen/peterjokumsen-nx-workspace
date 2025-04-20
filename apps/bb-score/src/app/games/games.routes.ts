import { Routes } from '@angular/router';
import { GameCreateComponent } from './game-create/game-create.component';
import { GameListComponent } from './game-list/game-list.component';

export const gamesRoutes: Routes = [
  {
    path: '',
    component: GameListComponent,
  },
  {
    path: 'new',
    component: GameCreateComponent,
  },
  {
    path: 'score',
    loadChildren: () =>
      import('./game-score/games-score.routes').then((m) => m.gameScoreRoutes),
  },
];
