import { TestBed } from '@angular/core/testing';

import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { GameService } from '../../game.service';
import { Game, Position, StartingPlayer } from '../../models';
import { GameSnapshot, GameState } from './models';
import { ScoringService } from './scoring.service';

@Injectable()
class ScoringServiceSpec extends ScoringService {
  get awayBench() {
    return this._awayBench;
  }
  get awayPlayers() {
    return this._awayPlayers;
  }

  get homeBench() {
    return this._homeBench;
  }
  get homePlayers() {
    return this._homePlayers;
  }
}

describe('ScoringService', () => {
  let service: ScoringServiceSpec;
  let gameService: Pick<
    jest.Mocked<GameService>,
    'selectedGame$' | 'appendSnapshot'
  >;
  let gameSubject: BehaviorSubject<Game | null>;

  let initialGame: Game;

  beforeEach(() => {
    const positions: Position[] = [
      'P',
      'C',
      '1',
      '2',
      '3',
      'SS',
      'LF',
      'CF',
      'RF',
    ];
    initialGame = {
      awayLineup: {
        starters: positions.map(
          (position, i): StartingPlayer => ({
            playerId: `a-${i}`,
            playerNumber: `${i + 1}`,
            position,
            playerLabel: '',
          }),
        ),
        bench: [
          { playerId: 'a-10', playerNumber: '11', playerLabel: '' },
          { playerId: 'a-11', playerNumber: '12', playerLabel: '' },
        ],
      },
      awayTeamId: 'a-1',
      awayTeamName: 'Away',
      date: new Date(),
      homeLineup: {
        starters: positions.map(
          (position, i): StartingPlayer => ({
            playerId: `h-${i}`,
            playerNumber: `${i + 1}`,
            position,
            playerLabel: '',
          }),
        ),
        bench: [
          { playerId: 'h-10', playerNumber: '11', playerLabel: '' },
          { playerId: 'h-11', playerNumber: '12', playerLabel: '' },
        ],
      },
      homeTeamId: 'h-1',
      homeTeamName: 'Home',
      id: '',
      snapshots: undefined,
      status: 'pending',
    };
    gameSubject = new BehaviorSubject<Game | null>(null);
    gameService = {
      selectedGame$: gameSubject.asObservable(),
      appendSnapshot: jest.fn().mockName('updateScoreState'),
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: GameService, useValue: gameService },
        // sut
        ScoringService,
        ScoringServiceSpec,
      ],
    });
    service = TestBed.inject(ScoringServiceSpec);
  });

  it('should be created', () => {
    expect(TestBed.inject(ScoringService)).toBeTruthy();
  });

  describe('load', () => {
    describe('when selected game has no snapshots', () => {
      beforeEach(async () => {
        gameSubject.next({ ...initialGame });
        await service.load();
      });

      it('should set home players', () => {
        expect(service.homeBench).toEqual(initialGame.homeLineup?.bench);
        expect(service.homePlayers).toEqual(initialGame.homeLineup?.starters);
      });

      it('should set away players', () => {
        expect(service.awayBench).toEqual(initialGame.awayLineup?.bench);
        expect(service.awayPlayers).toEqual(initialGame.awayLineup?.starters);
      });

      it('should update score state', async () => {
        const state = await firstValueFrom(service.latestState$);
        const expected: GameState = {
          balls: 0,
          frame: 'top',
          inning: 1,
          outs: 0,
          strikes: 0,
        };
        expect(state).toEqual(expected);
      });

      it('should append snapshot', () => {
        const snapshot: GameSnapshot = {
          balls: 0,
          batterId: 'a-0',
          frame: 'top',
          inning: 1,
          outs: 0,
          pitcherId: 'h-0',
          runners: {},
          strikes: 0,
        };
        expect(gameService.appendSnapshot).toHaveBeenCalledWith(
          initialGame.id,
          snapshot,
        );
      });
    });
  });
});
