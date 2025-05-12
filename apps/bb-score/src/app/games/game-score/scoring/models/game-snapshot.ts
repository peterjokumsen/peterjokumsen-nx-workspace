import { GameState } from './game-state';

export interface GameSnapshot extends GameState {
  pitcherId: string;
  batterId: string;
  runners: Partial<Record<'1' | '2' | '3', string>>;
}
