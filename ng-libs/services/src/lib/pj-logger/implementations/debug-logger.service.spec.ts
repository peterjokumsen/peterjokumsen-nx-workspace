import { TestBed } from '@angular/core/testing';
import { LogFns } from '../';
import { DebugLoggerService } from './debug-logger.service';

describe(DebugLoggerService.name, () => {
  let service: DebugLoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DebugLoggerService],
    });
    service = TestBed.inject(DebugLoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('to', () => {
    it('should use console', () => {
      const expectedConsole: Partial<LogFns> = {
        log: console.log,
      };
      expect(service.to).toEqual(expect.objectContaining(expectedConsole));
    });

    describe('group override', () => {
      beforeEach(() => {
        console.time = jest.fn();
        console.timeEnd = jest.fn();
        console.groupCollapsed = jest.fn();
        console.groupEnd = jest.fn();
      });

      describe('calling group', () => {
        it('should use console time and group', () => {
          service.to.group('title');
          expect(console.time).toHaveBeenCalledWith('title');
          expect(console.groupCollapsed).toHaveBeenCalledWith('title');
        });
      });

      describe('calling groupEnd', () => {
        it('should use console groupEnd', () => {
          service.to.groupEnd();
          expect(console.groupEnd).toHaveBeenCalled();
        });

        describe('without group being called', () => {
          it('should not use console timeEnd', () => {
            service.to.groupEnd();
            expect(console.timeEnd).not.toHaveBeenCalled();
          });
        });

        describe('after group called', () => {
          const groupTitle = 'title';

          beforeEach(() => {
            service.to.group(groupTitle);
          });

          it('should use console timeEnd', () => {
            service.to.groupEnd();
            expect(console.timeEnd).toHaveBeenCalledWith(groupTitle);
          });
        });
      });
    });
  });
});
