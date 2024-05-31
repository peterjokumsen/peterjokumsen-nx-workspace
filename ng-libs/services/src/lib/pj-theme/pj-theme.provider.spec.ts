import { PjTheme, providePjTheme } from './';

import { PjBrowserTools } from '../pj-browser-tools';
import { TestBed } from '@angular/core/testing';

describe('providePjTheme', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PjBrowserTools, providePjTheme()],
    });
  });

  it('should provide PjTheme service', () => {
    expect(TestBed.inject(PjTheme)).toBeTruthy();
  });
});
