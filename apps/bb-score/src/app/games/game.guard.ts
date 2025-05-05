import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { GameService } from './game.service';

export const gameGuard: CanActivateFn = async (route) => {
  const gameService = inject(GameService);
  const router = inject(Router);
  const gameId = route.paramMap.get('id');

  if (!gameId) {
    await router.navigate(['/games']);
    return false;
  }

  const game = await firstValueFrom(gameService.getGame(gameId));
  if (!game) await router.navigate(['/games']);
  return !!game;
};
