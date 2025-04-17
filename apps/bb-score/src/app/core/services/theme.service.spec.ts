import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { Theme, ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThemeService, { provide: PLATFORM_ID, useValue: 'browser' }],
    });

    service = TestBed.inject(ThemeService);
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with system theme when no preference is stored', async () => {
    const initialTheme = localStorage.getItem('theme');
    expect(initialTheme).toBeNull();

    const actual = await firstValueFrom(service.theme$);
    expect(actual).toBe('system');
  });

  it('should update theme and persist to localStorage', async () => {
    service.setTheme('light');

    expect(localStorage.getItem('theme')).toBe('light');

    const actual = await firstValueFrom(service.theme$);
    expect(actual).toBe('light');
  });

  it('should handle all theme types', async () => {
    const themes: Theme[] = ['light', 'dark', 'system'];

    for (const theme of themes) {
      service.setTheme(theme);
      expect(localStorage.getItem('theme')).toBe(theme);

      const actual = await firstValueFrom(service.theme$);
      expect(actual).toBe(theme);
    }
  });

  it('should not throw errors when running on server platform', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [ThemeService, { provide: PLATFORM_ID, useValue: 'server' }],
    });

    const serverService = TestBed.inject(ThemeService);
    expect(() => serverService.setTheme('dark')).not.toThrow();
  });
});
