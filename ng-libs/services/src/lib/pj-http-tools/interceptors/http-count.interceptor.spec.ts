import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';

import { TestBed } from '@angular/core/testing';
import { HttpCallCountService } from '../';
import { httpCountInterceptor } from './http-count.interceptor';

describe('httpCountInterceptor', () => {
  let httpCallCount: Partial<jest.Mocked<HttpCallCountService>>;
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => httpCountInterceptor(req, next));

  beforeEach(() => {
    httpCallCount = {
      increment: jest.fn(),
      decrement: jest.fn(),
    };
    TestBed.configureTestingModule({
      providers: [{ provide: HttpCallCountService, useValue: httpCallCount }],
    });
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should increment the call count', () => {
    const req = {} as HttpRequest<unknown>;
    const next = jest.fn().mockReturnValue(of({}));
    interceptor(req, next);
    expect(httpCallCount.increment).toHaveBeenCalled();
    expect(httpCallCount.decrement).not.toHaveBeenCalled();
  });

  it('should decrement the call count on response', async () => {
    const req = {} as HttpRequest<unknown>;
    const next = jest.fn().mockReturnValue(of({}));
    const result$ = interceptor(req, next);
    expect(httpCallCount.increment).toHaveBeenCalled();
    expect(httpCallCount.decrement).not.toHaveBeenCalled();
    await firstValueFrom(result$);
    expect(httpCallCount.decrement).toHaveBeenCalled();
  });
});
