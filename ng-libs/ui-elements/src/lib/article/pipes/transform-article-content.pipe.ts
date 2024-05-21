import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Pipe, PipeTransform, SecurityContext, inject } from '@angular/core';

interface TransformElement {
  matched: string;
  url: string;
  title: string;
}

@Pipe({
  name: 'transformArticleContent',
  standalone: true,
})
export class TransformArticleContentPipe implements PipeTransform {
  private _sanitizer = inject(DomSanitizer);

  private extractElement(
    value: string,
    type: 'image' | 'link',
  ): TransformElement[] {
    const regexToUse =
      type === 'image' ? /!\[(.*?)]\((.*?)\)/ : /\[(.*?)]\((.*?)\)/;
    const regex = new RegExp(regexToUse, 'g');
    const matches = value.match(regex);
    const result: TransformElement[] = [];
    for (const match of matches ?? []) {
      const [matched, title, rawUrl] = match.match(regexToUse) ?? [];
      if (!matched) continue;
      const url = this._sanitizer.sanitize(SecurityContext.URL, rawUrl);
      if (!url) continue;
      result.push({ matched, url, title });
    }

    return result;
  }

  private transformImageMarkdown(value: string): string {
    const images = this.extractElement(value, 'image');
    return images.reduce(
      (acc, { matched, url, title }) =>
        acc.replace(
          matched,
          `<img srcSet="${url}" alt="${title}" class="image" />`,
        ),
      value,
    );
  }

  private transformLinkMarkdown(value: string): string {
    const links = this.extractElement(value, 'link');
    for (const { matched, url, title } of links) {
      const target = url.startsWith('http') ? ' target="_blank"' : '';
      value = value.replace(
        matched,
        `<a href="${url}"${target} class="link">${title}</a>`,
      );
    }

    return value;
  }

  transform(value: string | string[] | undefined): string | SafeHtml {
    if (!value) return '';
    if (Array.isArray(value)) value = value.join(' ');

    value = this.transformImageMarkdown(value);
    value = this.transformLinkMarkdown(value);

    return this._sanitizer.bypassSecurityTrustHtml(value);
  }
}
