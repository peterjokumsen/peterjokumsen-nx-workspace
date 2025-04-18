export interface Game {
  id: string;
  date: Date;
  league: string;
  status: 'pending' | 'in-progress' | 'completed';
  homeTeam: string;
  awayTeam: string;
}
