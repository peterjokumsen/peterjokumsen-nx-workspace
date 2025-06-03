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
  Game,
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
const balkEvent = event('BALK');
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
const hitEvent = event('HIT');
const foulEvent = event('FOUL');

function incrementStat(
  player: PlayerWithStats,
  stat: keyof GameStats,
  diff = 1,
) {
  player[stat] = (player[stat] ?? 0) + diff;
  return player;
}

function incrementPitcherStat(
  status: GameStatus,
  game: Game,
  stat: keyof GameStats,
  diff = 1,
) {
  const fieldingTeam = getTeam('field', status.frame);
  const fielders = game[fieldingTeam];
  const pitcher = fielders.players[fielders.positions.P.id];
  fielders.players[pitcher.id] = incrementStat(
    fielders.players[pitcher.id],
    stat,
    diff,
  );
  return { fieldingTeam, fielders };
}

function incrementBatterStat(
  status: GameStatus,
  game: Game,
  stat: keyof GameStats,
  diff = 1,
) {
  const battingTeam = getTeam('bat', status.frame);
  const batters = game[battingTeam];
  const battingOrder = batters.battingOrder;
  const currentPosition = status.batting[battingTeam];
  const batterId = battingOrder[currentPosition].id;
  const batter = batters.players[batterId];
  batters.players[batter.id] = incrementStat(
    batters.players[batter.id],
    stat,
    diff,
  );
  return { battingTeam, batters };
}

function isBasesLoaded(
  runners: Partial<Record<Bases, PlayerIdentifier>>,
): boolean {
  return !!runners['3B']?.id && !!runners['2B']?.id && !!runners['1B']?.id;
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
        case 'batter-hit':
          dispatcher.dispatch(nextBatterEvent({ stat: 'walkedByHit' }));
          break;
        case 'balk':
          dispatcher.dispatch(balkEvent());
          break;
        case 'hit':
          dispatcher.dispatch(hitEvent());
          break;
        case 'foul':
          dispatcher.dispatch(foulEvent());
          break;
        case 'progress': {
          const runners = state.status.currentRunners();
          const runner = action.runner;
          const current = Object.entries(runners).find(
            ([, p]) => p?.id === runner.id,
          ) as [Bases, PlayerIdentifier];
          if (current && current[0] !== action.base) {
            delete runners[current[0]];
          }

          if (action.base === 'H') {
            const batting = getTeam('bat', state.status.frame());
            const batters = state.game()[batting];
            batters.players[runner.id] = incrementStat(
              batters.players[runner.id],
              'runs',
            );
            patchState(state, {
              game: {
                ...state.game(),
                [batting]: batters,
              },
              status: {
                ...state.status(),
              },
            });
          } else {
            runners[action.base] = runner;
            patchState(state, {
              game: { ...state.game() },
              status: { ...gameStatus, currentRunners: runners },
            });
          }
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
          const { fieldingTeam, fielders } = incrementPitcherStat(
            status,
            currentGame,
            'strikes',
          );
          status.strikes++;

          patchState(state, {
            game: {
              ...currentGame,
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
          const { fieldingTeam, fielders } = incrementPitcherStat(
            status,
            currentGame,
            event.payload.stat.startsWith('walk') ? 'walks' : 'outs',
          );
          const { battingTeam, batters } = incrementBatterStat(
            status,
            currentGame,
            event.payload.stat,
          );
          const batter = state.currentBatter();
          // Increment batting order
          let battingOrder = status.batting[battingTeam];
          battingOrder = battingOrder + 1;
          if (battingOrder > 9) battingOrder = 1;
          status.batting[battingTeam] = battingOrder as BattingPosition;
          const runners = { ...status.currentRunners };
          switch (event.payload.stat) {
            case 'walked':
            case 'walkedByHit': {
              if (isBasesLoaded(runners)) {
                batters.players[batter.id] = incrementStat(
                  batters.players[batter.id],
                  'earnedRuns',
                );
              }
              status.currentRunners['1B'] = { id: batter.id };

              break;
            }
            case 'struckOutSwung':
            case 'struckOut':
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

          if (event.payload.stat.startsWith('walk')) {
            if (runners['1B']) {
              state.update({
                type: 'progress',
                runner: runners['1B'],
                base: '2B',
              });

              if (runners['2B']) {
                state.update({
                  type: 'progress',
                  runner: runners['2B'],
                  base: '3B',
                });

                if (runners['3B']) {
                  state.update({
                    type: 'progress',
                    runner: runners['3B'],
                    base: 'H',
                  });
                }
              }
            }
          }
        }),
      ),
      ballCount$: events.on(ballEvent).pipe(
        tap(() => {
          const status = state.status();
          const currentGame = state.game();
          const { fieldingTeam, fielders } = incrementPitcherStat(
            status,
            currentGame,
            'balls',
          );
          status.balls++;

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
      onBalk$: events.on(balkEvent).pipe(
        tap(() => {
          const status = state.status();
          const game = state.game();
          const { fieldingTeam, fielders } = incrementPitcherStat(
            status,
            game,
            'balks',
          );
          patchState(state, {
            game: { ...game, [fieldingTeam]: fielders },
            status,
          });

          for (const [base, runner] of Object.entries(
            state.status.currentRunners(),
          ) as Array<[Bases, PlayerIdentifier]>) {
            let nextBase: Bases = '2B';
            switch (base) {
              case '2B':
                nextBase = '3B';
                break;
              case '3B':
                nextBase = 'H';
                break;
            }

            state.update({ type: 'progress', runner, base: nextBase });
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

          patchState(state, { game, status });
        }),
      ),
      onHit$: events.on(hitEvent).pipe(
        tap(() => {
          const { battingTeam, batters } = incrementBatterStat(
            state.status(),
            state.game(),
            'hits',
          );
          patchState(state, {
            game: {
              ...state.game(),
              [battingTeam]: batters,
            },
            status: { ...state.status(), liveBall: true },
          });
        }),
      ),
      onFoul$: events.on(foulEvent).pipe(
        tap(() => {
          const status = state.status();
          if (status.strikes < 2) status.strikes++;
          const { fieldingTeam, fielders } = incrementPitcherStat(
            status,
            state.game(),
            'strikes',
          );
          const { battingTeam, batters } = incrementBatterStat(
            status,
            state.game(),
            'fouls',
          );
          patchState(state, {
            game: {
              ...state.game(),
              [battingTeam]: batters,
              [fieldingTeam]: fielders,
            },
            status: { ...status, liveBall: false },
          });
        }),
      ),
    }),
  ),
);
