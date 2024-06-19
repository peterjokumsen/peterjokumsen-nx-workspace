import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HasContent } from '../has-content';
import { MarkdownContent } from '@peterjokumsen/ts-md-models';
import { WithId } from '../models';

@Component({
  selector: 'pj-mdr-md-paragraph',
  standalone: true,
  imports: [CommonModule],
  template: `<p>md-paragraph works!</p>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdParagraphComponent implements HasContent {
  content: string | MarkdownContent | WithId<MarkdownContent> = '';
}
