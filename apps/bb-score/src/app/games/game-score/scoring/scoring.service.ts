import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { GameService } from '../../game.service';
import { Game, GamePlayer, StartingPlayer } from '../../models';
import { GameAction, GameState, initialGameState } from './models';

@Injectable()
export class ScoringService {
  private _gameService = inject(GameService);

  protected _game?: Game;
  protected _awayBench: GamePlayer[] = [];
  protected _awayPlayers: StartingPlayer[] = [];
  protected _homeBench: GamePlayer[] = [];
  protected _homePlayers: StartingPlayer[] = [];
  protected _latestStateSubject = new BehaviorSubject<GameState>(
    initialGameState,
  );

  latestState$ = this._latestStateSubject.asObservable();

  async load() {
    const game =
      (await firstValueFrom(this._gameService.selectedGame$)) ?? null;
    if (!game) {
      // show an error somehow.
      return;
    }
    this._game = game;
    this._awayBench = this._game.awayLineup?.bench ?? [];
    this._awayPlayers = this._game.awayLineup?.starters ?? [];
    this._homeBench = this._game.homeLineup?.bench ?? [];
    this._homePlayers = this._game.homeLineup?.starters ?? [];
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
      });
    }
  }

  updateState(action: GameAction) {
    // to be updated to generate snapshot and append to game...
  }
}
