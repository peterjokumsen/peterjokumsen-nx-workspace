export interface GameState {
  inning: number;
  frame: 'top' | 'bottom';
  outs: number;
  strikes: number;
  balls: number;
}

export const initialGameState: GameState = {
  inning: 1,
  frame: 'top',
  outs: 0,
  strikes: 0,
  balls: 0,
};
