import { Injectable } from '@angular/core';
import { PjBrowserProviders } from '@peterjokumsen/ng-services';
import { TestBed } from '@angular/core/testing';
import { ThemeProviderService } from './theme-provider.service';

@Injectable()
class ThemeProviderServiceExposed extends ThemeProviderService {
  getThemeExposed(): string {
    return super.getTheme();
  }
}

describe(ThemeProviderService.name, () => {
  let service: ThemeProviderServiceExposed;
  let windowSpy: Partial<jest.Mocked<Window>>;
  let localStorageSpy: Partial<jest.Mocked<Storage>>;

  beforeEach(() => {
    windowSpy = {
      matchMedia: jest
        .fn()
        .mockImplementation(() => ({ matches: false }) as MediaQueryList),
    };
    localStorageSpy = { getItem: jest.fn(), setItem: jest.fn() };
    const browserProviders: Partial<PjBrowserProviders> = {
      window: windowSpy as Window,
      localStorage: localStorageSpy as Storage,
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: PjBrowserProviders, useValue: browserProviders },
        ThemeProviderServiceExposed,
      ],
    });
    service = TestBed.inject(ThemeProviderServiceExposed);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTheme', () => {
    it('should use window.matchMedia to determine starting theme', () => {
      windowSpy.matchMedia?.mockReturnValue({
        matches: true,
      } as MediaQueryList);
      service.getThemeExposed();
      expect(windowSpy.matchMedia).toHaveBeenCalledWith(
        '(prefers-color-scheme: dark)',
      );
    });

    it('should return dark theme if prefers-color-scheme is dark', () => {
      windowSpy.matchMedia?.mockReturnValue({
        matches: true,
      } as MediaQueryList);
      expect(service.getThemeExposed()).toEqual('dark');
    });

    it('should return light theme if prefers-color-scheme is light', () => {
      windowSpy.matchMedia?.mockReturnValue({
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

  describe('setTheme', () => {
    it('should set theme in localStorage', () => {
      service.setTheme('dark');
      expect(localStorageSpy.setItem).toHaveBeenCalledWith('theme', 'dark');
    });
  });
});
