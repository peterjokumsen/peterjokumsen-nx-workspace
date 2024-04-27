import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ArticleNavService {
  generateId(title: string): string {
    return title
      .toLowerCase()
      .replace(/\s/g, '-')
      .replace(/[^\w-]/g, '');
  }
}
