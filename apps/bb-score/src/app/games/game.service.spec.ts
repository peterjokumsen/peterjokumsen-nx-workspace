import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { GameSnapshot } from './game-score/scoring/models';
import { GameService } from './game.service';
import { Game } from './models';

describe('GameService', () => {
  let service: GameService;
  let mockLocalStorage: { [key: string]: string };

  beforeEach(() => {
    mockLocalStorage = {};
    const storage: Pick<Storage, 'getItem' | 'setItem'> = {
      getItem: jest
        .fn()
        .mockImplementation((key: string) => mockLocalStorage[key] || null),
      setItem: jest.fn().mockImplementation((key: string, value: string) => {
        mockLocalStorage[key] = value;
      }),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: Storage, useValue: storage }],
    });
    service = TestBed.inject(GameService);
  });

  afterEach(() => {
    // Clear mock localStorage after each test
    mockLocalStorage = {};
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty array when no saved games exist', (done) => {
    service.getGames().subscribe((games) => {
      expect(games).toHaveLength(0);
      done();
    });
  });

  it('should load saved games from localStorage', async () => {
    const savedGames: Game[] = [
      {
        id: '1',
        date: new Date(),
        status: 'pending',
        homeTeamName: 'Team A',
        awayTeamName: 'Team B',
        homeTeamId: 'a',
        homeLineup: undefined,
        awayTeamId: 'b',
        awayLineup: undefined,
      },
    ];
    mockLocalStorage['bb-score-games'] = JSON.stringify(savedGames);

    const games = await firstValueFrom(service.getGames());
    expect(games).toHaveLength(1);
    expect(games[0].id).toBe('1');
  });

  it('should create a new game and save to localStorage', async () => {
    const newGame: Parameters<GameService['createGame']>[0] = {
      date: new Date(),
      homeTeamName: 'Team C',
      awayTeamName: 'Team D',
      homeTeamId: 'c',
      awayTeamId: 'd',
    };

    service.createGame(newGame);

    const games = await firstValueFrom(service.getGames());
    expect(games).toHaveLength(1);
    const createdGame = games[0];
    expect(createdGame.homeTeamName).toBe('Team C');
    expect(createdGame.awayTeamName).toBe('Team D');
    expect(createdGame.status).toBe('pending');
    expect(createdGame.id).toBeDefined();

    // Verify localStorage was updated
    const savedGames = JSON.parse(mockLocalStorage['bb-score-games']) as Game[];
    expect(savedGames).toHaveLength(1);
  });

  it('should update an existing game and save to localStorage', async () => {
    // First create a game
    const initialGame: Parameters<GameService['createGame']>[0] = {
      date: new Date(),
      homeTeamName: 'Team A',
      awayTeamName: 'Team B',
      homeTeamId: 'a',
      awayTeamId: 'b',
    };
    service.createGame(initialGame);

    // Then update it
    const games = await firstValueFrom(service.getGames());
    const gameId = games[0].id;
    const updatedGame: Game = {
      id: gameId,
      date: new Date(),
      status: 'in-progress',
      homeTeamName: 'Team A',
      awayTeamName: 'Team B',
      homeTeamId: 'a',
      homeLineup: undefined,
      awayTeamId: 'b',
      awayLineup: undefined,
    };

    service.updateGame(updatedGame);

    const updatedGames = await firstValueFrom(service.getGames());
    const game = updatedGames[0];
    expect(game.status).toBe('in-progress');

    // Verify localStorage was updated
    const savedGames = JSON.parse(mockLocalStorage['bb-score-games']) as Game[];
    expect(savedGames[0].status).toBe('in-progress');
  });

  it('should delete a game and update localStorage', async () => {
    // First create a game
    const game: Parameters<GameService['createGame']>[0] = {
      date: new Date(),
      homeTeamId: 'a',
      homeTeamName: 'Team A',
      awayTeamId: 'b',
      awayTeamName: 'Team B',
    };
    service.createGame(game);

    const games = await firstValueFrom(service.getGames());
    const gameId = games[0].id;
    service.deleteGame(gameId);

    const remainingGames = await firstValueFrom(service.getGames());
    expect(remainingGames).toHaveLength(0);

    // Verify localStorage was updated
    const savedGames = JSON.parse(mockLocalStorage['bb-score-games']);
    expect(savedGames).toHaveLength(0);
  });

  it('should get a game by id', async () => {
    // First create a game
    const game: Parameters<GameService['createGame']>[0] = {
      date: new Date(),
      homeTeamName: 'Team A',
      awayTeamName: 'Team B',
      homeTeamId: 'a',
      awayTeamId: 'b',
    };
    service.createGame(game);

    const games = await firstValueFrom(service.getGames());
    const gameId = games[0].id;
    const retrievedGame = await firstValueFrom(service.getGame(gameId));
    expect(retrievedGame).toBeTruthy();
    expect(retrievedGame?.id).toBe(gameId);
  });

  it('should return null for non-existent game', async () => {
    const retrievedGame = await firstValueFrom(service.getGame('non-existent'));
    expect(retrievedGame).toBeNull();
  });

  describe('appendSnapshot', () => {
    let game: Game;
    let snapshot: GameSnapshot;
    let updateGameSpy: jest.SpyInstance;

    beforeEach(() => {
      snapshot = {
        balls: 0,
        batterId: 'b-id',
        frame: 'top',
        inning: 1,
        outs: 0,
        pitcherId: 'p-id',
        runners: {},
        strikes: 0,
        state: 'batting',
        awayScore: 0,
        homeScore: 0,
      };
      game = {
        awayLineup: undefined,
        awayTeamId: undefined,
        awayTeamName: '',
        date: new Date(),
        homeLineup: undefined,
        homeTeamId: undefined,
        homeTeamName: '',
        id: '',
        snapshots: undefined,
        status: 'pending',
      };
      jest.spyOn(service, 'getGame').mockImplementation(() => of(game));
      updateGameSpy = jest
        .spyOn(service, 'updateGame')
        .mockName('updateGame')
        .mockImplementation();
    });

    function assertUpdateUsed(expected: Partial<Game>) {
      expect(updateGameSpy).toHaveBeenCalledWith(
        expect.objectContaining(expected),
      );
    }

    it('should append a snapshot to the game and update it', async () => {
      await service.appendSnapshot('1', snapshot);
      assertUpdateUsed({
        snapshots: [snapshot],
      });
    });

    describe('when game has status "pending"', () => {
      it('should update to "in-progress"', async () => {
        await service.appendSnapshot('1', snapshot);
        assertUpdateUsed({
          status: 'in-progress',
        });
      });
    });

    describe('when game has status "in-progress" with existing snapshot', () => {
      beforeEach(async () => {
        game.status = 'in-progress';
        game.snapshots = [snapshot];

        await service.appendSnapshot('1', snapshot);
      });

      it('should leave status as "in-progress"', () => {
        assertUpdateUsed({
          status: 'in-progress',
        });
      });

      it('should append snapshot', () => {
        assertUpdateUsed({ snapshots: [snapshot, snapshot] });
      });
    });
  });
});
