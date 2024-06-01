import { BehaviorSubject, map } from 'rxjs';
import { Injectable, inject } from '@angular/core';

import { PjBrowserTools } from '../pj-browser-tools';
import { PjThemes } from './models';

@Injectable()
export class PjTheme {
  protected _themeSubject = new BehaviorSubject<PjThemes | undefined>(
    undefined,
  );

  private _browserTools = inject(PjBrowserTools);

  theme$ = this._themeSubject
    .asObservable()
    .pipe(map((theme) => theme || this.getTheme()));

  protected getTheme(): PjThemes {
    let theme = this._browserTools.localStorage?.getItem('theme') as
      | PjThemes
      | undefined;
    if (theme) {
      return theme;
    }

    theme = this._browserTools.window?.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches
      ? 'dark'
      : 'light';
    return theme;
  }

  setTheme(theme: PjThemes): void {
    const links = [
      this._browserTools.getOrCreateLinkElement('light-theme'),
      this._browserTools.getOrCreateLinkElement('dark-theme'),
    ];

    for (const link of links) {
      if (!link) continue;
      link.rel = link.id.includes(theme) ? 'stylesheet' : '';
    }

    this._browserTools.localStorage?.setItem('theme', theme);
    this._themeSubject.next(theme);
  }
}
