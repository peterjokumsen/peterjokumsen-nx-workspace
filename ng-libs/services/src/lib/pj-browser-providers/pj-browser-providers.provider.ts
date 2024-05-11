import { PjBrowserProviders } from './pj-browser-providers.service';
import { Provider } from '@angular/core';

export function providePjBrowserProviders(): Provider[] {
  return [PjBrowserProviders];
}
