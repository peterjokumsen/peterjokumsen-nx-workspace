import { PjMarkdownClient, providePjMarkdownClient } from './';

import { MarkdownParserService } from './services';
import { TestBed } from '@angular/core/testing';
import { providePjHttpTools } from '../pj-http-tools';

describe('providePjMarkdownClient', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        providePjHttpTools({ production: false }),
        providePjMarkdownClient(),
      ],
    });
  });

  it('should provide PjMarkdownClient service', () => {
    expect(TestBed.inject(PjMarkdownClient)).toBeTruthy();
  });

  it('should provide MarkdownParserService service', () => {
    expect(TestBed.inject(MarkdownParserService)).toBeTruthy();
  });
});
