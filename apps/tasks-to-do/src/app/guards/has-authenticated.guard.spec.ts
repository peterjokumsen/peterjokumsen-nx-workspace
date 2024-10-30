import { CanActivateFn } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { hasAuthenticatedGuard } from './has-authenticated.guard';

describe('hasAuthenticatedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() =>
      hasAuthenticatedGuard(...guardParameters),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
