import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Player, Team, TeamSummary } from './models';

const STORAGE_KEY = 'bb-score-teams';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private _teamsSubject = new BehaviorSubject<Team[]>([]);
  private _selectedTeamSubject = new BehaviorSubject<Team | null>(null);
  private _loaded = false;
  private _storage = inject(Storage, { optional: true }) ?? localStorage;

  teams$ = this._teamsSubject.asObservable();
  selectedTeam$ = this._selectedTeamSubject.asObservable();

  private loadTeams(): Team[] {
    if (this._teamsSubject.value.length > 0) return this._teamsSubject.value;
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
    }
  }

  getTeams(): Observable<TeamSummary[]> {
    if (!this._loaded) {
      const savedTeams = this.loadTeams();
      if (savedTeams.length > 0) {
        this._teamsSubject.next(savedTeams);
      }
      this._loaded = true;
    }

    return this.teams$.pipe(
      map((teams) =>
        teams.map((team) => {
          const leagues = team.players
            .flatMap((p) => p.league ?? [])
            .filter((v, i, a) => a.indexOf(v) === i);
          return {
            id: team.id,
            name: team.name,
            location: team.location,
            leagues,
            playerCount: team.players?.length ?? 0,
          };
        }),
      ),
    );
  }

  getTeam(id: string): Observable<Team | null> {
    const team = this.loadTeams().find((team) => team.id === id);
    this._selectedTeamSubject.next(team ?? null);
    return this.selectedTeam$;
  }

  createTeam(team: Omit<Team, 'id' | 'players'>): void {
    const newTeam: Team = {
      ...team,
      id: Math.random().toString(36).substring(2, 9),
      players: [],
    };
    const updatedTeams = [...this.loadTeams(), newTeam];
    this._teamsSubject.next(updatedTeams);
    this.saveTeams(updatedTeams);
  }

  updateTeam(team: Team): void {
    const teams = this.loadTeams().map((t) => (t.id === team.id ? team : t));
    this._teamsSubject.next(teams);
    this._selectedTeamSubject.next(team);
    this.saveTeams(teams);
  }

  deleteTeam(teamId: string): void {
    const teams = this.loadTeams().filter((t) => t.id !== teamId);
    this._teamsSubject.next(teams);
    this._selectedTeamSubject.next(null);
    this.saveTeams(teams);
  }

  addPlayer(teamId: string, player: Omit<Player, 'id'>): void {
    const team = this.loadTeams().find((t) => t.id === teamId);
    if (team) {
      const newPlayer: Player = {
        ...player,
        id: Math.random().toString(36).substring(2, 9),
      };
      const updatedTeam: Team = {
        ...team,
        players: [...team.players, newPlayer],
      };
      this.updateTeam(updatedTeam);
    }
  }

  updatePlayer(teamId: string, player: Player): void {
    const team = this.loadTeams().find((t) => t.id === teamId);
    if (team) {
      const updatedPlayers = team.players.map((p) =>
        p.id === player.id ? player : p,
      );
      const updatedTeam: Team = {
        ...team,
        players: updatedPlayers,
      };
      this.updateTeam(updatedTeam);
    }
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
