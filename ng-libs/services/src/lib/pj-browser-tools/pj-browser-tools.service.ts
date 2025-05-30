import { Injectable, PLATFORM_ID, inject } from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { PjLogger } from '../pj-logger';

@Injectable()
export class PjBrowserTools {
  private readonly _name = PjBrowserTools.name;
  private _logger = inject(PjLogger, { optional: true });
  private _platformId = inject(PLATFORM_ID, { optional: true });
  private _localStorage: Storage | null | undefined;
  private _window: Window | null | undefined;

  get window(): Window | null {
    if (this._window !== undefined) return this._window;
    this._logger?.to.group(`${this._name}.window`);
    this._logger?.to.log('PLATFORM_ID: "%s"', this._platformId);
    if (this.usingBrowser()) {
      this._logger?.to.log('Browser platform detected');
      this._window = window;
    } else {
      this._window = null;
    }

    this._logger?.to.groupEnd();
    return this._window;
  }

  get localStorage(): Storage | null {
    if (this._localStorage !== undefined) return this._localStorage;
    this._logger?.to.group(`${this._name}.localStorage`);
    this._logger?.to.log('PLATFORM_ID: "%s"', this._platformId);
    if (this.usingBrowser()) {
      this._logger?.to.log('Browser platform detected');
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

  getOrCreateLinkElement(id: string): HTMLLinkElement | null {
    this._logger?.to.group(`${this._name}.getOrCreateLinkElement("${id}")`);
    const currentWindow = this.window;
    if (!currentWindow) {
      this._logger?.to.log(
        'not in browser or window not defined, returning null',
      );
      this._logger?.to.groupEnd();
      return null;
    }

    const foundElement = currentWindow.document.getElementById(
      id,
    ) as HTMLLinkElement;
    if (foundElement) {
      this._logger?.to.log('found element');
      this._logger?.to.groupEnd();
      return foundElement;
    }

    this._logger?.to.log('creating new link element');
    const newElement = currentWindow.document.createElement('link');
    newElement.id = id;
    this._logger?.to.log('appending element to head');
    currentWindow.document.head.appendChild(newElement);
    this._logger?.to.groupEnd();
    return newElement;
  }
}
