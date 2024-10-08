import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MarkdownType, mdModelCheck } from '@peterjokumsen/ts-md-models';

import { ExpectedContentTypes } from '../filter-content-types';
import { HasContent } from '../has-content';
import { MdContentService } from '../services';
import { PjLogger } from '@peterjokumsen/ng-services';
import { WithId } from '../models';
import { logUnexpectedContent } from '../fns';

type InnerAnchorTypes = Extract<ExpectedContentTypes, 'image' | 'text'>;

type MdAnchorContent = WithId<MarkdownType<'link' | InnerAnchorTypes>>;
type MappedAnchor = Omit<MarkdownType<'link'>, 'content'> & {
  ariaLabel: string;
  content: MdAnchorContent[];
  target: '_blank' | '_self';
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

        @if (anchor()?.target === '_blank') {
          <mat-icon aria-hidden="false" aria-label="Open in new tab">
            open_in_new
          </mat-icon>
        }
      </a>
    }
  `,
  styleUrl: './md-link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdLinkComponent implements HasContent<'link'> {
  private _mdContent = inject(MdContentService);
  private _logger = inject(PjLogger, { optional: true });

  anchor = signal<MappedAnchor | null>(null);

  set content(value: HasContent<'link'>['content']) {
    let newContent: MappedAnchor | null = null;
    if (typeof value !== 'string' && mdModelCheck('link', value)) {
      const content = this.getContents(value);
      newContent = {
        type: 'link',
        ariaLabel: this.createAriaLabel(content),
        href: value.href,
        content,
        target: value.href.startsWith('http') ? '_blank' : '_self',
      };
    } else {
      logUnexpectedContent('MdLinkComponent', value, this._logger?.to);
    }

    this.anchor.update(() => newContent);
  }

  private getContents(parent: MarkdownType<'link'>): MdAnchorContent[] {
    if (typeof parent.content === 'string') {
      return [this._mdContent.mapContent<InnerAnchorTypes>(parent.content)];
    }

    return parent.content.reduce((arr, content) => {
      switch (content.type) {
        case 'text':
        case 'image':
          arr.push(this._mdContent.mapContent(content));
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
      .map((c) => {
        switch (c.type) {
          case 'text':
            return c.content;

          case 'image':
            return c.alt;

          default:
            this._logger?.to.error(
              'Unknown content for aria-label of MdLinkComponent, received %o',
              c,
            );
            return '';
        }
      })
      .join(' ');
  }
}
