import {
  BattingPosition,
  Game,
  GamePosition,
  GameState,
  Lineup,
  Player,
  PlayerIdentifier,
} from '../models';

function createPositions(
  players: Player[],
): Record<GamePosition, PlayerIdentifier> {
  const positions: GamePosition[] = [
    '1B',
    '2B',
    '3B',
    'SS',
    'LF',
    'CF',
    'RF',
    'P',
    'C',
  ];
  return positions.reduce(
    (acc, position, i) => {
      acc[position] = { id: players[i].id };
      return acc;
    },
    {} as Record<GamePosition, PlayerIdentifier>,
  );
}

function createBattingOrder(
  players: Player[],
): Record<BattingPosition, PlayerIdentifier> {
  const batting: BattingPosition[] = [1, 9, 2, 3, 4, 5, 6, 7, 8];
  return batting.reduce(
    (acc, position, i) => {
      acc[position] = { id: players[i].id };
      return acc;
    },
    {} as Record<BattingPosition, PlayerIdentifier>,
  );
}

function createLineup(teamName: string, players: Player[]): Lineup {
  return {
    teamName,
    battingOrder: createBattingOrder(players.slice(0, 9)),
    positions: createPositions(players.slice(0, 9)),
    players: players.reduce(
      (acc, player) => {
        acc[player.id] = player;
        return acc;
      },
      {} as Record<string, Player>,
    ),
  };
}

export function createGame(): Game {
  const names: string[] = [
    'Alica Mueller',
    'Ben Keighley',
    'Jett Creswick',
    'Alyssa Gepp',
    'Jayden Cade',
    'John Joseland',
    'Kai Wakehurst',
    'Riley Kaawirn',
    'Isabella Bowden',
    'Hayley Goldberg',
    'Matthew Johnston',
    'Alicia Wand',
    'Charlotte Ellery',
    'Eva Deasey',
    'Toby Bremer',

    'Andrew Watson',
    'Nancy Wells',
    'Devin Harder',
    'Jeffrey Ramirez',
    'Jack Sweet',
    'Lucy Morales',
    'Jonathan McDermott',
    'Julius Tay',
    'James Grossman',
    'Robert Michel',
    'April Cochran',
    'Jamie Young',
    'William Richart',
    'Sally McKay',
    'Amanda Bell',
  ];
  const homePlayers: Player[] = names.splice(0, 15).map((name, i) => ({
    id: `h${i}`,
    name,
    number: i + 1,
  }));
  const awayPlayers: Player[] = names.splice(0, 15).map((name, i) => ({
    id: `a${i}`,
    name,
    number: i + 1,
  }));

  return {
    id: '1',
    date: '1984-10-31',
    home: createLineup('Home Team', homePlayers),
    away: createLineup('Away Team', awayPlayers),
  };
}

export function createGameState(): GameState {
  const game = createGame();
  return {
    game,
    status: {
      inning: 1,
      frame: 'top',
      outs: 0,
      strikes: 0,
      balls: 0,
      batting: {
        home: 1,
        away: 1,
      },
      currentFielders: game.home.positions,
      currentRunners: { '1B': { id: 'a1' }, '3B': { id: 'a4' } },
      actions: [],
    },
  };
}
