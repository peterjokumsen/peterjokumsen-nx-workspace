import { HttpCallCountService } from './http-call-count.service';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

describe('HttpCallCountService', () => {
  let service: HttpCallCountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpCallCountService],
    });
    service = TestBed.inject(HttpCallCountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('increment', () => {
    it('should increment count', async () => {
      service.increment();
      const result = await firstValueFrom(service.count$);
      expect(result).toBe(1);
    });
  });

  describe('decrement', () => {
    it('should decrement count', async () => {
      service.increment();
      service.increment();
      service.decrement();
      const result = await firstValueFrom(service.count$);
      expect(result).toBe(1);
    });

    it('should not go below 0', async () => {
      service.decrement();
      const result = await firstValueFrom(service.count$);
      expect(result).toBe(0);
    });
  });
});
