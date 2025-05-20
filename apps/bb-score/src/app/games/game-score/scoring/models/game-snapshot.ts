import { GameActionTypes } from './game-action';
import { GameState } from './game-state';

export interface GameSnapshot extends GameState {
  pitcherId: string;
  batterId: string;
  runners: Partial<Record<'1' | '2' | '3', string>>;
  state: 'batting' | 'fielding';
  hit?: 'hit' | 'fielded' | 'caught' | 'foul';
  currentAction?: GameActionTypes;
}

export const initialGameState: GameSnapshot = {
  inning: 1,
  frame: 'top',
  outs: 0,
  strikes: 0,
  balls: 0,
  pitcherId: '',
  batterId: '',
  runners: {},
  state: 'batting',
  awayScore: 0,
  homeScore: 0,
};
