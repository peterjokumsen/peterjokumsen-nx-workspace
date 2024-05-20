import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Pipe, PipeTransform, SecurityContext, inject } from '@angular/core';

@Pipe({
  name: 'splitToAnchor',
  standalone: true,
})
export class SplitToAnchorPipe implements PipeTransform {
  private _sanitizer = inject(DomSanitizer);

  transform(value: string | string[] | undefined): string | SafeHtml {
    if (!value) return '';
    if (Array.isArray(value)) value = value.join(' ');

    const regex = /\[(.*?)\]\((.*?)\)/g;
    const matches = value.match(regex);
    for (const match of matches ?? []) {
      const [fullMatch, text, url] = match.match(/\[(.*?)\]\((.*?)\)/) ?? [];
      if (!fullMatch) continue;

      const sanitizedUrl = this._sanitizer.sanitize(SecurityContext.URL, url);
      const target = sanitizedUrl?.startsWith('http') ? ' target="_blank"' : '';
      value = value.replace(
        fullMatch,
        `<a href="${sanitizedUrl}"${target} class="link">${text}</a>`,
      );
    }

    return this._sanitizer.bypassSecurityTrustHtml(value);
  }
}
