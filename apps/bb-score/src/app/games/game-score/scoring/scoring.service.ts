import { inject, Injectable } from '@angular/core';
import { delay, firstValueFrom, map } from 'rxjs';
import { Player, TeamService } from '../../../teams';
import { GameService } from '../../game.service';
import { Game, GamePlayer, StartingPlayer } from '../../models';
import { GameAction, GameSnapshot, initialGameState } from './models';

@Injectable()
export class ScoringService {
  private _gameService = inject(GameService);
  private _teamService = inject(TeamService);

  protected _game?: Game;
  protected _awayBench: Required<GamePlayer>[] = [];
  protected _awayPlayers: Required<StartingPlayer>[] = [];
  protected _homeBench: Required<GamePlayer>[] = [];
  protected _homePlayers: Required<StartingPlayer>[] = [];
  protected _players: Record<string, Player> = {};

  latestState$ = this._gameService.selectedGame$.pipe(
    map((g) => {
      const snaps = g?.snapshots ?? [];
      return snaps[snaps.length - 1] ?? initialGameState;
    }),
  );
  fielders$ = this.latestState$.pipe(
    map((s) => (s.frame === 'top' ? this._homePlayers : this._awayPlayers)),
  );

  private adjustBattingOrder(
    players: Required<StartingPlayer>[],
  ): Required<StartingPlayer>[] {
    const current = players.shift();
    if (!current) return [];
    return [...players, current];
  }

  private nextBatter(state: GameSnapshot): void {
    if (state.frame === 'top') {
      this._awayPlayers = this.adjustBattingOrder(this._awayPlayers);
    } else {
      this._homePlayers = this.adjustBattingOrder(this._homePlayers);
    }
  }

  protected onWalk(action: GameAction, state: GameSnapshot): GameSnapshot {
    this.nextBatter(state);
    const currentBatter = state.batterId;
    const runners = { ...state.runners };
    state.runners['1'] = currentBatter;
    /*
    This is ugly... needs to be improved
     */
    if (runners['1']) {
      state.runners['2'] = runners['1'];
      if (runners['2']) {
        state.runners['3'] = runners['2'];
        if (runners['3']) {
          // todo: figure out a way to record which player scored and add an RBI for the batter.
          if (state.frame === 'top') {
            state.awayScore = (state.awayScore || 0) + 1;
          } else {
            state.homeScore = (state.homeScore || 0) + 1;
          }
        }
      }
    }

    const nextBatter =
      state.frame === 'top' ? this._awayPlayers[0] : this._homePlayers[0];
    return {
      ...state,
      strikes: 0,
      balls: 0,
      batterId: nextBatter?.playerId ?? '',
    };
  }

  protected onBall(action: GameAction, state: GameSnapshot): GameSnapshot {
    const ballCount = state.balls + 1;
    if (ballCount === 4) {
      return this.onWalk(action, state);
    }

    return {
      ...state,
      balls: ballCount,
    };
  }

  protected onSideAway(action: GameAction, state: GameSnapshot): GameSnapshot {
    const inning = state.frame === 'bottom' ? state.inning + 1 : state.inning;
    const frame = state.frame === 'bottom' ? 'top' : 'bottom';
    const batter =
      state.frame === 'top' ? this._homePlayers[0] : this._awayPlayers[0];
    const pitcher =
      state.frame === 'top'
        ? this._awayPlayers.find((p) => p.position === 'P')
        : this._homePlayers.find((p) => p.position === 'P');

    return {
      ...state,
      inning,
      frame,
      outs: 0,
      strikes: 0,
      balls: 0,
      batterId: batter?.playerId ?? '',
      pitcherId: pitcher?.playerId ?? '',
      runners: {},
      state: 'batting',
    };
  }

  protected onOut(action: GameAction, state: GameSnapshot): GameSnapshot {
    const outCount = state.outs + 1;
    this.nextBatter(state);

    if (outCount === 3) {
      return this.onSideAway(action, state);
    }

    const batter =
      state.frame === 'top' ? this._awayPlayers[0] : this._homePlayers[0];
    return {
      ...state,
      outs: outCount,
      strikes: 0,
      balls: 0,
      batterId: batter?.playerId ?? '',
    };
  }

  protected onStrike(action: GameAction, state: GameSnapshot): GameSnapshot {
    const strikeCount = state.strikes + 1;
    if (strikeCount === 3) {
      return this.onOut(action, state);
    }

    return {
      ...state,
      strikes: strikeCount,
    };
  }

  async updateState(action: GameAction) {
    if (!this._game) return;
    const state = await firstValueFrom(this.latestState$);
    switch (action.type) {
      case 'strike':
        await this._gameService.appendSnapshot(
          this._game.id,
          this.onStrike(action, state),
        );
        break;
      case 'ball':
        await this._gameService.appendSnapshot(
          this._game.id,
          this.onBall(action, state),
        );
        break;
    }
  }

  async load(): Promise<'ready' | 'failed'> {
    const game =
      (await firstValueFrom(
        this._gameService.selectedGame$.pipe(delay(2000)),
      )) ?? null;
    if (!game) {
      // show an error somehow.
      return 'failed';
    }
    this._game = game;
    const mapPlayer = (player: GamePlayer) => ({
      ...player,
      playerId: player.playerId ?? '',
      playerNumber: player.playerNumber,
      playerLabel: player.playerLabel,
    });

    const mapStarter = (player: StartingPlayer) => ({
      ...mapPlayer(player),
      position: player.position ?? 'P',
    });

    this._awayBench = (this._game.awayLineup?.bench ?? [])
      .filter((p) => p.playerId)
      .map(mapPlayer);

    this._awayPlayers = (this._game.awayLineup?.starters ?? []).map(mapStarter);

    this._homeBench = (this._game.homeLineup?.bench ?? [])
      .filter((p) => p.playerId)
      .map(mapPlayer);
    this._homePlayers = (this._game.homeLineup?.starters ?? []).map(mapStarter);

    const teams = await firstValueFrom(
      this._teamService
        .getTeams()
        .pipe(
          map((teams) =>
            teams.filter(
              (t) => t.id === game.homeTeamId || t.id === game.awayTeamId,
            ),
          ),
        ),
    );

    this._players = teams.reduce((acc, team) => {
      for (const p of team.players) {
        acc[p.id] = p;
      }
      return acc;
    }, this._players);
    console.log('players', this._players, teams);

    if (this._game.snapshots) {
      // TODO: hydrate game from snapshots...
    } else {
      const pitcher = this._homePlayers.find((p) => p.position === 'P');
      const batter = this._awayPlayers[0];
      await this._gameService.appendSnapshot(this._game.id, {
        balls: 0,
        batterId: batter?.playerId ?? '',
        frame: 'top',
        inning: 1,
        outs: 0,
        pitcherId: pitcher?.playerId ?? '',
        runners: {},
        strikes: 0,
        state: 'fielding',
        awayScore: 0,
        homeScore: 0,
      });
    }

    return 'ready';
  }

  async switchState() {
    if (!this._game) return;
    const latest = await firstValueFrom(this.latestState$);
    await this._gameService.appendSnapshot(this._game.id, {
      ...latest,
      state: latest.state === 'fielding' ? 'batting' : 'fielding',
    });
  }

  getPlayer(playerId: string): Player | undefined {
    return this._players[playerId];
  }
}
