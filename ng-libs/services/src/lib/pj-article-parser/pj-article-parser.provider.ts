import { PjArticleParser } from './';
import { Provider } from '@angular/core';

export function providePjArticleParser(): Provider[] {
  return [PjArticleParser];
}
