import {
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  Bases,
  GameAction,
  GamePosition,
  GameState,
  GameTeam,
  Player,
  PlayerIdentifier,
} from '../models';
import { createGameState } from './create-game';
import { computed, inject, InjectionToken } from '@angular/core';

export const GAME_STATE = new InjectionToken<GameState>('GAME_STATE', {
  factory: () => createGameState(),
});

export const GameStore = signalStore(
  withState<GameState>(() => inject(GAME_STATE)),
  withComputed(({ status }) => ({
    fieldingTeam: computed(
      (): GameTeam => (status().frame === 'top' ? 'home' : 'away'),
    ),
    battingTeam: computed(
      (): GameTeam => (status().frame === 'top' ? 'away' : 'home'),
    ),
  })),
  withComputed(({ game, status, battingTeam }) => ({
    runners: computed(() => {
      const teamDetails = game()[battingTeam()];
      const runners = Object.entries(status().currentRunners) as Array<
        [Bases, PlayerIdentifier]
      >;
      return runners.reduce(
        (arr, [base, p]) => {
          const player = teamDetails.players[p.id];
          arr.push({ ...player, base });
          return arr;
        },
        [] as Array<Player & { base: Bases }>,
      );
    }),
    currentBatter: computed(() => {
      const teamDetails = game()[battingTeam()];
      const battingOrder = teamDetails.battingOrder;
      const currentPosition = status().batting[battingTeam()];
      const batterId = battingOrder[currentPosition].id;
      return teamDetails.players[batterId];
    }),
  })),
  withComputed(({ game, fieldingTeam }) => ({
    fieldingPlayers: computed(() => {
      const teamDetails = game()[fieldingTeam()];
      const details = Object.entries(teamDetails.positions) as Array<
        [GamePosition, PlayerIdentifier]
      >;
      return details.reduce(
        (arr, [position, p]) => {
          const player = teamDetails.players[p.id];
          arr.push({ ...player, position });
          return arr;
        },
        [] as Array<Player & { position: GamePosition }>,
      );
    }),
    currentPitcher: computed(() => {
      const teamDetails = game()[fieldingTeam()];
      const pitcherId = teamDetails.positions.P.id;
      return teamDetails.players[pitcherId];
    }),
  })),
  withMethods((state) => ({
    update(action: GameAction): void {
      console.log('update: ', action, 'state: ', state);
    },
  })),
);
