import { PjBrowserProviders } from './pj-browser-providers.service';
import { TestBed } from '@angular/core/testing';
import { providePjBrowserProviders } from './pj-browser-providers.provider';

describe(providePjBrowserProviders.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: providePjBrowserProviders(),
    });
  });

  it(`should provide ${PjBrowserProviders.name}`, () => {
    expect(TestBed.inject(PjBrowserProviders)).toBeTruthy();
  });
});
