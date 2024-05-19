import { BehaviorSubject, map } from 'rxjs';
import { Injectable, inject } from '@angular/core';

import { PjBrowserProviders } from '../pj-browser-providers';
import { PjThemes } from './models';

@Injectable()
export class PjTheme {
  protected _themeSubject = new BehaviorSubject<PjThemes | undefined>(
    undefined,
  );

  private _provider = inject(PjBrowserProviders);

  theme$ = this._themeSubject
    .asObservable()
    .pipe(map((theme) => theme || this.getTheme()));

  protected getTheme(): PjThemes {
    let theme = this._provider.localStorage?.getItem('theme') as
      | PjThemes
      | undefined;
    if (theme) {
      return theme;
    }

    theme = this._provider.window?.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light';
    return theme;
  }

  setTheme(theme: PjThemes): void {
    if (!this._provider.window) return;
    let styleElement = this._provider.window.document?.getElementById(
      'theme-style',
    ) as HTMLLinkElement;
    if (!styleElement) {
      styleElement = this._provider.window.document.createElement('link');
      styleElement.id = 'theme-style';
      styleElement.rel = 'stylesheet';
      this._provider.window.document.head.appendChild(styleElement);
    }

    styleElement.href = `${theme}-theme.css`;
    this._provider.localStorage?.setItem('theme', theme);
    this._themeSubject.next(theme);
  }
}
