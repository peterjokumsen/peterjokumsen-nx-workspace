import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  first,
  firstValueFrom,
  map,
  Observable,
  switchMap,
  tap,
} from 'rxjs';
import { startWith } from 'rxjs/operators';
import { GameSnapshot } from './game-score/scoring/models';
import { Game } from './models';

const STORAGE_KEY = 'bb-score-games';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private _gamesSubject = new BehaviorSubject<Game[]>([]);
  private _selectedGameSubject = new BehaviorSubject<Game | null>(null);
  private _loaded = false;
  private _storage = inject(Storage, { optional: true }) ?? localStorage;

  games$ = this._gamesSubject.asObservable();
  selectedGame$ = this._selectedGameSubject.asObservable().pipe(
    switchMap((game) =>
      this.games$.pipe(
        map((games) => games.find((g) => g.id === game?.id)),
        startWith(game),
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
    const games$ = this.getGames();

    return games$.pipe(
      map((games) => games.find((game) => game.id === id) ?? null),
      tap((game) => {
        this._selectedGameSubject.next(game);
      }),
      first(),
    );
  }

  createGame(
    game: Omit<Game, 'id' | 'status' | 'homeLineup' | 'awayLineup'>,
  ): void {
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
