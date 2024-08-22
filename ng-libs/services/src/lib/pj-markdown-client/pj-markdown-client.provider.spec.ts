import { PjMarkdownClient, providePjMarkdownClient } from './';

import { TestBed } from '@angular/core/testing';
import { MarkdownParserService } from './services';

describe('providePjTheme', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [providePjMarkdownClient()],
    });
  });

  it('should provide PjMarkdownClient service', () => {
    expect(TestBed.inject(PjMarkdownClient)).toBeTruthy();
  });

  it('should provide MarkdownParserService service', () => {
    expect(TestBed.inject(MarkdownParserService)).toBeTruthy();
  });
});
