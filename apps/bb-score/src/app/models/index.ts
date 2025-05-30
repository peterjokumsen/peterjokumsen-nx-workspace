export type BattingPosition = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type GamePosition =
  | 'P'
  | 'C'
  | '1B'
  | '2B'
  | '3B'
  | 'SS'
  | 'LF'
  | 'CF'
  | 'RF';
export type Bases = Extract<GamePosition, '1B' | '2B' | '3B'> | 'H';
export type GameTeam = 'home' | 'away';

export interface Player {
  id: string;
  name: string;
  number: number;
}

export interface GameStats {
  hits?: number;
  errors?: number;
  homeRuns?: number;
  runs?: number;
  earnedRuns?: number;
  strikes?: number;
  balls?: number;
  walks?: number;
  walked?: number;
  walkedByHit?: number;
  struckOut?: number;
  struckOutSwung?: number;
  outs?: number;
  assists?: number;
}

export type PlayerIdentifier = Pick<Player, 'id'>;

export type PlayerWithStats = Player & GameStats;

export interface Lineup {
  teamName: string;
  battingOrder: Record<BattingPosition, PlayerIdentifier>;
  positions: Record<GamePosition, PlayerIdentifier>;
  players: Record<string, PlayerWithStats>;
}

export interface Game extends Record<GameTeam, Lineup> {
  id: string;
  date: string;
}

export interface PitchAction {
  type: 'strike' | 'ball' | 'hit' | 'foul' | 'walk' | 'balk';
  swung?: boolean;
  pitcher: PlayerIdentifier;
  batter: PlayerIdentifier;
}

export interface HitAction {
  type: 'ground' | 'catch' | 'error' | 'home-run';
  fielder: PlayerIdentifier;
  batter: PlayerIdentifier;
}

export interface FieldAction {
  type: 'throw';
  startingFielder: PlayerIdentifier;
  endFielder: PlayerIdentifier;
  result?: { runnerOut: PlayerIdentifier };
}

export interface RunnerAction {
  type: 'steal' | 'picked' | 'progress';
  runner: PlayerIdentifier;
  base: Exclude<Bases, '1B'>;
  fielder?: PlayerIdentifier;
  pitcher?: PlayerIdentifier;
}

export interface SwapPlayerAction {
  type: 'swap-player';
  team: GameTeam;
  newPlayer: PlayerIdentifier;
  oldPlayer: PlayerIdentifier;
}

export interface SwapPositionAction {
  type: 'swap-position';
  team: GameTeam;
  positions: [GamePosition, GamePosition];
}

export interface ManualAction {
  type: 'manual';
  adjustment: 'out' | 'side-away';
}

type AdminActions = SwapPlayerAction | SwapPositionAction | ManualAction;

type UnionKeys<T> = T extends T ? keyof T : never;
export type GameActionKeys = UnionKeys<GameAction>;

export type GameAction =
  | PitchAction
  | HitAction
  | FieldAction
  | RunnerAction
  | AdminActions;

export interface GameStatus {
  inning: number;
  frame: 'top' | 'bottom';
  outs: number;
  strikes: number;
  balls: number;
  batting: {
    home: BattingPosition;
    away: BattingPosition;
  };
  currentFielders: Lineup['positions'];
  currentRunners: Partial<Record<Bases, PlayerIdentifier>>;
  actions: GameAction[];
}

export type InningDetails = Pick<
  GameStatus,
  'inning' | 'frame' | 'outs' | 'balls' | 'strikes'
> & {
  batter: Player;
  pitcher: Player;
};

export interface GameState {
  game: Game;
  status: GameStatus;
}
