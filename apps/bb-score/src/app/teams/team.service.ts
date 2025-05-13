import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, switchMap } from 'rxjs';
import { Player, Team, TeamSummary } from './models';

const STORAGE_KEY = 'bb-score-teams';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private _teamsSubject = new BehaviorSubject<Team[]>([]);
  private _selectedTeamIdSubject = new BehaviorSubject<string | null>(null);
  private _loaded = false;
  private _storage = inject(Storage, { optional: true }) ?? localStorage;

  teams$ = this._teamsSubject.asObservable();
  selectedTeam$ = this._selectedTeamIdSubject.pipe(
    switchMap((teamId) =>
      this.getTeams().pipe(
        map((teams) => teams.find((t) => t.id === teamId) ?? null),
      ),
    ),
  );

  private loadTeams(): Team[] {
    if (this._teamsSubject.value?.length > 0) return this._teamsSubject.value;
    this._loaded = true;
    const savedTeams = this._storage.getItem(STORAGE_KEY);
    if (savedTeams) {
      try {
        return JSON.parse(savedTeams);
      } catch (error) {
        console.error('Error loading teams from localStorage:', error);
        return [];
      }
    }
    return [];
  }

  private saveTeams(teams: Team[]): void {
    try {
      this._storage.setItem(STORAGE_KEY, JSON.stringify(teams));
    } catch (error) {
      console.error('Error saving teams to localStorage:', error);
    } finally {
      this._teamsSubject.next(teams);
    }
  }

  getTeams(): Observable<Team[]> {
    const savedTeams = this.loadTeams();
    this._teamsSubject.next(savedTeams);

    return this.teams$;
  }

  getTeamSummaries(): Observable<TeamSummary[]> {
    return this.getTeams().pipe(
      map((teams) =>
        teams.map((team) => {
          return {
            id: team.id,
            name: team.name,
            location: team.location,
            playerCount: team.players?.length ?? 0,
          };
        }),
      ),
    );
  }

  getTeam(id: string): Observable<Team | null> {
    this._selectedTeamIdSubject.next(id);
    return this.selectedTeam$;
  }

  createTeam(team: Omit<Team, 'id' | 'players'>): void {
    const newTeam: Team = {
      ...team,
      id: Math.random().toString(36).substring(2, 9),
      players: [],
    };
    const updatedTeams = [...this.loadTeams(), newTeam];
    this.saveTeams(updatedTeams);
  }

  updateTeam(team: Team): void {
    this.saveTeams(this.loadTeams().map((t) => (t.id === team.id ? team : t)));
    this._selectedTeamIdSubject.next(team.id);
  }

  deleteTeam(teamId: string): void {
    this.saveTeams(this.loadTeams().filter((t) => t.id !== teamId));
    this._selectedTeamIdSubject.next(null);
  }

  addPlayer(
    teamId: string,
    player: Omit<Player, 'id'>,
  ): Observable<Player | null> {
    const team = this.loadTeams().find((t) => t.id === teamId);
    if (!team) return of(null);

    const newPlayer: Player = {
      ...player,
      id: Math.random().toString(36).substring(2, 9),
    };
    const updatedTeam: Team = {
      ...team,
      players: [...team.players, newPlayer],
    };
    this.updateTeam(updatedTeam);
    return of(newPlayer);
  }

  updatePlayer(teamId: string, player: Player): Observable<Player | null> {
    const team = this.loadTeams().find((t) => t.id === teamId);
    if (!team) return of(null);

    const updatedPlayers = team.players.map((p) =>
      p.id === player.id ? player : p,
    );
    const updatedTeam: Team = {
      ...team,
      players: updatedPlayers,
    };
    this.updateTeam(updatedTeam);
    return of(player);
  }

  removePlayer(teamId: string, playerId: string): void {
    const team = this.loadTeams().find((t) => t.id === teamId);
    if (team) {
      const updatedPlayers = team.players.filter((p) => p.id !== playerId);
      const updatedTeam: Team = {
        ...team,
        players: updatedPlayers,
      };
      this.updateTeam(updatedTeam);
    }
  }
}
