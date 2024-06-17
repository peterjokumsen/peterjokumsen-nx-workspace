import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { MarkdownSection } from '@peterjokumsen/ts-md-models';
import { OrderedListComponent } from './ordered-list.component';
import { ParagraphComponent } from './paragraph.component';

@Component({
  selector: 'pj-mdr-section',
  standalone: true,
  imports: [
    CommonModule,
    ParagraphComponent,
    ListComponent,
    OrderedListComponent,
  ],
  template: `
    <section class="section">
      <h2>{{ title }}</h2>
      @for (element of elements(); track element.type) {
        @switch (element.type) {
          @case ('paragraph') {
            <pj-mdr-paragraph [content]="element"></pj-mdr-paragraph>
          }
          @case ('list') {
            <pj-mdr-list [content]="element"></pj-mdr-list>
          }
          @case ('ordered-list') {
            <pj-mdr-ordered-list [content]="element"></pj-mdr-ordered-list>
          }
        }
        <!--
      <pj-mdr-quote *if="element.type === 'quote'" [quote]="element"></pj-mdr-md-quote>
      <pj-mdr-horizontal-rule *if="element.type === 'horizontal-rule'"></pj-mdr-md-horizontal-rule>
      <pj-mdr-image *if="element.type === 'image'" [image]="element"></pj-mdr-md-image>
      <pj-mdr-link *if="element.type === 'link'" [link]="element"></pj-mdr-md-link>
      <pj-mdr-section *if="element.type === 'section'" [section]="element"></pj-mdr-md-section>
      -->
      }
    </section>
  `,
  styles: `
    .section {
      min-height: 100vh;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionComponent {
  section = input<MarkdownSection>();
  title = computed(() => this.section()?.title);
  elements = computed(() => {
    return this.section()?.content;
  });
}
