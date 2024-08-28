import { HttpCallCountService, providePjHttpTools } from './';

import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

describe(providePjHttpTools.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [providePjHttpTools({ production: false })],
    });
  });

  it('should provide HttpClient', () => {
    expect(TestBed.inject(HttpClient)).toBeTruthy();
  });

  it('should provide HttpCallCountService', () => {
    expect(TestBed.inject(HttpCallCountService)).toBeTruthy();
  });
});
