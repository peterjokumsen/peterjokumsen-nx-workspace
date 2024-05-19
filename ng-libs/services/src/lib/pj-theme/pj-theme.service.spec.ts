import { PjTheme, PjThemes } from './';

import { PjBrowserProviders } from '../pj-browser-providers';
import { TestBed } from '@angular/core/testing';

describe(`${PjTheme.name}`, () => {
  let service: PjTheme;
  let windowSpy: (Partial<Window> & { document: jest.Mocked<Document> }) | null;
  let providerSpy: Partial<PjBrowserProviders>;

  beforeEach(() => {
    windowSpy = {
      document: {
        getElementById: jest.fn(),
        createElement: jest.fn(),
        head: {
          appendChild: jest.fn(),
        },
      } as unknown as jest.Mocked<Document>,
    };
    providerSpy = {
      get window() {
        return windowSpy as Window | null;
      },
    };

    TestBed.configureTestingModule({
      providers: [
        // keep split
        { provide: PjBrowserProviders, useValue: providerSpy },
        PjTheme,
      ],
    });
    service = TestBed.inject(PjTheme);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setTheme', () => {
    describe('when window is available', () => {
      describe('and style element is not found', () => {
        it.each(['dark', 'light'])(
          'should create "%s" style element',
          (theme) => {
            if (!windowSpy) fail('windowSpy should be defined for test');
            windowSpy.document?.getElementById.mockReturnValue(null);
            const linkElement = {} as HTMLLinkElement;
            windowSpy.document.createElement.mockReturnValue(linkElement);

            service.setTheme(theme as PjThemes);

            expect(windowSpy.document.getElementById).toHaveBeenCalledWith(
              'theme-style',
            );
            expect(windowSpy.document.createElement).toHaveBeenCalledWith(
              'link',
            );
            expect(windowSpy.document.head.appendChild).toHaveBeenCalledWith(
              linkElement,
            );
            expect(linkElement.id).toEqual('theme-style');
            expect(linkElement.rel).toEqual('stylesheet');
            expect(linkElement.href).toEqual(`${theme}-theme.css`);
          },
        );
      });

      describe('and style element is found', () => {
        it.each(['light', 'dark'])(
          'should change theme to "%s"',
          (theme: string) => {
            const styleElement = {
              id: 'theme-style',
            } as unknown as HTMLLinkElement;
            if (!windowSpy) fail('windowSpy should be defined for test');
            windowSpy.document.getElementById.mockReturnValue(styleElement);

            service.setTheme(theme as PjThemes);

            expect(windowSpy.document.getElementById).toHaveBeenCalledWith(
              'theme-style',
            );
            expect(styleElement.href).toBe(`${theme}-theme.css`);
          },
        );
      });
    });

    describe('when window is not available', () => {
      it('should not throw error', () => {
        windowSpy = null;
        expect(() => service.setTheme('light')).not.toThrow();
      });
    });
  });
});
