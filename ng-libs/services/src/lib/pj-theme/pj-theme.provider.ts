import { PjTheme } from './pj-theme.service';
import { Provider } from '@angular/core';

export function providePjTheme(): Provider[] {
  return [PjTheme];
}
