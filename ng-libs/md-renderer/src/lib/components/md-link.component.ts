import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  MarkdownCode,
  MarkdownContent,
  MarkdownImage,
  MarkdownLink,
  MarkdownText,
  mdModelCheck,
} from '@peterjokumsen/ts-md-models';

import { HasContent } from '../has-content';
import { MdContentService } from '../services';
import { PjLogger } from '@peterjokumsen/ng-services';
import { WithId } from '../models';

type MdAnchorContent = WithId<MarkdownText | MarkdownImage | MarkdownCode>;
type MappedAnchor = Omit<MarkdownLink, 'content'> & {
  ariaLabel: string;
  content: MdAnchorContent[];
};

@Component({
  selector: 'pj-mdr-md-link',
  template: `
    @if (anchor()) {
      <a [href]="anchor()?.href" [attr.aria-label]="anchor()?.ariaLabel">
        @for (content of anchor()?.content; track content.id) {
          <pj-mdr-md-wrapper
            [pjMdrMdContentInjection]="content"
          ></pj-mdr-md-wrapper>
        }
      </a>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdLinkComponent implements HasContent {
  private _mdContent = inject(MdContentService);
  private _logger = inject(PjLogger, { optional: true });

  anchor = signal<MappedAnchor | null>(null);

  set content(value: string | MarkdownContent | WithId<MarkdownContent>) {
    let newContent: MappedAnchor | null = null;
    if (typeof value === 'string') {
      this._logger?.to.warn(
        'Invalid content for MdLinkComponent, received "%s"',
        value,
      );
    } else if (mdModelCheck('link', value)) {
      const content = this.getContents(value);
      newContent = {
        type: 'link',
        ariaLabel: this.createAriaLabel(content),
        href: value.href,
        content,
      };
    } else {
      this._logger?.to.warn(
        'Invalid content type "%s" for MdLinkComponent, received %o',
        value.type,
        value,
      );
    }

    this.anchor.update(() => newContent);
  }

  private getContents(parent: MarkdownLink): MdAnchorContent[] {
    if (typeof parent.content === 'string') {
      return [
        this._mdContent.mapContent(parent.content) as WithId<MarkdownText>,
      ];
    }

    return parent.content.reduce((arr, content) => {
      switch (content.type) {
        case 'text':
        case 'image':
        case 'code':
          arr.push(
            this._mdContent.mapContent(content) as WithId<MdAnchorContent>,
          );
          break;

        default:
          this._logger?.to.error(
            'Invalid content type "%s" for contents of MdLinkComponent, received %o',
            content.type,
            content,
          );
          break;
      }

      return arr;
    }, [] as MdAnchorContent[]);
  }

  private createAriaLabel(contents: MdAnchorContent[]): string {
    return contents
      .map((c) => (c.type === 'image' ? c.alt : c.content))
      .join(' ');
  }
}
