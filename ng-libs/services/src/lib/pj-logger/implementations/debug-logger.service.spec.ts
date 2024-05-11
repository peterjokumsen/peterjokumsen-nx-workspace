import { DebugLoggerService } from './debug-logger.service';
import { TestBed } from '@angular/core/testing';

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
      expect(service.to).toBe(console);
    });
  });
});
