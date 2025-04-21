import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, first, Observable } from 'rxjs';
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
  selectedGame$ = this._selectedGameSubject.asObservable();

  private loadGames(): Game[] {
    const savedGames = this._storage.getItem(STORAGE_KEY);
    if (savedGames) {
      try {
        const games = JSON.parse(savedGames);
        // Convert date strings back to Date objects
        return games.map((game: any) => ({
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
    const game = this._gamesSubject.value.find((game) => game.id === id);
    this._selectedGameSubject.next(game ?? null);
    return this.selectedGame$.pipe(first());
  }

  createGame(game: Omit<Game, 'id' | 'status'>): void {
    const newGame: Game = {
      ...game,
      id: Math.random().toString(36).substring(2, 9),
      status: 'pending',
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
}
