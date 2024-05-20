import { Pipe, PipeTransform, SecurityContext, inject } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'splitToAnchor',
  standalone: true,
})
export class SplitToAnchorPipe implements PipeTransform {
  private _sanitizer = inject(DomSanitizer);

  transform(value: string): string {
    const regex = /\[(.*?)\]\((.*?)\)/g;
    const matches = value.match(regex);
    for (const match of matches ?? []) {
      const [fullMatch, text, url] = match.match(/\[(.*?)\]\((.*?)\)/) ?? [];
      if (!fullMatch) continue;

      value = value.replace(
        fullMatch,
        `<a href="${this._sanitizer.sanitize(SecurityContext.URL, url)}">${text}</a>`,
      );
    }

    return value;
  }
}
