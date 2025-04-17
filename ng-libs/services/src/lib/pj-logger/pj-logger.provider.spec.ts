import { TestBed } from '@angular/core/testing';
import { DebugLoggerService } from './implementations/debug-logger.service';
import { LiveLoggerService } from './implementations/live-logger.service';
import { providePjLogger } from './pj-logger.provider';
import { PjLogger } from './pj-logger.service';

describe(`${PjLogger.name} provider "${providePjLogger.name}"`, () => {
  let service: PjLogger;

  describe.each([true, false, undefined])(
    'when production is %s',
    (production: boolean | undefined) => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          providers:
            production !== undefined
              ? providePjLogger({ production })
              : providePjLogger(),
        });
        service = TestBed.inject(PjLogger);
      });

      it('should be created', () => {
        expect(service).toBeTruthy();
      });

      if (!production) {
        it('should provide DebugLoggerService', () => {
          expect(service).toBeInstanceOf(DebugLoggerService);
        });
      } else {
        it('should provide LiveLoggerService', () => {
          expect(service).toBeInstanceOf(LiveLoggerService);
        });
      }
    },
  );
});
