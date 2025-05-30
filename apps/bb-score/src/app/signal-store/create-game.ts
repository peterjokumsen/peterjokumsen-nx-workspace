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
    'Home Player 1',
    'Home Player 2',
    'Home Player 3',
    'Home Player 4',
    'Home Player 5',
    'Home Player 6',
    'Home Player 7',
    'Home Player 8',
    'Home Player 9',
    'Home Player 10',
    'Home Player 11',
    'Home Player 12',
    'Home Player 13',
    'Home Player 14',
    'Home Player 15',

    'Away Player 1',
    'Away Player 2',
    'Away Player 3',
    'Away Player 4',
    'Away Player 5',
    'Away Player 6',
    'Away Player 7',
    'Away Player 8',
    'Away Player 9',
    'Away Player 10',
    'Away Player 11',
    'Away Player 12',
    'Away Player 13',
    'Away Player 14',
    'Away Player 15',
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
      liveBall: false,
      currentFielders: game.home.positions,
      currentRunners: {},
      actions: [],
    },
  };
}
