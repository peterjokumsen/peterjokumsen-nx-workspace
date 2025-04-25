import { Player } from './player';

export interface Team {
  id: string;
  name: string;
  location?: string;
  players: Player[];
}
