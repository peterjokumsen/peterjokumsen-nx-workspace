import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { MarkdownAst, MarkdownSection } from '@peterjokumsen/ts-md-models';

import { CommonModule } from '@angular/common';
import { MdContentService } from '../services';
import { SectionComponent } from '../components';
import { WithId } from '../models';

@Component({
  selector: 'pj-mdr-md-renderer',
  standalone: true,
  imports: [CommonModule, SectionComponent],
  providers: [MdContentService],
  template: `
    @for (section of sections(); track section.id) {
      @defer (on viewport) {
        <pj-mdr-section [section]="section"></pj-mdr-section>
      } @placeholder {
        <div class="placeholder" style="height: 100vh"></div>
      }
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdRendererComponent {
  private _uniqueContentService = inject(MdContentService);

  parsedContent = input<MarkdownAst>();
  sections = computed<WithId<MarkdownSection>[]>(() => {
    const sections = this.parsedContent()?.sections ?? [];
    return sections.map((s) => this._uniqueContentService.addId(s));
  });
}
