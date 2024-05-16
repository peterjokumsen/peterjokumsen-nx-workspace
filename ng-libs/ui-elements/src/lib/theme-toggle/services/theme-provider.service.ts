import { Injectable, inject, signal } from '@angular/core';

import { PjBrowserProviders } from '@peterjokumsen/ng-services';
import { Themes } from '../themes.type';

@Injectable()
export class ThemeProviderService {
  private _providers = inject(PjBrowserProviders);
  private _window = this._providers.window;
  private _localStorage = this._providers.localStorage;
  private _themeSignal = signal<Themes>(this.getTheme());

  theme = this._themeSignal.asReadonly();

  protected getTheme(): Themes {
    let theme = this._localStorage?.getItem('theme') as Themes | undefined;
    if (theme) {
      return theme;
    }

    theme = this._window?.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    return theme;
  }

  setTheme(theme: Themes): void {
    this._localStorage?.setItem('theme', theme);
    this._themeSignal.update(() => theme);
  }
}
