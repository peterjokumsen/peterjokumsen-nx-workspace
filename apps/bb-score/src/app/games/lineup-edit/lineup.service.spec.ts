import { TestBed } from '@angular/core/testing';

import { firstValueFrom } from 'rxjs';
import { StartingPlayer } from '../models';
import { LineupService } from './lineup.service';

describe('LineUpService', () => {
  let service: LineupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // sut
        LineupService,
      ],
    });
    service = TestBed.inject(LineupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  function prepareGame(team: 'home' | 'away' = 'home') {
    if (team === 'home') {
      service.populateLineupForm({
        starters: [
          {
            playerId: 'id-1',
            playerNumber: '123',
            position: 'P',
            playerLabel: '',
          },
          {
            playerId: 'id-2',
            playerNumber: '23',
            position: 'CF',
            playerLabel: '',
          },
          {} as StartingPlayer,
        ],
        bench: [{ playerId: 'id-3', playerNumber: '321', playerLabel: '' }],
      });
    } else {
      service.populateLineupForm({
        starters: [
          {
            playerId: 'id-4',
            playerNumber: '123',
            position: '1',
            playerLabel: '',
          },
          {
            playerId: 'id-5',
            playerNumber: '23',
            position: '2',
            playerLabel: '',
          },
          {} as StartingPlayer,
        ],
        bench: [{ playerId: 'id-6', playerNumber: '321', playerLabel: '' }],
      });
    }
  }

  describe('disabledPositions$', () => {
    beforeEach(() => {
      prepareGame();
    });

    it('should use lineup in use', async () => {
      const actual = await firstValueFrom(service.disabledPositions$);
      expect(actual).toEqual(['P', 'CF']);
    });
  });

  describe('playersUsed$', () => {
    beforeEach(() => {
      prepareGame();
    });

    it('should lineup in use', async () => {
      const actual = await firstValueFrom(service.playerIdsUsed$);
      expect(actual).toEqual(['id-1', 'id-2', 'id-3']);
    });
  });
});
