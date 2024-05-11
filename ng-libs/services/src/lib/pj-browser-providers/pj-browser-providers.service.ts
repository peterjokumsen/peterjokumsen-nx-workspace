import { Injectable, PLATFORM_ID, inject } from '@angular/core';

import { PjLogger } from '../pj-logger';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class PjBrowserProviders {
  private _logger = inject(PjLogger, { optional: true });
  private _platformId = inject(PLATFORM_ID, { optional: true });
  private _localStorage: Storage | null | undefined;
  private _window: Window | null | undefined;

  get window(): Window | null {
    if (this._window !== undefined) return this._window;
    this._logger?.to.group('PjWindow.window');
    this._logger?.to.log(
      'PjWindow.window | PLATFORM_ID: "%s"',
      this._platformId,
    );
    if (this.usingBrowser()) {
      this._logger?.to.log('PjWindow.window | Browser platform detected');
      this._window = window;
    } else {
      this._window = null;
    }

    this._logger?.to.groupEnd();
    return this._window;
  }

  get localStorage(): Storage | null {
    if (this._localStorage !== undefined) return this._localStorage;
    this._logger?.to.group('PjWindow.localStorage');
    this._logger?.to.log(
      'PjWindow.localStorage | PLATFORM_ID: "%s"',
      this._platformId,
    );
    if (this.usingBrowser()) {
      this._logger?.to.log('PjWindow.localStorage | Browser platform detected');
      this._localStorage = localStorage;
    } else {
      this._localStorage = null;
    }

    this._logger?.to.groupEnd();
    return this._localStorage;
  }

  usingBrowser(): boolean {
    return !!this._platformId && isPlatformBrowser(this._platformId);
  }
}
