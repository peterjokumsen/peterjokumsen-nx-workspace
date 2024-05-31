import { PjBrowserTools } from './pj-browser-tools.service';
import { Provider } from '@angular/core';

export function providePjBrowserTools(): Provider[] {
  return [PjBrowserTools];
}
