import { PjMarkdownClient, providePjMarkdownClient } from './';

import { TestBed } from '@angular/core/testing';

describe('providePjTheme', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [providePjMarkdownClient()],
    });
  });

  it('should provide PjMarkdownClient service', () => {
    expect(TestBed.inject(PjMarkdownClient)).toBeTruthy();
  });
});
