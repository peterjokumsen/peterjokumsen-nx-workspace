import { Injectable } from '@angular/core';
import { BehaviorSubject, first, Observable } from 'rxjs';

export interface Game {
  id: string;
  name: string;
  date: Date;
  status: 'pending' | 'in-progress' | 'completed';
  homeTeam: string;
  awayTeam: string;
}

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private gamesSubject = new BehaviorSubject<Game[]>([]);
  private selectedGameSubject = new BehaviorSubject<Game | null>(null);

  games$ = this.gamesSubject.asObservable();
  selectedGame$ = this.selectedGameSubject.asObservable();

  constructor() {
    // Initialize with some mock data
    this.gamesSubject.next([
      {
        id: '1',
        name: 'Game 1',
        date: new Date(),
        status: 'pending',
        homeTeam: 'Team A',
        awayTeam: 'Team B',
      },
    ]);
  }

  getGames(): Observable<Game[]> {
    return this.games$;
  }

  getGame(id: string): Observable<Game | null> {
    const game = this.gamesSubject.value.find((game) => game.id === id);
    this.selectedGameSubject.next(game ?? null);
    return this.selectedGame$.pipe(first());
  }

  createGame(game: Omit<Game, 'id'>): void {
    const newGame: Game = {
      ...game,
      id: Math.random().toString(36).substring(2, 9),
    };
    this.gamesSubject.next([...this.gamesSubject.value, newGame]);
  }

  updateGame(game: Game): void {
    const games = this.gamesSubject.value.map((g) =>
      g.id === game.id ? game : g,
    );
    this.gamesSubject.next(games);
  }

  deleteGame(gameId: string): void {
    const games = this.gamesSubject.value.filter((g) => g.id !== gameId);
    this.gamesSubject.next(games);
  }
}
