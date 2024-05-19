import { Injectable, inject } from '@angular/core';

import { PjBrowserProviders } from '../pj-browser-providers';
import { PjThemes } from './models';

@Injectable()
export class PjTheme {
  private _provider = inject(PjBrowserProviders);

  setTheme(theme: PjThemes): void {
    const browserWindow = this._provider.window;
    if (!browserWindow) return;
    let styleElement = browserWindow.document?.getElementById(
      'theme-style',
    ) as HTMLLinkElement;
    if (!styleElement) {
      styleElement = browserWindow.document.createElement('link');
      styleElement.id = 'theme-style';
      styleElement.rel = 'stylesheet';
      browserWindow.document.head.appendChild(styleElement);
    }

    styleElement.href = `${theme}-theme.css`;
  }
}
