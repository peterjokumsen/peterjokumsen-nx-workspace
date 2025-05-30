import { computed, inject, InjectionToken } from '@angular/core';
import {
  patchState,
  signalStore,
  type,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Dispatcher, event, Events, withEffects } from '@ngrx/signals/events';
import { tap } from 'rxjs';
import {
  Bases,
  BattingPosition,
  GameAction,
  GamePosition,
  GameState,
  GameStats,
  GameStatus,
  GameTeam,
  InningDetails,
  PitchAction,
  Player,
  PlayerIdentifier,
  PlayerWithStats,
} from '../models';
import { createGameState } from './create-game';

export const GAME_STATE = new InjectionToken<GameState>('GAME_STATE', {
  factory: () => createGameState(),
});

const strikeEvent = event('STRIKE', type<{ action: PitchAction }>());
const ballEvent = event('BALL', type<{ action: PitchAction }>());
const outEvent = event('BATTER_OUT', type<{ count: number }>());
const nextBatterEvent = event(
  'NEXT_BATTER',
  type<{
    stat: Extract<
      keyof GameStats,
      'struckOut' | 'struckOutSwung' | 'walked' | 'walkedByHit'
    >;
  }>(),
);

function incrementStat(
  player: PlayerWithStats,
  stat: keyof GameStats,
  diff = 1,
) {
  player[stat] = (player[stat] ?? 0) + diff;
  return player;
}

function getTeam<T extends 'field' | 'bat'>(
  type: T,
  frame: GameStatus['frame'],
): GameTeam {
  switch (type) {
    case 'field':
      return frame === 'top' ? 'home' : 'away';
    case 'bat':
      return frame === 'top' ? 'away' : 'home';
  }
}

export const GameStore = signalStore(
  withState<GameState>(() => inject(GAME_STATE)),
  withComputed(({ game, status }) => ({
    /**
     * Computes the current runners on bases for the batting team.
     *
     * This computed signal transforms the raw runner data into a fully populated array
     * of Player objects with their corresponding base positions. It:
     * 1. Gets the current batting team's details
     * 2. Retrieves the current runners from game status
     * 3. Maps each runner's ID to their full player details
     * 4. Adds the base position to each player object
     *
     * @returns An array of Player objects extended with their current base position
     */
    runners: computed(() => {
      const teamDetails = game()[getTeam('bat', status().frame)];
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
    /**
     * A computed property that retrieves the current batter's details based on the game state.
     *
     * This function dynamically resolves the current batter by:
     * - Accessing the batting team's details from the game state.
     * - Determining the current position in the batting order for the active team.
     * - Fetching the batter's ID from the batting order.
     * - Returning the corresponding player's details from the batting team's player list.
     *
     * @returns {Object} An object representing the current batter's details, as defined in the team's player data.
     */
    currentBatter: computed(() => {
      const team = getTeam('bat', status().frame);
      const currentGame = game();
      const teamDetails = currentGame[team];
      const battingOrder = teamDetails.battingOrder;
      const currentPosition = status().batting[team];
      const batterId = battingOrder[currentPosition].id;
      return teamDetails.players[batterId];
    }),
    players: computed(() => {
      const currentGame = game();
      return {
        ...currentGame.away.players,
        ...currentGame.home.players,
      };
    }),
    actions: computed(() => {
      const actions = status().actions;
      return actions;
    }),
  })),
  withComputed(({ game, status }) => ({
    /**
     * A computed property that generates an array of fielding players with their respective positions.
     * This combines player details with their positions from the fielding team's data.
     *
     * @returns {Array<Player & { position: GamePosition }>} An array of player objects each containing player details and their fielding position.
     */
    fieldingPlayers: computed(() => {
      const teamDetails = game()[getTeam('field', status().frame)];
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
    /**
     * A computed property that retrieves the current pitcher from the fielding team.
     *
     * This function accesses the current game state and extracts the fielding team's details.
     * It specifically identifies the pitcher based on the fielding team's player positions
     * and retrieves the corresponding player information.
     *
     * @returns {Object} The player object representing the current pitcher.
     */
    currentPitcher: computed(() => {
      const teamDetails = game()[getTeam('field', status().frame)];
      const pitcherId = teamDetails.positions.P.id;
      return teamDetails.players[pitcherId];
    }),
  })),
  withComputed(({ status, currentPitcher, currentBatter }) => ({
    /**
     * Represents a computed property that provides details about the current inning in a baseball game.
     *
     * This property retrieves the current game status and calculates relevant inning information, including inning number,
     * number of outs, frame (top/bottom), number of balls, strikes, and the current pitcher and batter.
     *
     * @property {InningDetails} inningDetails - A computed object containing detailed information about the current inning.
     * @returns {Object} An object containing the following keys:
     *   - `inning` {number}: The current inning in the game.
     *   - `outs` {number}: The number of outs in the current inning.
     *   - `frame` {string}: Indicates whether the game is in the "top" or "bottom" half of the inning.
     *   - `balls` {number}: The number of balls in the current pitch count.
     *   - `strikes` {number}: The number of strikes in the current pitch count.
     *   - `pitcher` {Object}: Information about the current pitcher.
     *   - `batter` {Object}: Information about the current batter.
     */
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
      gameStatus.actions = [action, ...gameStatus.actions];
      patchState<GameState>(state, {
        game: {
          ...state.game(),
        },
        status: { ...gameStatus },
      });

      switch (action.type) {
        case 'strike':
          dispatcher.dispatch(strikeEvent({ action }));
          break;
        case 'ball': {
          dispatcher.dispatch(ballEvent({ action }));
          break;
        }
      }
    },
  })),
  withEffects(
    (state, events = inject(Events), dispatcher = inject(Dispatcher)) => ({
      strikeCount$: events.on(strikeEvent).pipe(
        tap((event) => {
          const status = state.status();
          const currentGame = state.game();
          const fieldingTeam = getTeam('field', state.status().frame);
          const fielders = currentGame[fieldingTeam];
          const pitcher = state.currentPitcher();
          status.strikes++;
          fielders.players[pitcher.id] = incrementStat(
            fielders.players[pitcher.id],
            'strikes',
          );
          const game = state.game();

          patchState(state, {
            game: {
              ...game,
              [fieldingTeam]: fielders,
            },
            status,
          });

          if (status.strikes === 3) {
            dispatcher.dispatch(
              nextBatterEvent({
                stat: event.payload.action.swung
                  ? 'struckOutSwung'
                  : 'struckOut',
              }),
            );
          }
        }),
      ),
      nextBatter$: events.on(nextBatterEvent).pipe(
        tap((event) => {
          const status = state.status();
          const currentGame = state.game();
          const fieldingTeam = getTeam('field', state.status().frame);
          const fielders = currentGame[fieldingTeam];
          const pitcher = state.currentPitcher();
          const battingTeam = getTeam('bat', state.status().frame);
          const batters = currentGame[battingTeam];
          const batter = state.currentBatter();
          batters.players[batter.id] = incrementStat(
            batters.players[batter.id],
            event.payload.stat,
          );
          // Increment batting order
          let battingOrder = status.batting[battingTeam];
          battingOrder = battingOrder + 1;
          if (battingOrder > 9) battingOrder = 1;
          status.batting[battingTeam] = battingOrder as BattingPosition;
          switch (event.payload.stat) {
            case 'walked':
            case 'walkedByHit':
              fielders.players[pitcher.id] = incrementStat(
                fielders.players[pitcher.id],
                'walks',
              );
              break;
            case 'struckOutSwung':
            case 'struckOut':
              fielders.players[pitcher.id] = incrementStat(
                fielders.players[pitcher.id],
                'outs',
              );
              status.outs++;
              dispatcher.dispatch(outEvent({ count: status.outs }));
              break;
          }

          status.balls = 0;
          status.strikes = 0;
          patchState(state, {
            game: {
              ...currentGame,
              [battingTeam]: batters,
              [fieldingTeam]: fielders,
            },
            status,
          });
        }),
      ),
      ballCount$: events.on(ballEvent).pipe(
        tap(() => {
          const status = state.status();
          const currentGame = state.game();
          const fieldingTeam = getTeam('field', state.status().frame);
          const fielders = currentGame[fieldingTeam];
          const pitcher = state.currentPitcher();
          status.balls++;
          fielders.players[pitcher.id] = incrementStat(
            fielders.players[pitcher.id],
            'balls',
          );

          patchState(state, {
            game: {
              ...currentGame,
              [fieldingTeam]: fielders,
            },
            status,
          });

          if (status.balls === 4) {
            dispatcher.dispatch(nextBatterEvent({ stat: 'walked' }));
          }
        }),
      ),
      outCount$: events.on(outEvent).pipe(
        tap((event) => {
          if (event.payload.count < 3) return;
          const status = state.status();
          const game = state.game();
          status.outs = 0;
          if (status.frame === 'bottom') status.inning++;
          status.frame = status.frame === 'top' ? 'bottom' : 'top';
          console.log('patching status', status);

          patchState(state, { game, status });
        }),
      ),
    }),
  ),
);
