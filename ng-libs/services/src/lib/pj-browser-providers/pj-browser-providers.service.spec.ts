import { PLATFORM_ID } from '@angular/core';
import { PjBrowserProviders } from './pj-browser-providers.service';
import { PjLogger } from '../pj-logger';
import { TestBed } from '@angular/core/testing';

describe(PjBrowserProviders.name, () => {
  let service: PjBrowserProviders;

  let checkPlatformSpy: jest.SpyInstance<boolean>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: null },
        {
          provide: PjLogger,
          useValue: {
            to: { group: jest.fn(), groupEnd: jest.fn(), log: jest.fn() },
          },
        },
        PjBrowserProviders,
      ],
    });
    service = TestBed.inject(PjBrowserProviders);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('usingBrowser', () => {
    it('should return false if platformId is not provided', () => {
      expect(service.usingBrowser()).toBeFalsy();
    });
  });

  describe('window', () => {
    beforeEach(() => {
      checkPlatformSpy = jest.spyOn(service, 'usingBrowser');
    });

    it('should return null if platform is not browser', () => {
      checkPlatformSpy.mockReturnValue(false);
      expect(service.window).toBeNull();
    });

    it('should return window if platform is browser', () => {
      checkPlatformSpy.mockReturnValue(true);
      expect(service.window).toBe(window);
    });
  });

  describe('localStorage', () => {
    beforeEach(() => {
      checkPlatformSpy = jest.spyOn(service, 'usingBrowser');
    });

    it('should return null if platform is not browser', () => {
      checkPlatformSpy.mockReturnValue(false);
      expect(service.localStorage).toBeNull();
    });

    it('should return localStorage if platform is browser', () => {
      checkPlatformSpy.mockReturnValue(true);
      expect(service.localStorage).toBe(localStorage);
    });
  });
});
