import { signalStore, withState } from '@ngrx/signals';
import { GameState } from '../models';
import { createGameState } from './create-game';
import { inject, InjectionToken } from '@angular/core';

export const GAME_STATE = new InjectionToken<GameState>('GAME_STATE', {
  factory: () => createGameState(),
});

export const GameStore = signalStore(
  withState<GameState>(() => inject(GAME_STATE)),
);
