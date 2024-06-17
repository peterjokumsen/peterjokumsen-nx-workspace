import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import {
  animate,
  animateChild,
  keyframes,
  query,
  stagger,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

import { CommonModule } from '@angular/common';
import { MarkdownSection } from '@peterjokumsen/ts-md-models';
import { MatButton } from '@angular/material/button';
import { WithId } from '../models';

@Component({
  selector: 'pj-mdr-table-of-contents',
  standalone: true,
  imports: [CommonModule, MatButton],
  templateUrl: './table-of-contents.component.html',
  styleUrl: './table-of-contents.component.scss',
  animations: [
    trigger('list', [
      transition('* => *', [
        query('@inOutAnimation', stagger(50, animateChild()), {
          optional: true,
        }),
      ]),
    ]),
    trigger('inOutAnimation', [
      state('in', style({ transform: 'translateX(0)', height: '*' })),
      transition(':enter', [
        animate(
          300,
          keyframes([
            style({ offset: 0, transform: 'translateX(100%)' }),
            style({ offset: 1, transform: 'translateX(0)' }),
          ]),
        ),
      ]),
      transition(':leave', [
        animate(
          300,
          keyframes([
            style({ offset: 0, transform: 'translateX(0)' }),
            style({ offset: 0.25, transform: 'translateX(50%)' }),
            style({ offset: 0.5, transform: 'translateX(75%)' }),
            style({ offset: 0.75, transform: 'translateX(100%)', height: '*' }),
            style({ offset: 1, height: 0 }),
          ]),
        ),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableOfContentsComponent {
  sections = input<WithId<MarkdownSection>[]>([]);
  inViewSectionId = input<string>();
  sectionClick = output<string>();
}
