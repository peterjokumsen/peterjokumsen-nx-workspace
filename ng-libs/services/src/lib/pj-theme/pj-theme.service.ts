import { BehaviorSubject, map } from 'rxjs';
import { Injectable, inject } from '@angular/core';

import { PjBrowserTools } from '../pj-browser-tools';
import { PjThemes } from './models';

@Injectable()
export class PjTheme {
  protected _themeSubject = new BehaviorSubject<PjThemes | undefined>(
    undefined,
  );

  private _provider = inject(PjBrowserTools);

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
    const styleElement = this._provider.getOrCreateLinkElement('theme-style');
    if (!styleElement) {
      return;
    }

    if (styleElement.href?.includes(theme) !== true) {
      styleElement.href = `${theme}-theme.css`;
    }

    this._provider.localStorage?.setItem('theme', theme);
    this._themeSubject.next(theme);
  }
}
