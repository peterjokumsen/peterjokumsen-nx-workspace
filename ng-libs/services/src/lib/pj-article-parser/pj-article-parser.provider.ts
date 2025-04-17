import { Provider } from '@angular/core';
import { PjArticleParser } from './';

export function providePjArticleParser(): Provider[] {
  return [PjArticleParser];
}
