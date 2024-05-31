import { PjBrowserTools, providePjBrowserTools } from './';

import { TestBed } from '@angular/core/testing';

describe(providePjBrowserTools.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: providePjBrowserTools(),
    });
  });

  it(`should provide ${PjBrowserTools.name}`, () => {
    expect(TestBed.inject(PjBrowserTools)).toBeTruthy();
  });
});
