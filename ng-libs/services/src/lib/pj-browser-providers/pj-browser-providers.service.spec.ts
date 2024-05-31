import { PLATFORM_ID } from '@angular/core';
import { PjBrowserProviders } from './';
import { PjLogger } from '../pj-logger';
import { TestBed } from '@angular/core/testing';

describe(PjBrowserProviders.name, () => {
  let service: PjBrowserProviders;

  let checkPlatformSpy: jest.SpyInstance<boolean>;

  describe('when PLATFORM_ID is not provided', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          // keep split
          { provide: PLATFORM_ID, useValue: undefined },
          PjBrowserProviders,
        ],
      });
      service = TestBed.inject(PjBrowserProviders);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    describe('usingBrowser', () => {
      it('should return false', () => {
        expect(service.usingBrowser()).toBeFalsy();
      });
    });
  });

  describe('when PLATFORM_ID is provided', () => {
    let platformId: string;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          // keep split
          { provide: PLATFORM_ID, useFactory: () => platformId },
          PjBrowserProviders,
        ],
      });
    });

    describe.each(['browser', 'server'])('as "%s"', (id: string) => {
      it(`should return ${id === 'browser'}`, () => {
        platformId = id;
        service = TestBed.inject(PjBrowserProviders);
        expect(service.usingBrowser()).toEqual(id === 'browser');
      });
    });
  });

  describe.each(['provided', 'not provided'])(
    'when logger is %s',
    (state: string) => {
      beforeEach(() => {
        let logger: PjLogger | undefined = undefined;
        if (state === 'provided') {
          logger = {
            to: { group: jest.fn(), groupEnd: jest.fn(), log: jest.fn() },
          } as unknown as PjLogger;
        }

        TestBed.configureTestingModule({
          providers: [
            {
              provide: PjLogger,
              useValue: logger,
            },
            PjBrowserProviders,
          ],
        });
        service = TestBed.inject(PjBrowserProviders);
      });

      it('should be created', () => {
        expect(service).toBeTruthy();
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
    },
  );
});
