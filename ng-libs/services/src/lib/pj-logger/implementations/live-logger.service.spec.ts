import { LiveLoggerService } from './live-logger.service';
import { LogFns } from '../log-fns.type';
import { TestBed } from '@angular/core/testing';

describe(LiveLoggerService.name, () => {
  let service: LiveLoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LiveLoggerService],
    });
    service = TestBed.inject(LiveLoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const toImplementedFns: Record<keyof LogFns, boolean> = {
    clear: false,
    count: false,
    countReset: false,
    debug: false,
    error: false,
    group: false,
    groupCollapsed: false,
    groupEnd: false,
    info: false,
    log: false,
    table: false,
    trace: false,
    warn: false,
  };

  const toKeys = Object.keys(toImplementedFns) as Array<keyof LogFns>;

  describe.each(toKeys)('to.%s', (key: keyof LogFns) => {
    beforeEach(() => {
      console[key] = jest.fn();
    });

    it('should not throw error', () => {
      expect(() => service.to[key]()).not.toThrow();
    });

    if (toImplementedFns[key]) {
      it('should use console', () => {
        service.to[key]();
        expect(console[key]).toHaveBeenCalled();
      });
    } else {
      it('should not use console', () => {
        service.to[key]();
        expect(console[key]).not.toHaveBeenCalled();
      });
    }
  });
});
