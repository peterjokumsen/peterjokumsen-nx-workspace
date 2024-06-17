import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { MarkdownAst, MarkdownSection } from '@peterjokumsen/ts-md-models';

import { CommonModule } from '@angular/common';
import { SectionComponent } from '../components';

@Component({
  selector: 'pj-mdr-md-renderer',
  standalone: true,
  imports: [CommonModule, SectionComponent],
  template: `
    @for (section of sections(); track section.title) {
      @defer (on viewport) {
        <pj-mdr-section [section]="section"></pj-mdr-section>
      } @placeholder {
        <pj-mdr-section></pj-mdr-section>
      }
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdRendererComponent {
  parsedContent = input<MarkdownAst>();
  sections = computed<MarkdownSection[]>(
    () => this.parsedContent()?.sections ?? [],
  );
}
