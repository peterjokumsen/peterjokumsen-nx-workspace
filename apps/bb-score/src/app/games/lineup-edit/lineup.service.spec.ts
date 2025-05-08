import { TestBed } from '@angular/core/testing';

import { firstValueFrom } from 'rxjs';
import { LineupService } from './lineup.service';

describe('LineUpService', () => {
  let service: LineupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LineupService],
    });
    service = TestBed.inject(LineupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('disabledPositions$', () => {
    it('should default with empty array', async () => {
      const actual = await firstValueFrom(service.disabledPositions$);
      expect(actual).toEqual([]);
    });

    it('should emit value passed in to updateDisabledPositions', async () => {
      service.updateDisabledPositions(['P', 'CF']);
      const actual = await firstValueFrom(service.disabledPositions$);
      expect(actual).toEqual(['P', 'CF']);
    });
  });
});
