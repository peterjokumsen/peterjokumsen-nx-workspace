import {
  patchState,
  signalStore,
  type,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  Bases,
  BattingPosition,
  GameAction,
  GamePosition,
  GameState,
  GameTeam,
  InningDetails,
  Player,
  PlayerIdentifier,
} from '../models';
import { createGameState } from './create-game';
import { computed, inject, InjectionToken } from '@angular/core';
import { Dispatcher, event, Events, withEffects } from '@ngrx/signals/events';
import { tap } from 'rxjs';

export const GAME_STATE = new InjectionToken<GameState>('GAME_STATE', {
  factory: () => createGameState(),
});

const strikeEvent = event('STRIKE', type<{ strikes: number }>());
const outEvent = event('BATTER_OUT', type<{ count: number }>());

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
  withComputed(({ status, currentPitcher, currentBatter }) => ({
    inningDetails: computed<InningDetails>(() => {
      const { inning, outs, frame, balls, strikes } = status();
      return {
        inning,
        outs,
        frame,
        balls,
        strikes,
        pitcher: currentPitcher(),
        batter: currentBatter(),
      };
    }),
  })),
  withMethods((state, dispatcher = inject(Dispatcher)) => ({
    update(action: GameAction): void {
      const gameStatus = state.status();
      gameStatus.actions.unshift(action);
      const currentGame = state.game();
      const fieldingTeam =
        gameStatus.frame === 'top' ? currentGame.home : currentGame.away;
      const battingTeam =
        gameStatus.frame === 'top' ? currentGame.away : currentGame.home;
      switch (action.type) {
        case 'strike': {
          const pitcher = action.pitcher;
          gameStatus.strikes++;
          dispatcher.dispatch(strikeEvent({ strikes: gameStatus.strikes }));
          fieldingTeam.players[pitcher.id].pitches =
            (fieldingTeam.players[pitcher.id].pitches ?? 0) + 1;
          fieldingTeam.players[pitcher.id].strikes =
            (fieldingTeam.players[pitcher.id].strikes ?? 0) + 1;
          break;
        }
      }

      patchState<GameState>(state, {
        game: {
          ...currentGame,
          away: gameStatus.frame === 'top' ? battingTeam : fieldingTeam,
          home: gameStatus.frame === 'top' ? fieldingTeam : battingTeam,
        },
        status: { ...gameStatus },
      });
    },
  })),
  withEffects(
    (state, events = inject(Events), dispatcher = inject(Dispatcher)) => ({
      strikeCount$: events.on(strikeEvent).pipe(
        tap((event) => {
          if (event.payload.strikes < 3) return;
          const game = state.game();
          const status = state.status();
          status.outs++;
          status.balls = 0;
          status.strikes = 0;
          const batter = state.currentBatter();
          const pitcher = state.currentPitcher();
          const fielders = status.frame === 'top' ? game.home : game.away;
          const batters = status.frame === 'top' ? game.away : game.home;
          fielders.players[pitcher.id].outs =
            (fielders.players[pitcher.id].outs ?? 0) + 1;
          batters.players[batter.id].strikeOuts =
            (batters.players[batter.id].strikeOuts ?? 0) + 1;
          let batting =
            status.frame === 'top' ? status.batting.away : status.batting.home;
          batting = batting + 1;
          if (batting > 9) batting = 1;
          if (status.frame === 'top')
            status.batting.away = batting as BattingPosition;
          else status.batting.home = batting as BattingPosition;
          dispatcher.dispatch(outEvent({ count: status.outs }));
          patchState(state, {
            game: {
              ...game,
              away: status.frame === 'top' ? batters : fielders,
              home: status.frame === 'top' ? fielders : batters,
            },
            status,
          });
        }),
      ),
      outCount$: events.on(outEvent).pipe(
        tap((event) => {
          if (event.payload.count < 3) return;
          const status = state.status();
          const game = state.game();
          status.outs = 0;
          status.frame = status.frame === 'top' ? 'bottom' : 'top';
          patchState(state, { game, status });
        }),
      ),
    }),
  ),
);
