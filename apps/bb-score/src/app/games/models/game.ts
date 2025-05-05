export interface Game {
  id: string;
  date: Date;
  league: string;
  status: 'pending' | 'in-progress' | 'completed';
  homeTeamId?: string;
  homeTeamName: string;
  awayTeamId?: string;
  awayTeamName: string;
}
