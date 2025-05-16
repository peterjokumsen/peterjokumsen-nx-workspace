import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  first,
  firstValueFrom,
  map,
  Observable,
  switchMap,
} from 'rxjs';
import { TeamService } from '../teams';
import { GameSnapshot } from './game-score/scoring/models';
import { Game } from './models';

const STORAGE_KEY = 'bb-score-games';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private _gamesSubject = new BehaviorSubject<Game[]>([]);
  private _selectedGameIdSubject = new BehaviorSubject<string | null>(null);
  private _teamService = inject(TeamService);
  private _teams = toSignal(this._teamService.teams$);
  private _loaded = false;
  private _storage = inject(Storage, { optional: true }) ?? localStorage;

  games$ = this._gamesSubject.asObservable();
  selectedGame$: Observable<Game | null> = this._selectedGameIdSubject
    .asObservable()
    .pipe(
      switchMap((gameId) =>
        this.getGames().pipe(
          map((games) => games.find((g) => g.id === gameId) ?? null),
        ),
      ),
    );

  private loadGames(): Game[] {
    const savedGames = this._storage.getItem(STORAGE_KEY);
    if (savedGames) {
      try {
        const games = JSON.parse(savedGames) as Game[];
        this._loaded = true;

        // Convert date strings back to Date objects
        return games.map((game) => ({
          ...game,
          date: new Date(game.date),
        }));
      } catch (error) {
        console.error('Error loading games from localStorage:', error);
        return [];
      }
    }
    return [];
  }

  private saveGames(games: Game[]): void {
    try {
      this._storage.setItem(STORAGE_KEY, JSON.stringify(games));
    } catch (error) {
      console.error('Error saving games to localStorage:', error);
    }
  }

  resetGames(): void {
    this._gamesSubject.next([]);
    this._loaded = false;
    this._storage.removeItem(STORAGE_KEY);
  }

  getGames(): Observable<Game[]> {
    if (!this._loaded) {
      const savedGames = this.loadGames();
      if (savedGames.length > 0) {
        this._gamesSubject.next(savedGames);
      }
    }

    return this.games$;
  }

  getGame(id: string): Observable<Game | null> {
    this._selectedGameIdSubject.next(id);

    return this.selectedGame$.pipe(first());
  }

  createGame(
    game: Omit<Game, 'id' | 'status' | 'homeLineup' | 'awayLineup'>,
  ): void {
    if (!game?.homeTeamId) {
      let team = this._teams()?.find((t) => t.name === game.homeTeamName);
      if (team) {
        game.homeTeamId = team.id;
      } else {
        team = this._teamService.createTeam({
          name: game.homeTeamName,
          location: '',
        });
        game.homeTeamId = team.id;
      }
    }

    if (!game?.awayTeamId) {
      let team = this._teams()?.find((t) => t.name === game.awayTeamName);
      if (team) {
        game.awayTeamId = team.id;
      } else {
        team = this._teamService.createTeam({
          name: game.awayTeamName,
          location: '',
        });
        game.awayTeamId = team.id;
      }
    }

    const newGame: Game = {
      ...game,
      id: Math.random().toString(36).substring(2, 9),
      status: 'pending',
      homeLineup: {
        starters: [],
        bench: [],
      },
      awayLineup: {
        starters: [],
        bench: [],
      },
    };
    const updatedGames = [...this._gamesSubject.value, newGame];
    this._gamesSubject.next(updatedGames);
    this.saveGames(updatedGames);
  }

  updateGame(game: Game): void {
    const games = this._gamesSubject.value.map((g) =>
      g.id === game.id ? game : g,
    );
    this._gamesSubject.next(games);
    this.saveGames(games);
  }

  deleteGame(gameId: string): void {
    const games = this._gamesSubject.value.filter((g) => g.id !== gameId);
    this._gamesSubject.next(games);
    this.saveGames(games);
  }

  async appendSnapshot(gameId: string, snapshot: GameSnapshot): Promise<void> {
    const game = await firstValueFrom(this.getGame(gameId));
    if (!game) return;
    if (!game.snapshots) {
      game.snapshots = [snapshot];
    } else {
      game.snapshots.push(snapshot);
    }

    switch (game.status) {
      case 'pending':
        game.status = 'in-progress';
        break;
    }

    this.updateGame(game);
  }
}
