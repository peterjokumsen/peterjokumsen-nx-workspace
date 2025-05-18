export interface GameState {
  inning: number;
  frame: 'top' | 'bottom';
  outs: number;
  strikes: number;
  balls: number;
  awayScore: number;
  homeScore: number;
}
