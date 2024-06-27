import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { MarkdownType } from '@peterjokumsen/ts-md-models';
import { WithId } from '../models';

@Component({
  selector: 'pj-mdr-md-title',
  template: `
    <ng-template #headerLabel>
      <!-- Add additional functionality for header label -->
      {{ title() }}
    </ng-template>
    @switch (nestLevel) {
      @case (1) {
        <h1>
          <ng-container *ngTemplateOutlet="headerLabel"></ng-container>
        </h1>
      }
      @case (2) {
        <h2>
          <ng-container *ngTemplateOutlet="headerLabel"></ng-container>
        </h2>
      }
      @case (3) {
        <h3>
          <ng-container *ngTemplateOutlet="headerLabel"></ng-container>
        </h3>
      }
      @case (4) {
        <h4>
          <ng-container *ngTemplateOutlet="headerLabel"></ng-container>
        </h4>
      }
      @case (5) {
        <h5>
          <ng-container *ngTemplateOutlet="headerLabel"></ng-container>
        </h5>
      }
      @case (6) {
        <h6>
          <ng-container *ngTemplateOutlet="headerLabel"></ng-container>
        </h6>
      }
      @default {
        <h1>
          <ng-container *ngTemplateOutlet="headerLabel"></ng-container>
        </h1>
      }
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdTitleComponent {
  title = signal('');
  nestLevel = 2;
  set section(value: WithId<MarkdownType<'section'>>) {
    this.title.update(() => value.title);
  }
}
