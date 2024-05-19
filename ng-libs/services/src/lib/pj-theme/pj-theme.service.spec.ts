import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { PjTheme, PjThemes } from './';

import { Injectable } from '@angular/core';
import { PjBrowserProviders } from '../pj-browser-providers';
import { TestBed } from '@angular/core/testing';

@Injectable()
class PjThemeExposed extends PjTheme {
  getThemeExposed(): PjThemes {
    return super.getTheme();
  }

  override getTheme(): PjThemes {
    return super.getTheme();
  }
}

describe(`${PjTheme.name}`, () => {
  let service: PjThemeExposed;
  let windowSpy:
    | (Partial<Window & jest.Mocked<Window>> & {
        document: jest.Mocked<Document>;
      })
    | null;
  let localStorageSpy: Partial<jest.Mocked<Storage>>;
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
      matchMedia: jest.fn(),
    };
    localStorageSpy = {
      getItem: jest.fn(),
      setItem: jest.fn(),
    };
    providerSpy = {
      get window() {
        return windowSpy as Window | null;
      },
      get localStorage() {
        return localStorageSpy as Storage | null;
      },
    };

    TestBed.configureTestingModule({
      providers: [
        // keep split
        { provide: PjBrowserProviders, useValue: providerSpy },
        PjThemeExposed,
      ],
    });
    service = TestBed.inject(PjThemeExposed);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTheme', () => {
    it('should use window.matchMedia to determine starting theme', () => {
      windowSpy?.matchMedia?.mockReturnValue({
        matches: true,
      } as MediaQueryList);
      service.getThemeExposed();
      expect(windowSpy?.matchMedia).toHaveBeenCalledWith(
        '(prefers-color-scheme: dark)',
      );
    });

    it('should return dark theme if prefers-color-scheme is dark', () => {
      windowSpy?.matchMedia?.mockReturnValue({
        matches: true,
      } as MediaQueryList);
      expect(service.getThemeExposed()).toEqual('dark');
    });

    it('should return light theme if prefers-color-scheme is light', () => {
      windowSpy?.matchMedia?.mockReturnValue({
        matches: false,
      } as MediaQueryList);
      expect(service.getThemeExposed()).toEqual('light');
    });

    describe('when localStorage has a theme', () => {
      it('should use localStorage theme', () => {
        localStorageSpy.getItem?.mockReturnValue('light');
        expect(service.getThemeExposed()).toEqual('light');
        expect(localStorageSpy.getItem).toHaveBeenCalledWith('theme');
      });
    });
  });

  describe('theme$', () => {
    it('should return result of getTheme', async () => {
      jest.spyOn(service, 'getTheme').mockImplementation(() => 'light');
      const result = await firstValueFrom(service.theme$);
      expect(result).toEqual('light');
    });
  });

  describe('setTheme', () => {
    let styleElement: HTMLLinkElement | null;

    beforeEach(() => {
      styleElement = {
        id: 'theme-style',
      } as unknown as HTMLLinkElement;
      if (!windowSpy) fail('windowSpy should be defined for test');
      windowSpy.document.getElementById.mockImplementation(() => styleElement);
    });

    it('should emit theme', async () => {
      jest.spyOn(service, 'getTheme').mockReturnValue('light');
      service.setTheme('dark');
      const result = await firstValueFrom(service.theme$);
      expect(result).toEqual('dark');
    });

    it('should set theme in localStorage', () => {
      service.setTheme('dark');
      expect(localStorageSpy.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    describe('when window is available', () => {
      describe('and style element is not found', () => {
        it.each(['dark', 'light'])(
          'should create "%s" style element',
          (theme) => {
            if (!windowSpy) fail('windowSpy should be defined for test');
            styleElement = null;
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
            service.setTheme(theme as PjThemes);

            expect(windowSpy?.document.getElementById).toHaveBeenCalledWith(
              'theme-style',
            );
            expect(styleElement?.href).toBe(`${theme}-theme.css`);
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
