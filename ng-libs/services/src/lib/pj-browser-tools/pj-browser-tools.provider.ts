import { Provider } from '@angular/core';
import { PjBrowserTools } from './pj-browser-tools.service';

export function providePjBrowserTools(): Provider[] {
  return [PjBrowserTools];
}
