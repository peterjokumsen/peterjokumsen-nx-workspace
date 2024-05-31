import { PjTheme, PjThemes } from './';

import { Injectable } from '@angular/core';
import { PjBrowserTools } from '../pj-browser-tools';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

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
  let windowSpy: Partial<jest.Mocked<Window>>;
  let localStorageSpy: Partial<jest.Mocked<Storage>>;
  let browserProviderSpy: Partial<jest.Mocked<PjBrowserTools>>;

  beforeEach(() => {
    windowSpy = {
      matchMedia: jest.fn(),
    };
    localStorageSpy = {
      getItem: jest.fn(),
      setItem: jest.fn(),
    };
    browserProviderSpy = {
      get localStorage() {
        return localStorageSpy as Storage | null;
      },
      get window() {
        return windowSpy as Window;
      },
      getOrCreateLinkElement: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        // keep split
        { provide: PjBrowserTools, useValue: browserProviderSpy },
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
      browserProviderSpy.getOrCreateLinkElement?.mockImplementation(
        () => styleElement,
      );
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

    it('should use "getOrCreateLinkElement"', () => {
      service.setTheme('dark');
      expect(browserProviderSpy.getOrCreateLinkElement).toHaveBeenCalledWith(
        'theme-style',
      );
    });

    it('should set href in link element', () => {
      service.setTheme('dark');
      expect(styleElement?.href).toEqual('dark-theme.css');
    });

    describe('when link element is null', () => {
      it('should not throw error', () => {
        styleElement = null;
        expect(() => service.setTheme('light')).not.toThrow();
      });
    });
  });
});
