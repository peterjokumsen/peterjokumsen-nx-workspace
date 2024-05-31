import { PLATFORM_ID } from '@angular/core';
import { PjBrowserTools } from './';
import { PjLogger } from '../pj-logger';
import { TestBed } from '@angular/core/testing';

describe(PjBrowserTools.name, () => {
  let service: PjBrowserTools;

  let checkPlatformSpy: jest.SpyInstance<boolean>;

  describe('when PLATFORM_ID is not provided', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          // keep split
          { provide: PLATFORM_ID, useValue: undefined },
          PjBrowserTools,
        ],
      });
      service = TestBed.inject(PjBrowserTools);
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
          PjBrowserTools,
        ],
      });
    });

    describe.each(['browser', 'server'])('as "%s"', (id: string) => {
      it(`should return ${id === 'browser'}`, () => {
        platformId = id;
        service = TestBed.inject(PjBrowserTools);
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
            PjBrowserTools,
          ],
        });
        service = TestBed.inject(PjBrowserTools);
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

      describe('getOrCreateLinkElement', () => {
        describe('when "window" is null', () => {
          it('should return null', () => {
            jest.spyOn(service, 'window', 'get').mockReturnValue(null);
            const element = service.getOrCreateLinkElement('test-id');
            expect(element).toBeFalsy();
          });
        });

        describe('when "window" is defined', () => {
          let foundElement: HTMLLinkElement | null;
          let result: HTMLLinkElement | null;

          beforeEach(() => {
            jest.spyOn(service, 'window', 'get').mockReturnValue(window);
            checkPlatformSpy.mockReturnValue(true);
            window.document.getElementById = jest.fn(() => foundElement);
            window.document.head.appendChild = jest.fn();
          });

          it('should use getElementById', () => {
            foundElement = {} as HTMLLinkElement;
            service.getOrCreateLinkElement('test-id');
            expect(window.document.getElementById).toHaveBeenCalledWith(
              'test-id',
            );
          });

          describe('and "getElementById" has value', () => {
            beforeEach(() => {
              foundElement = { id: '123' } as HTMLLinkElement;
              result = service.getOrCreateLinkElement('test-id');
            });

            it('should return found element', () => {
              expect(result?.id).toBe('123');
            });

            it('should not appendChild to document head', () => {
              expect(window.document.head.appendChild).not.toHaveBeenCalled();
            });
          });

          describe('and "getElementById" returns undefined', () => {
            let generatedElement: HTMLLinkElement;
            beforeEach(() => {
              foundElement = null;
              generatedElement = { id: '123' } as HTMLLinkElement;
              window.document.createElement = jest
                .fn()
                .mockReturnValue(generatedElement);
              result = service.getOrCreateLinkElement('test-id');
            });

            it('should set id of generated element', () => {
              expect(generatedElement.id).toEqual('test-id');
            });

            it('should return generated element', () => {
              expect(result).toEqual(generatedElement);
            });

            it('should create the element', () => {
              expect(window.document.createElement).toHaveBeenCalledWith(
                'link',
              );
            });

            it('should append element to head', () => {
              expect(window.document.head.appendChild).toHaveBeenCalledWith(
                generatedElement,
              );
            });
          });
        });
      });
    },
  );
});
