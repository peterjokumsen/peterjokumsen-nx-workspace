import { TestBed } from '@angular/core/testing';
import { GameStore } from './game-store';

describe('GameStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameStore],
    });
  });

  function getStore() {
    return TestBed.inject(GameStore);
  }

  it('should be created', () => {
    expect(getStore()).toBeTruthy();
  });
});
