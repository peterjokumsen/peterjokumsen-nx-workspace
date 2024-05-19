import { PjTheme, providePjTheme } from './';

import { PjBrowserProviders } from '../pj-browser-providers';
import { TestBed } from '@angular/core/testing';

describe('providePjTheme', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PjBrowserProviders, providePjTheme()],
    });
  });

  it('should provide PjTheme service', () => {
    expect(TestBed.inject(PjTheme)).toBeTruthy();
  });
});
