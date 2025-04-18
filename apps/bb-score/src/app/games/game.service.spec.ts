import { TestBed } from '@angular/core/testing';
import { GameService } from './game.service';
import { Game } from './models';

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with mock data', (done) => {
    service.getGames().subscribe((games) => {
      expect(games.length).toBe(1);
      expect(games[0].id).toBe('1');
      expect(games[0].league).toBe('League A');
      expect(games[0].status).toBe('pending');
      done();
    });
  });

  it('should create a new game', (done) => {
    const newGame: Omit<Game, 'id'> = {
      league: 'League 1',
      date: new Date(),
      status: 'pending',
      homeTeam: 'Team C',
      awayTeam: 'Team D',
    };

    service.createGame(newGame);

    service.getGames().subscribe((games) => {
      expect(games.length).toBe(2);
      const createdGame = games.find((g) => g.league === 'League 1');
      expect(createdGame).toBeTruthy();
      expect(createdGame?.homeTeam).toBe('Team C');
      expect(createdGame?.awayTeam).toBe('Team D');
      done();
    });
  });

  it('should update an existing game', (done) => {
    const updatedGame: Game = {
      id: '1',
      league: 'League 2',
      date: new Date(),
      status: 'in-progress',
      homeTeam: 'Team A',
      awayTeam: 'Team B',
    };

    service.updateGame(updatedGame);

    service.getGames().subscribe((games) => {
      const game = games.find((g) => g.id === '1');
      expect(game?.league).toBe('League 2');
      expect(game?.status).toBe('in-progress');
      done();
    });
  });

  it('should delete a game', (done) => {
    service.deleteGame('1');

    service.getGames().subscribe((games) => {
      expect(games.length).toBe(0);
      done();
    });
  });

  it('should get a game by id', (done) => {
    service.getGame('1').subscribe((game) => {
      expect(game).toBeTruthy();
      expect(game?.id).toBe('1');
      done();
    });
  });

  it('should return null for non-existent game', (done) => {
    service.getGame('non-existent').subscribe((game) => {
      expect(game).toBeNull();
      done();
    });
  });
});
