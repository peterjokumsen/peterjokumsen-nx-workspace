import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
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
        league: 'League A',
      },
    ];
    mockLocalStorage['bb-score-games'] = JSON.stringify(savedGames);

    const games = await firstValueFrom(service.getGames());
    expect(games).toHaveLength(1);
    expect(games[0].id).toBe('1');
    expect(games[0].league).toBe('League A');
  });

  it('should create a new game and save to localStorage', async () => {
    const newGame: Omit<Game, 'id' | 'status'> = {
      league: 'League 1',
      date: new Date(),
      homeTeamName: 'Team C',
      awayTeamName: 'Team D',
    };

    service.createGame(newGame);

    const games = await firstValueFrom(service.getGames());
    expect(games).toHaveLength(1);
    const createdGame = games[0];
    expect(createdGame.league).toBe('League 1');
    expect(createdGame.homeTeamName).toBe('Team C');
    expect(createdGame.awayTeamName).toBe('Team D');
    expect(createdGame.status).toBe('pending');
    expect(createdGame.id).toBeDefined();

    // Verify localStorage was updated
    const savedGames = JSON.parse(mockLocalStorage['bb-score-games']);
    expect(savedGames).toHaveLength(1);
    expect(savedGames[0].league).toBe('League 1');
  });

  it('should update an existing game and save to localStorage', async () => {
    // First create a game
    const initialGame: Omit<Game, 'id' | 'status'> = {
      league: 'League 1',
      date: new Date(),
      homeTeamName: 'Team A',
      awayTeamName: 'Team B',
    };
    service.createGame(initialGame);

    // Then update it
    const games = await firstValueFrom(service.getGames());
    const gameId = games[0].id;
    const updatedGame: Game = {
      id: gameId,
      league: 'League 2',
      date: new Date(),
      status: 'in-progress',
      homeTeamName: 'Team A',
      awayTeamName: 'Team B',
    };

    service.updateGame(updatedGame);

    const updatedGames = await firstValueFrom(service.getGames());
    const game = updatedGames[0];
    expect(game.league).toBe('League 2');
    expect(game.status).toBe('in-progress');

    // Verify localStorage was updated
    const savedGames = JSON.parse(mockLocalStorage['bb-score-games']);
    expect(savedGames[0].league).toBe('League 2');
    expect(savedGames[0].status).toBe('in-progress');
  });

  it('should delete a game and update localStorage', async () => {
    // First create a game
    const game: Omit<Game, 'id' | 'status'> = {
      league: 'League 1',
      date: new Date(),
      homeTeamName: 'Team A',
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
    const game: Omit<Game, 'id' | 'status'> = {
      league: 'League 1',
      date: new Date(),
      homeTeamName: 'Team A',
      awayTeamName: 'Team B',
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
});
