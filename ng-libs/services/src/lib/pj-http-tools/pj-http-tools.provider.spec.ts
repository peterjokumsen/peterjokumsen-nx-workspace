import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { providePjHttpTools } from './';

describe(providePjHttpTools.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [providePjHttpTools({ production: false })],
    });
  });

  it('should provide HttpClient', () => {
    expect(TestBed.inject(HttpClient)).toBeTruthy();
  });
});
