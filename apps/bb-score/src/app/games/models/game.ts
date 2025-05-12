import { GameSnapshot } from '../game-score/scoring/models';

export interface GamePlayer {
  playerId?: string;
  playerNumber: string;
}

export type Position = 'P' | 'C' | '1' | '2' | '3' | 'SS' | 'LF' | 'CF' | 'RF';

export interface StartingPlayer extends GamePlayer {
  position?: Position;
}

export interface Lineup {
  starters: StartingPlayer[];
  bench: GamePlayer[];
}

export type GameWithTeam<T extends 'home' | 'away'> = {
  [K in `${T}TeamId` | `${T}TeamName` | `${T}Lineup`]: K extends `${T}TeamId`
    ? string | undefined
    : K extends `${T}TeamName`
      ? string
      : K extends `${T}Lineup`
        ? Lineup | undefined
        : never;
};

type Combined = GameWithTeam<'home'> & GameWithTeam<'away'>;

export interface Game extends Combined {
  id: string;
  date: Date;
  league: string;
  status: 'pending' | 'in-progress' | 'completed';
  snapshots?: Array<GameSnapshot>;
}
