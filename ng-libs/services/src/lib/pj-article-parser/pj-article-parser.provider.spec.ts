import { PjArticleParser, providePjArticleParser } from './';

import { TestBed } from '@angular/core/testing';

describe('providePjArticleParser', () => {
  it('should provide PjArticleParser', () => {
    TestBed.configureTestingModule({
      providers: providePjArticleParser(),
    });
    expect(TestBed.inject(PjArticleParser)).toBeTruthy();
  });
});
