import { Routes } from '@angular/router';
import { GameCreateComponent } from './game-create/game-create.component';
import { GameListComponent } from './game-list/game-list.component';
import { GameScoreComponent } from './game-score/game-score.component';

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
    path: 'score/:id',
    component: GameScoreComponent,
  },
];
