import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _platformId = inject(PLATFORM_ID);
  private _themeSubject = new BehaviorSubject<Theme>('system');

  theme$ = this._themeSubject.asObservable();

  constructor() {
    // Initialize theme from localStorage or use system preference
    const savedTheme = (localStorage.getItem('theme') as Theme) ?? 'system';
    this.setTheme(savedTheme);
  }

  private applyTheme(theme: Theme) {
    if (!isPlatformBrowser(this._platformId)) return;
    const root = document.querySelector(':root') as HTMLElement;
    if (!root) return;
    const nextTheme = theme === 'system' ? 'light dark' : theme;
    root.style.colorScheme = nextTheme;
  }

  setTheme(theme: Theme) {
    this._themeSubject.next(theme);
    localStorage.setItem('theme', theme);
    this.applyTheme(theme);
  }
}
