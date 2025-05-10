import { TestBed } from '@angular/core/testing';

import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { LineupService } from './lineup.service';
import { GameService } from '../game.service';
import { Game, StartingPlayer } from '../models';

describe('LineUpService', () => {
  let service: LineupService;
  let gameService: jest.Mocked<Pick<GameService, 'selectedGame$'>>;
  let gameSubject: BehaviorSubject<Game>;

  beforeEach(() => {
    const initialGame: Game = {
      awayLineup: undefined,
      awayTeamId: undefined,
      awayTeamName: '',
      date: new Date(),
      homeLineup: undefined,
      homeTeamId: undefined,
      homeTeamName: '',
      id: '',
      league: '',
      status: 'pending',
    };
    gameSubject = new BehaviorSubject<Game>(initialGame);
    gameService = {
      selectedGame$: gameSubject.asObservable(),
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: GameService, useValue: gameService },
        // actual
        LineupService,
      ],
    });
    service = TestBed.inject(LineupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  function prepareGame() {
    gameSubject.next({
      ...gameSubject.value,
      homeLineup: {
        starters: [
          { playerId: 'id-1', playerNumber: '123', position: 'P' },
          { playerId: 'id-2', playerNumber: '23', position: 'CF' },
          {} as StartingPlayer,
        ],
        bench: [{ playerId: 'id-3', playerNumber: '321' }],
      },
      awayLineup: {
        starters: [
          { playerId: 'id-4', playerNumber: '123', position: '1' },
          { playerId: 'id-5', playerNumber: '23', position: '2' },
          {} as StartingPlayer,
        ],
        bench: [{ playerId: 'id-6', playerNumber: '321' }],
      },
    });
  }

  describe('disabledPositions$', () => {
    beforeEach(() => {
      prepareGame();
    });

    it('should default using home team lineup', async () => {
      const actual = await firstValueFrom(service.disabledPositions$);
      expect(actual).toEqual(['P', 'CF']);
    });

    describe('when side changed', () => {
      it('should use away team lineup', async () => {
        service.sideChanged('away');
        const actual = await firstValueFrom(service.disabledPositions$);
        expect(actual).toEqual(['1', '2']);
      });
    });
  });

  describe('playersUsed$', () => {
    beforeEach(() => {
      prepareGame();
    });

    it('should default using home team lineup', async () => {
      const actual = await firstValueFrom(service.playerIdsUsed$);
      expect(actual).toEqual(['id-1', 'id-2', 'id-3']);
    });

    describe('when side changed', () => {
      it('should use away team lineup', async () => {
        service.sideChanged('away');
        const actual = await firstValueFrom(service.playerIdsUsed$);
        expect(actual).toEqual(['id-4', 'id-5', 'id-6']);
      });
    });
  });
});
